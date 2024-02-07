<template>
    <div></div>
</template>

<script>
const BG_CUSTOM_URL = "BG_CUSTOM_URL"

import { storageManager } from '../utils/storageManager.js';
import { utils } from '../utils/utils.js';




export default {

    data: function () {
        return {
            selectedBg: '',
            bgCustomImgUrl: '',
            isAddTextBg: '',
            backgrounds: {
                'Blue BG': 'blue.jpg',
                'Brown BG': 'brown.jpg',
                'Orange': 'orange.jpg',
                'White': 'white.jpg',
                'Image URL': BG_CUSTOM_URL
            },
        }
    },

    mounted: function () {
        let bgSettings = storageManager.loadBgSettingsFromLocalStorage()
        Object.keys(bgSettings).forEach(key => {
            console.log(key)
            this[key] = bgSettings[key];
        });

        if (this.selectedBg == null) {
            this.selectDefaultBg()
        }

        // Check if has valid custom background
        if (this.selectedBg == BG_CUSTOM_URL && utils.isEmpty(this.bgCustomImgUrl)) {
            this.selectDefaultBg()
        }
    },

    watch: {
        selectedBg: function (newVal) {
            this.onSelectBg(newVal)
            storageManager.saveBgImageToLocalStorage(newVal)
        },
        // TODO
        // bgCustomImgUrl: function (newVal) {
        //     this.onSelectBg(this.selectedBg)
        //     this.saveBgImageCustomUrlToLocalStorage(newVal)
        // }
    },

    methods: {
        getGdriveShareLinkRegex: function () {
            return ".*drive\\.google\\.com\\/file\\/d\\/" // GDrive share link start
                + "(.*)" // book
                + "\\/.*" // everything else after
        },

        selectDefaultBg() {
            this.selectedBg = this.backgrounds[Object.keys(this.backgrounds)[0]]
        },

        onSelectBg: function (selectedBg) {
            // TODO: Send event up
            // const bgImgCustomUrlInput = document.getElementById('bgImgCustomUrlInput')

            if (selectedBg == BG_CUSTOM_URL) {
                // bgImgCustomUrlInput.style.display = 'inline'
                this.applyBg(this.bgCustomImgUrl)
            } else {
                // bgImgCustomUrlInput.style.display = 'none'
                this.applyBg(require('@/assets/' + selectedBg))
            }
        },
        applyBg: function (imgUrl) {
            if (!utils.isEmpty(imgUrl)) {
                let processedUrl = this.processUrl(imgUrl)

                const body = document.querySelector('body')
                body.style.background = 'url(\'' + processedUrl + '\')'
                body.style.backgroundSize = '100% 100%'
                body.style.overflow = 'hidden'
            }
        },
        onEnterCustomUrl: function (event) {
            this.applyBg(event.target.value)
        },
        onPasteCustomUrl: function (event) {
            this.applyBg(event.clipboardData.getData("text"))
        },
        processUrl: function (url) {
            let processedUrl = url
            if (url.match(this.getGdriveShareLinkRegex())) {
                processedUrl = this.gdriveLinkToUrl(processedUrl)
            }

            // check if url resolves to an image

            return processedUrl
        },
        gdriveLinkToUrl: function (gdriveLink) {
            let gdriveRegexLink =
                ".*drive\\.google\\.com\\/file\\/d\\/" // GDrive share link start
                + "(.*)" // book
                + "\\/.*" // everything else after

            let matchGroups = gdriveLink.match(gdriveRegexLink)
            if (matchGroups) {
                return 'https://drive.google.com/uc?id=' + matchGroups[1]
            }
            return ''
        },
    },

}
</script>

