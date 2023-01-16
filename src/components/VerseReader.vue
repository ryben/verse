<template>
  <div id="baseDiv" 
    @contextmenu="rightClickHandler($event)" >

    <div id="verseContainer"
       tabindex="0"
        @keydown.left="showNextVerse(false)"
        @keydown.right="showNextVerse(true)"
        @keydown.page-up="showNextVerse(false)"
        @keydown.page-down="showNextVerse(true)"
        @keydown.esc="focusInput()"
        @keydown.down="increaseFontSize(false)"
        @keydown.up="increaseFontSize(true)">
      <div id="verseTitle">
        {{ verseInfo.title.toUpperCase() }}
      </div>
      <div id="verseTranslation">
        {{ verseInfo.translation.toUpperCase() }}
      </div>
      <br/>
      <br/>
      <div id="verseContent" :style="verseFont">
        {{ verseInfo.content }}
      </div>
    </div>
    <div id="controlBar">
      <input
        v-model="verseAddressInput"
        v-on:keyup.enter="onClickGo"
        v-on:keyup.up="showNextVerse(false)"
        v-on:keyup.down="showNextVerse(true)"
        v-on:keyup.page-up="showNextVerse(false)"
        v-on:keyup.page-down="showNextVerse(true)"
        id="verseInput" ref="verseInput" @paste="onPasteVerseAddress"/>
      <select name="translation" id="translationInput" class="selector" v-model="verseTranslation">
        <option v-for="(value, key) in translations" :value="key" v-bind:key="key">{{ value }}</option>
      </select>
      <a class="button" @click="onClickGo">Go</a>
      <span style="margin-left: 15px;">
        <a class="button" @click="showNextVerse(false)">&lt;  Prev</a>
        <a class="button" @click="showNextVerse(true)">Next  &gt;</a>
      </span>
      <span style="margin-left: 15px;">
        <a class="button" @click="increaseFontSize(false)">−</a>
        <a class="button" @click="increaseFontSize(true)">+</a>
      </span>
      <label class="toggle">
        <input type="checkbox" v-model="isAddTextBg">
        <span class="labels" data-on="With Text BG" data-off="As Is BG"></span>
      </label>
      <select id="bgSelector" class="selector" v-model="selectedBg">
        <option v-for="(value, key) in backgrounds" :value="value" v-bind:key="key">{{ key }}</option>
      </select>
      <input
        id="bgImgCustomUrlInput"
        style="display:none;"
        v-model="bgCustomImgUrl"
      />
      <span id="errorDisplay" style="margin-left: 15px; color: darkred; font-weight: bold;">
        {{ errorDisplay }}
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

let KEY_VERSE_ADDRESS = "KEY_VERSE_ADDRESS"
let KEY_VERSE_FONT_SIZE = "KEY_VERSE_FONT_SIZE"
let KEY_IS_ADD_TEXT_BG = "KEY_IS_ADD_TEXT_BG"
let KEY_BG_IMAGE = "KEY_BG_IMAGE"
let KEY_BG_IMAGE_CUSTOM_URL = "KEY_BG_IMAGE_CUSTOM_URL"
let BG_CUSTOM_URL = "BG_CUSTOM_URL"

