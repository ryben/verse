<template>
    <div></div>
</template>

<script>


import { storageManager } from '../utils/storageManager.js';
import { utils } from '@/utils/utils.js';
import { EventBus } from '@/utils/eventBus.js';

export const BG_CUSTOM_URL = "BG_CUSTOM_URL"


export default {

    data: function () {
        return {
            selectedBg: '',
            bgCustomImgUrl: '',
            isAddTextBg: '',
            defaultBg: 'blue.jpg',
        }
    },
    created() {
        EventBus.$on('add-text-bg', this.addTextBg);
    },
    beforeDestroy() {
        EventBus.$offon('add-text-bg');
    },
    mounted: function () {
        let bgSettings = storageManager.loadBgSettingsFromLocalStorage()

        this.isAddTextBg = bgSettings.isAddTextBg
        this.bgCustomImgUrl = bgSettings.bgCustomImgUrl
        this.selectedBg = bgSettings.selectedBg

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
        bgCustomImgUrl: function (newVal) {
            this.onSelectBg(this.selectedBg)
            this.saveBgImageCustomUrlToLocalStorage(newVal)
        }
    },

    methods: {
        getGdriveShareLinkRegex: function () {
            return ".*drive\\.google\\.com\\/file\\/d\\/" // GDrive share link start
                + "(.*)" // book
                + "\\/.*" // everything else after
        },
        addTextBg(isAddTextBg) {
            this.isAddTextBg = isAddTextBg
            if (this.isAddTextBg == false) {
                document.getElementById('verseContainer').style.background = ''
            } else {
                document.getElementById('verseContainer').style.background = '#00000099'
            }
            // TODO
            // this.saveTextBgToLocalStorage(newVal)
        },
        selectDefaultBg() {
            this.selectedBg = this.defaultBg
        },

        onSelectBg: function (selectedBg) {
            // TODO: Send event up
            // const bgImgCustomUrlInput = document.getElementById('bgImgCustomUrlInput')

            if (selectedBg == BG_CUSTOM_URL) {
                // TODO: Send event up
                // bgImgCustomUrlInput.style.display = 'inline'
                this.applyBg(this.bgCustomImgUrl)
            } else {
                // TODO: Send event up
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

