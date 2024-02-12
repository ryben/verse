<template>
    <div></div>
</template>

<script>


import { storageManager } from '../utils/storageManager.js';
import { mapState } from 'vuex';
import { utils } from '@/utils/utils.js';

export const BG_CUSTOM_URL = "BG_CUSTOM_URL"


export default {

    data: function () {
        return {
            bgCustomImgUrl: '',
            defaultBg: 'blue.jpg',
        }
    },

    mounted: function () {
        let bgSettings = storageManager.loadBgSettingsFromLocalStorage()

        // TODO
        // this.isAddTextBg = bgSettings.isAddTextBg
        this.bgCustomImgUrl = bgSettings.bgCustomImgUrl
        // this.selectedBg = bgSettings.selectedBg

        if (this.selectedBg == null) {
            this.selectDefaultBg()
        }

        // Check if has valid custom background
        if (this.selectedBg == BG_CUSTOM_URL && utils.isEmpty(this.bgCustomImgUrl)) {
            this.selectDefaultBg()
        }
    },

    computed: {
        ...mapState({
            isAddTextBg: state => state.isAddTextBg,
            selectedBg: state => state.background
        }),
    },
    watch: {
        selectedBg: function (newVal) {
            this.applyBg(newVal)
            storageManager.saveBgImageToLocalStorage(newVal)
        },
        bgCustomImgUrl: function (newVal) {
            this.applyBg(newVal)
            this.saveBgImageCustomUrlToLocalStorage(newVal)
        },
        isAddTextBg: function() {
            if (this.isAddTextBg == false) {
                document.getElementById('verseContainer').style.background = ''
            } else {
                document.getElementById('verseContainer').style.background = '#00000099'
            }
            // TODO
            // this.saveTextBgToLocalStorage(newVal)
        },
    },

    methods: {
        getGdriveShareLinkRegex: function () {
            return ".*drive\\.google\\.com\\/file\\/d\\/" // GDrive share link start
                + "(.*)" // book
                + "\\/.*" // everything else after
        },
        
        selectDefaultBg() {
            this.selectedBg = this.defaultBg
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