var baseUrl = 'https://ryben.github.io/verse/verses/' // TODO: Put constants in one place
var bookNamesFilename = 'books.json'
var translationsFilename = 'translations.json'
var sourceFileExt = '.json'
var maxBookCount = 66
let MAX_VERSE_CHAPTER_INDICATOR = -1
let verseAddressRegex =
          ("(?:([iI]{1,3}|\\d+)\\s+)?" // number before book
                  + "([a-zA-Z]+(?: [a-zA-Z]+)*)" // book
                  + "\\s+"      // space after book
                  + "(\\d+)"  // chapter
                  + "(?:\\.|:|\\s+)" // chapter-verse separator
                  + "(\\d+)") // verse

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function() {
    return {
      bible: {},
      bookNames: ['Genesis'],
      translations: {'adb' : 'Ang Dating Biblia'},
      backgrounds: {
        'Blue BG' : 'blue.jpg',
        'Brown BG' : 'brown.jpg',
        'Orange' : 'orange.jpg',
        'Image URL' : BG_CUSTOM_URL
      },
      selectedBg : '',
      bgCustomImgUrl : '',
      isAddTextBg : false,
      verseAddressInput: 'Genesis 1:1',
      verseTranslation: 'adb',
      verseInfo: {
        title: 'Genesis 1:1',
        translation: 'Ang Dating Biblia',
        content: ''
      },
      verseAddress: {},
      errorDisplay: null,
      verseFontSize: 72
    }
  },
  mounted: function() {
    // TODO: Make sure booknames are loaded first
    this.fetchBookNames(this.loadParamQuery)
    // this.fetchTranslations()
    this.fetchTranslationsStub()

    window.addEventListener('storage', () => {this.loadFromLocalStorage()})

    this.loadBgSettingsFromLocalStorage()

    // Check if has valid custom background
    if (this.selectedBg == BG_CUSTOM_URL && this.isEmpty(this.bgCustomImgUrl)) {
      this.selectDefaultBg()
    }
  },
  computed: {
    verseFont() {
      return {
          fontSize: this.verseFontSize + 'px',
          fontFamily: 'Helvetica'
      }
    }
  },
  watch: {
    verseAddress: function(newVal) {
      this.errorDisplay = null
      this.fetchVerseContent(newVal)
    },
    verseTranslation: function(newVal) {
      this.errorDisplay = null
      this.verseAddress['translation'] = newVal
      this.fetchVerseContent(this.verseAddress)
      this.saveVerseToLocalStorage(this.verseAddress)
    },
    isAddTextBg: function(newVal) {
      if (newVal == false) {
        document.getElementById('verseContainer').style.background = ''
      } else {
        document.getElementById('verseContainer').style.background = '#00000099'
      }
      this.saveTextBgToLocalStorage(newVal)
    },
    selectedBg: function(newVal) {
      this.onSelectBg(newVal)
      this.saveBgImageToLocalStorage(newVal)
    },
    bgCustomImgUrl: function(newVal) {
      this.onSelectBg(this.selectedBg)
      this.saveBgImageCustomUrlToLocalStorage(newVal)
    }
  },
  methods: {
    saveVerseToLocalStorage: function(verseAddress) {
			localStorage.setItem(KEY_VERSE_ADDRESS, JSON.stringify(verseAddress))
		},
    saveFontSizeToLocalStorage: function(fontSize) {
			localStorage.setItem(KEY_VERSE_FONT_SIZE, fontSize)
		},
    saveTextBgToLocalStorage: function(isAddTextBg) {
			localStorage.setItem(KEY_IS_ADD_TEXT_BG, isAddTextBg)
		},
    saveBgImageToLocalStorage: function(bgImage) {
			localStorage.setItem(KEY_BG_IMAGE, bgImage)
		},
    saveBgImageCustomUrlToLocalStorage: function(bgCustomUrl) {
			localStorage.setItem(KEY_BG_IMAGE_CUSTOM_URL, bgCustomUrl)
		},
		loadFromLocalStorage: function() {
      let savedVerseAddress = localStorage.getItem(KEY_VERSE_ADDRESS)
			this.verseAddress = JSON.parse(savedVerseAddress)

      let savedVerseFontSize = localStorage.getItem(KEY_VERSE_FONT_SIZE)
      if (!isNaN(savedVerseFontSize)) {
        this.verseFontSize = parseInt(savedVerseFontSize)
      }

      this.loadBgSettingsFromLocalStorage()
		},
    loadBgSettingsFromLocalStorage: function() {
      let isAddTextBg = localStorage.getItem(KEY_IS_ADD_TEXT_BG)
      this.isAddTextBg = isAddTextBg == 'true'

      let bgCustomImgUrl = localStorage.getItem(KEY_BG_IMAGE_CUSTOM_URL)
      this.bgCustomImgUrl = bgCustomImgUrl == null ? "" : bgCustomImgUrl

      this.selectedBg = localStorage.getItem(KEY_BG_IMAGE)
      if (this.selectedBg == null) {
        this.selectDefaultBg()
      }
    },
    selectDefaultBg() {
      this.selectedBg = this.backgrounds[Object.keys(this.backgrounds)[0]]
    },
    isEmpty: function(someVar) {
      if (someVar == "" || someVar == null || someVar == undefined) {
        return true
      } else {
        return false
      }
    },
    onClickGo: function() {
      let verseAddress = this.processVerseInput(this.verseAddressInput)
      this.saveVerseToLocalStorage(verseAddress)
    },
    processVerseInput: function(verseInput) {
      this.errorDisplay = null
      try {
        let verseAddress = this.parseVerseInput(verseInput)
        this.fetchVerseContent(verseAddress)
        return verseAddress
      } catch (error) {
        this.displayError('Caught exception: ' + error)
      }
    },
    loadParamQuery: function() {
      var url = new URL(window.location.href);
      let verseParam = url.searchParams.get('v')
      if (verseParam) {
        this.verseAddressInput = verseParam
      }

      this.processVerseInput(this.verseAddressInput)
      this.focusInput()
    },
    focusInput: function() {
      let verseInput = this.$refs.verseInput
      verseInput.focus()
      verseInput.select()
    },
    rightClickHandler: function(event) {
      event.preventDefault();
      this.focusInput()
    },
    onPasteVerseAddress: function(event) {
      let pasted = event.clipboardData.getData('text')
      if (pasted.match(verseAddressRegex)) {
        this.processVerseInput(pasted)
      }
    },
    parseVerseInput: function(verseInput) {
      let matchGroups = verseInput.match(verseAddressRegex)

      if (!matchGroups) {
        throw 'Invalid input'
      }

      let bookInput = matchGroups[2]

      // special shorthand
      if (bookInput.toLowerCase() == 'jn') {
          bookInput = "juan"
      }

      if (matchGroups[1]) { // Number before book e.g. the "2" in "2 Hari"
        bookInput = matchGroups[1] + ' ' + bookInput
      }

      let bookMatch = this.findBookMatch(bookInput)


      return {
        'translation': this.verseTranslation,
        'book': bookMatch,
        'chapter': matchGroups[3] + '',
        'verse': matchGroups[4] + ''
      }
    },
    findBookMatch(bookName) {
      let bookMatches = []

      for (let i=0 ; i<this.bookNames.length ; i++) {
        if (this.bookNames[i].substring(0, bookName.length).toLowerCase() == bookName.toLowerCase()) {
          bookMatches.push(i)
        }
      }

      if (bookMatches.length == 1) {
        return bookMatches[0] + 1 // offset of 1 since book number starts with 1
      } else if (bookMatches.length == 2) {
        let match1 = this.bookNames[bookMatches[0]]
        let match2 = this.bookNames[bookMatches[1]]
        if (this.isSubstringOfOther(match1, match2)) {
          return 1 + (match1.length < match2.length ? bookMatches[0] : bookMatches[1])
        } else {
          return bookMatches[0] + 1 // return the first match
        }
      } else {
        throw 'Invalid book name entered' // TODO: Add hint for possible matches
      }
    },
    isSubstringOfOther(str1, str2) {
      str1 = str1.toLowerCase()
      str2 = str2.toLowerCase()
      
      return str1.substring(0, str2.length) == str2 || str2.substring(0, str1.length) == str1
    },
    fetchVerseContent: function(verseAddress) {
      if (this.verseTranslation != verseAddress['translation']) {
        this.verseTranslation = verseAddress['translation']
      }

      if (!this.bible[this.verseTranslation][verseAddress.book]) {
        let fetchUrl = baseUrl + this.verseTranslation + '/' + verseAddress.book + '' + sourceFileExt

        axios.get(fetchUrl).then(response => {
          this.bible[this.verseTranslation][verseAddress.book] = response.data // cache the fetched book content
          this.displayVerseContent(verseAddress)
        })
      } else {
        this.displayVerseContent(verseAddress)
      }
    },
    fetchBookNames: function(callback) {
      let fetchUrl = baseUrl + this.verseTranslation + "/" + bookNamesFilename
      axios.get(fetchUrl).then(response => {
        this.bookNames = response.data
        callback()
      })
    },
    fetchTranslationsStub: function() {
      let response = {
        "adb" : "Ang Dating Biblia",
        "kjv" : "King James Version"
      }
      Object.keys(response).forEach(key => {
        this.bible[key] = {}
      });
      this.translations = response
    },
    fetchTranslations: function() {
      let fetchUrl = baseUrl + translationsFilename
      axios.get(fetchUrl).then(response => {
        this.translations = response.data
      })
    },
    displayVerseContent: function(verseAddress) {
      try {
        let bookContent = this.bible[this.verseTranslation][verseAddress.book]

        // MAX_VERSE_CHAPTER_INDICATOR is set as value of chapter/verse when next/previous button is tapped and bounds are reached
        if (verseAddress.chapter == MAX_VERSE_CHAPTER_INDICATOR) {
          verseAddress.chapter = Object.keys(bookContent).length
        }

        let chapterContent = bookContent[verseAddress.chapter]
        if (verseAddress.verse == MAX_VERSE_CHAPTER_INDICATOR) {
          verseAddress.verse = Object.keys(chapterContent).length
        }

        let verseContent = chapterContent[verseAddress.verse]

        if (verseContent) {
          this.verseInfo.content = verseContent
          this.verseInfo.title = this.bookNames[verseAddress.book - 1] + ' ' + verseAddress.chapter + ':' + verseAddress.verse
          this.verseInfo.translation = this.translations[this.verseTranslation]
        } else {
          throw 'Verse not found'
        }
        
        this.verseAddress = verseAddress // at this point, the verse address is validated, save the current verse address
      } catch (error) {
        this.displayError('Verse not found')
      }
    },
    showNextVerse: function(isNextVerse) {
      let book = this.verseAddress.book
      let chapter = this.verseAddress.chapter
      let verse = this.verseAddress.verse

      if (isNextVerse) {
        verse++
      } else {
        verse--
      }

      // if reached the end of the chapter
      if (verse > Object.keys(this.bible[this.verseTranslation][book][chapter]).length) {
        chapter++
        verse = 1
      } else if (verse < 1) { // if at start of chapter
        chapter--
        verse = MAX_VERSE_CHAPTER_INDICATOR
      }

      // if reached the end of the book
      if (chapter > Object.keys(this.bible[this.verseTranslation][book]).length) {
        book++
        chapter = 1
      } else if (chapter < 1) {
        book--
        chapter = MAX_VERSE_CHAPTER_INDICATOR
      }

      // if reached end of the bible
      if (book > maxBookCount) {
        book = 1
      } else if (book < 1) {
        book = maxBookCount
      }

      this.verseAddress =  {
        'translation': this.verseTranslation,
        'book': book,
        'chapter': chapter,
        'verse': verse
      }

      this.saveVerseToLocalStorage(this.verseAddress)
    },
    displayError: function(errorMsg) {
      this.errorDisplay = errorMsg
    },
    increaseFontSize: function(isIncrease) {
      this.verseFontSize += (3 * (isIncrease ? 1 : -1))
      this.saveFontSizeToLocalStorage(this.verseFontSize)
    },
    onSelectBg: function(selectedBg) {
      const bgImgCustomUrlInput = document.getElementById('bgImgCustomUrlInput')

      if (selectedBg == BG_CUSTOM_URL) {
        bgImgCustomUrlInput.style.display = 'inline'
        this.applyBg(this.bgCustomImgUrl)
      } else {
        bgImgCustomUrlInput.style.display = 'none'
        this.applyBg(require('@/assets/' + selectedBg))
      }
    },
    applyBg: function(imgUrl) {
      if (!this.isEmpty(imgUrl)) {
        let processedUrl = this.processUrl(imgUrl)

        const body = document.querySelector('body')
        body.style.background = 'url(\'' + processedUrl + '\')'
        body.style.backgroundSize = '100% 100%'
        body.style.overflow = 'hidden'
      }
    },
    onEnterCustomUrl: function(event) {
      this.applyBg(event.target.value)
    },
    onPasteCustomUrl: function(event) {
      this.applyBg(event.clipboardData.getData("text"))
    },
    processUrl: function(url) {
      let processedUrl = url
      if (url.match(this.getGdriveShareLinkRegex())) {
        processedUrl = this.gdriveLinkToUrl(processedUrl)
      }

      // check if url resolves to an image

      return processedUrl
    },
    gdriveLinkToUrl: function(gdriveLink) {
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
    getGdriveShareLinkRegex: function() {
      return ".*drive\\.google\\.com\\/file\\/d\\/" // GDrive share link start
        + "(.*)" // book
        + "\\/.*" // everything else after
    }
  }
}
</script>

