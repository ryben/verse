<template>
  <div id="baseDiv" 
    @contextmenu="rightClickHandler($event)" >

    <div id="verseContainer" 
       tabindex="0"
        @keydown.left="showNextVerse(false)"
        @keydown.right="showNextVerse(true)"
        @keydown.down="increaseFontSize(false)"
        @keydown.up="increaseFontSize(true)">
      <div id="verseTitle">
        {{ verseTitle.toUpperCase() }}
      </div>
      <div id="verseTranslation">
        {{ verseTranslation.toUpperCase() }}
      </div>
      <br/>
      <br/>
      <div id="verseContent" :style="verseFont">
        {{ verseContent }}
      </div>
    </div>
    <div id="controlBar">
      <input v-model="verseAddressInput" v-on:keyup.enter="onClickGo" id="verseInput" ref="verseInput" @paste="onPasteVerseAddress"/>
      <a class="button" @click="onClickGo">Go</a>
      <span style="margin-left: 15px;">
        <a class="button" @click="showNextVerse(false)">◀ Prev</a>
        <a class="button" @click="showNextVerse(true)">Next ▶</a>
      </span>
      <span style="margin-left: 15px;">
        <a class="button" @click="increaseFontSize(false)">−</a>
        <a class="button" @click="increaseFontSize(true)">+</a>
      </span>
      <span id="errorDisplay" style="margin-left: 30px; color: darkred; font-weight: bold;">
        {{ errorDisplay }}
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

var baseUrl = 'https://ryben.github.io/verse/verses/' // TODO: Put constants in one place
var bookNamesFilename = 'books.json'
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
      verseAddressInput: 'Genesis 1:1',
      verseTitle: 'Genesis 1:1',
      verseTranslation: 'Ang Dating Biblia',
      verseAddress: {},
      verseContent: '',
      errorDisplay: null,
      verseFontSize: 72
    }
  },
  mounted: function() {
    // TODO: Make sure booknames are loaded first
    this.fetchBookNames(this.loadParamQuery)
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
    }
  },
  methods: {
    onClickGo: function() {
      this.processVerseInput(this.verseAddressInput)
    },
    processVerseInput: function(verseInput) {
      this.errorDisplay = null
      try {
        let verseAddress = this.parseVerseInput(verseInput)
        this.fetchVerseContent(verseAddress)
      } catch (error) {
        this.displayError(error)
      }
    },
    loadParamQuery: function() {
      var url = new URL(window.location.href);
      let verseParam = url.searchParams.get('v')
      if (verseParam) {
        this.verseAddressInput = verseParam
      }

      this.onClickGo()
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
    onArrowRight: function() {
      alert('Right!')
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

      if (matchGroups[1]) { // Number before book e.g. the "2" in "2 Hari"
        bookInput = matchGroups[1] + ' ' + matchGroups[2]
      }

      let bookMatch = this.findBookMatch(bookInput)

      return {
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
      if (!this.bible[verseAddress.book]) {
        let fetchUrl = baseUrl + verseAddress.book + sourceFileExt

        axios.get(fetchUrl).then(response => {
          this.bible[verseAddress.book] = response.data // cache the fetched book content
          this.displayVerseContent(verseAddress)
        })
      } else {
        this.displayVerseContent(verseAddress)
      }
    },
    fetchBookNames: function(callback) {
      let fetchUrl = baseUrl + bookNamesFilename
      axios.get(fetchUrl).then(response => {
        this.bookNames = response.data
        callback()
      })
    },
    displayVerseContent: function(verseAddress) {
      try {
        let bookContent = this.bible[verseAddress.book]
        if (verseAddress.chapter == MAX_VERSE_CHAPTER_INDICATOR) {
          verseAddress.chapter = Object.keys(bookContent).length
        }

        let chapterContent = bookContent[verseAddress.chapter]
        if (verseAddress.verse == MAX_VERSE_CHAPTER_INDICATOR) {
          verseAddress.verse = Object.keys(chapterContent).length
        }

        let verseContent = chapterContent[verseAddress.verse]

        if (verseContent) {
          this.verseContent = verseContent
          this.verseTitle = this.bookNames[verseAddress.book - 1] + ' ' + verseAddress.chapter + ':' + verseAddress.verse

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

      if (verse > Object.keys(this.bible[book][chapter]).length) {
        chapter++
        verse = 1
      } else if (verse < 1) {
        chapter--
        verse = MAX_VERSE_CHAPTER_INDICATOR
      }

      if (chapter > Object.keys(this.bible[book]).length) {
        book++
        chapter = 1
      } else if (chapter < 1) {
        book--
        chapter = MAX_VERSE_CHAPTER_INDICATOR
      }

      if (book > maxBookCount) {
        book = 1
      } else if (book < 1) {
        book = maxBookCount
      }

      this.verseAddress =  {
        'book': book,
        'chapter': chapter,
        'verse': verse
      }
    },
    displayError: function(errorMsg) {
      this.errorDisplay = errorMsg
    },
    increaseFontSize: function(isIncrease) {
      this.verseFontSize += (3 * (isIncrease ? 1 : -1))
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
    background: rgba(2, 2, 2, 0.7);
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

  #verseInput {
    margin: 1px;
    display: inline-block;
    font-size: 12px;
    border-radius: 2px;
    padding: 5px 15px;
    font-weight: bold;
    text-transform: uppercase; 
    width: 100px;
  }

  .button:hover {
    background-color: #b4b4b4
    
    }

  .button:active {
    background-color: #919191;
  }

</style>