<template>
  <div id="baseDiv" @contextmenu="rightClickHandler($event)">
    <div id="inputBar">
      <input v-model="verseAddressInput" v-on:keyup.enter="onClickGo" ref="verseInput"/>
      <button @click="onClickGo">Go</button>
      <span style="margin-left: 30px;">
        <button @click="showNextVerse(false)">&#60; Prev</button>
        <button @click="showNextVerse(true)">Next &#62;</button>
      </span>
      <span style="margin-left: 30px;">
        <button @click="increaseFontSize(false)">-</button>
        <button @click="increaseFontSize(true)">+</button>
      </span>
      <span id="errorDisplay" style="margin-left: 30px; color: darkred; font-weight: bold;">
        {{ errorDisplay }}
      </span>
    </div>
    <div id="verseContainer">
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
  </div>
</template>

<script>
import axios from 'axios'

var baseUrl = 'https://ryben.github.io/verse/verses/' // TODO: Put constants in one place
var bookNamesFilename = 'books.json'
var sourceFileExt = '.json'
var maxBookCount = 66
let MAX_VERSE_CHAPTER_INDICATOR = -1


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
    verseAddress: function() {
      this.fetchVerseContent()
    }
  },
  methods: {
    onClickGo: function() {
      this.errorDisplay = null
      try {
        this.verseAddress = this.parseVerseInput(this.verseAddressInput)
        this.fetchVerseContent(this.verseAddress, this.displayVerseContent)
        
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
    parseVerseInput: function(verseInput) {
      let verseAddressRegex =
                ("(?:([iI]{1,3}|\\d+)\\s+)?" // number before book
                        + "([a-zA-Z]+(?: [a-zA-Z]+)*)" // book
                        + "\\s+"      // space after book
                        + "(\\d+)"  // chapter
                        + "(?:\\.|:|\\s+)" // chapter-verse separator
                        + "(\\d+)") // verse
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
    fetchVerseContent: function() {
      if (!this.bible[this.verseAddress.book]) {
        let fetchUrl = baseUrl + this.verseAddress.book + sourceFileExt

        axios.get(fetchUrl).then(response => {
          this.bible[this.verseAddress.book] = response.data // cache the fetched book content
          this.displayVerseContent(this.verseAddress)
        })
      } else {
        this.displayVerseContent(this.verseAddress)
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

  #inputBar {
    padding: 30px;
  }

  #verseContainer {
    padding: 50px;
    background: rgba(2, 2, 2, 0.7);
    border-radius: 50px;
    font-family: Arial, Helvetica, sans-serif;
    height: 77%;
    margin-left: 30px;
    margin-right: 30px;
  }

  #verseTitle {
    color: white;
    font-size: 50px;
  }

  #verseTranslation {
    color: yellow;
    font-style: oblique;
    font-size: 35px;
  }

  #verseContent {
    color: white;
    text-align: center;
    font-size: 72px;
  }

</style>