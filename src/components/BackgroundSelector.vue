<script>

export default {

    mounted: function () {
        this.loadBgSettingsFromLocalStorage()

        // Check if has valid custom background
        if (this.selectedBg == BG_CUSTOM_URL && this.isEmpty(this.bgCustomImgUrl)) {
            this.selectDefaultBg()
        }
    },

    watch: {
        isAddTextBg: function (newVal) {
            if (newVal == false) {
                document.getElementById('verseContainer').style.background = ''
            } else {
                document.getElementById('verseContainer').style.background = '#00000099'
            }
            this.saveTextBgToLocalStorage(newVal)
        },
        selectedBg: function (newVal) {
            this.onSelectBg(newVal)
            this.saveBgImageToLocalStorage(newVal)
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

        selectDefaultBg() {
            this.selectedBg = this.backgrounds[Object.keys(this.backgrounds)[0]]
        },

        onSelectBg: function (selectedBg) {
            const bgImgCustomUrlInput = document.getElementById('bgImgCustomUrlInput')

            if (selectedBg == BG_CUSTOM_URL) {
                bgImgCustomUrlInput.style.display = 'inline'
                this.applyBg(this.bgCustomImgUrl)
            } else {
                bgImgCustomUrlInput.style.display = 'none'
                this.applyBg(require('@/assets/' + selectedBg))
            }
        },
        applyBg: function (imgUrl) {
            if (!this.isEmpty(imgUrl)) {
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