<style>
  #baseDiv {
    height: 100%;
  }

  #controlBar {
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  #verseContainer {
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 100px;
    padding-right: 100px;
    /* background: rgba(2, 2, 2, 0.7); */
    border-radius: 80px;
    font-family: Arial, Helvetica, sans-serif;
    height: 77%;
    position: absolute;
    top: 30px;
    left: 30px;
    right: 30px;
    outline: none;
  }

  #verseTitle {
    color: white;
    font-size: 50px;
  }

  #verseTranslation {
    color: yellow;
    font-style: oblique;
    font-size: 35px;
    margin-top: 10px;
  }

  #verseContent {
    color: white;
    text-align: center;
    font-size: 72px;
  }

  .button {
    background-color: #e7e7e7;  /* Gray */
    color: black;
    border: none;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    border-radius: 2px;
    margin: 1px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    user-select: none;
    font-weight: bold;
  }

  input {
    margin: 1px;
    display: inline-block;
    font-size: 12px;
    border-radius: 2px;
    padding: 5px 15px;
    font-weight: bold;
    text-transform: uppercase; 
  }

  #verseInput {
    width: 100px;
  }

  .selector {
    display: inline-block;
    font-size: 11px;
    border-radius: 2px;
    padding: 5px 5px;
    font-weight: bold;
    text-transform: uppercase; 
    background-color: rgb(226, 226, 226);
  }

  #translationInput {
    width: 150px;
  }

  .button:hover {
    background-color: #b4b4b4
  }

  .button:active {
    background-color: #919191;
  }

  #bgImgCustomUrlInput {
    width: 100px;
  }

  /* START Toggle */

 .toggle {
    --width: 80px;
    --height: calc(var(--width) / 3.3);

    position: relative;
    display: inline-block;
    width: var(--width);
    height: var(--height);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    margin-bottom: -8px;
    font-weight: bold;
    margin-left: 20px;
  }

  .toggle input {
    display: none;
  }

  .toggle .labels {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 12px;
    font-family: sans-serif;
    transition: all 0.4s ease-in-out;
    overflow: hidden;
  }

  .toggle .labels::after {
    content: attr(data-off);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    color: #4d4d4d;
    background-color: rgb(226, 226, 226);
    transition: all 0.1s ease-in-out;
  }

  .toggle .labels::before {
    content: attr(data-on);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: calc(var(--width) * -1);
    height: 100%;
    width: 100%;
    color: #ffffff;
    background-color: #585858;
    text-align: center;
    transition: all 0.1s ease-in-out;
  }

  .toggle input:checked~.labels::after {
    transform: translateX(var(--width));
  }

  .toggle input:checked~.labels::before {
    transform: translateX(var(--width));
  }

  /* END Toggle */

</style>