let KEY_VERSE_ADDRESS = "KEY_VERSE_ADDRESS"
let KEY_VERSE_FONT_SIZE = "KEY_VERSE_FONT_SIZE"
let KEY_IS_ADD_TEXT_BG = "KEY_IS_ADD_TEXT_BG"
let KEY_BG_IMAGE = "KEY_BG_IMAGE"
let KEY_BG_IMAGE_CUSTOM_URL = "KEY_BG_IMAGE_CUSTOM_URL"

export const storageManager = {
    
    saveVerseToLocalStorage: function (verseAddress) {
        localStorage.setItem(KEY_VERSE_ADDRESS, JSON.stringify(verseAddress))
    },
    saveFontSizeToLocalStorage: function (fontSize) {
        localStorage.setItem(KEY_VERSE_FONT_SIZE, fontSize)
    },
    saveTextBgToLocalStorage: function (isAddTextBg) {
        localStorage.setItem(KEY_IS_ADD_TEXT_BG, isAddTextBg)
    },
    saveBgImageToLocalStorage: function (bgImage) {
        localStorage.setItem(KEY_BG_IMAGE, bgImage)
    },
    saveBgImageCustomUrlToLocalStorage: function (bgCustomUrl) {
        localStorage.setItem(KEY_BG_IMAGE_CUSTOM_URL, bgCustomUrl)
    },
    loadFromLocalStorage: function () {
        let savedVerseAddress = localStorage.getItem(KEY_VERSE_ADDRESS)
        this.verseAddress = JSON.parse(savedVerseAddress)

        let savedVerseFontSize = localStorage.getItem(KEY_VERSE_FONT_SIZE)
        if (!isNaN(savedVerseFontSize)) {
            this.verseFontSize = parseInt(savedVerseFontSize)
        }

        this.loadBgSettingsFromLocalStorage()
    },
    loadBgSettingsFromLocalStorage: function () {
        let isAddTextBg = localStorage.getItem(KEY_IS_ADD_TEXT_BG)
        this.isAddTextBg = isAddTextBg == 'true'

        let bgCustomImgUrl = localStorage.getItem(KEY_BG_IMAGE_CUSTOM_URL)
        this.bgCustomImgUrl = bgCustomImgUrl == null ? "" : bgCustomImgUrl

        this.selectedBg = localStorage.getItem(KEY_BG_IMAGE)
        if (this.selectedBg == null) {
            this.selectDefaultBg()
        }
    },
}