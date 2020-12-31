<template>
  <div>
    <div id="inputBar">
      <input v-model="verseAddressInput" v-on:keyup.enter="onClickGo"/>
      <button @click="onClickGo">Go</button>
    </div>
    <div id="errorDisplay">
      {{ errorDisplay }}
    </div>
    <br/>
    <div id="verseTitle">
      {{ verseTitle }}
    </div>
    <div id="verseTranslation">
      {{ verseTranslation }}
    </div>
    <br/>
    <div id="verseContent">
      {{ verseContent }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

var baseUrl = 'https://ryben.github.io/verse/verses/' // TODO: Put constants in one place
var bookNamesFilename = 'books.json'
var sourceFileExt = '.json'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function() {
    return {
      bible: {},
      bookNames: ['Genesis', 'Exodo', 'Levitico', 'Bilang', 'Deuteronomio'],
      verseAddressInput: 'Genesis 1:1',
      verseTitle: 'Genesis 1:1',
      verseTranslation: 'Ang Dating Biblia',
      verseContent: '',
      errorDisplay: null
    }
  },
  mounted: function() {
    // TODO: Make sure booknames are loaded first
    this.fetchBookNames()
    this.onClickGo()
  },
  methods: {
    onClickGo: function() {
      this.errorDisplay = null
      try {
        let verseAddress = this.parseVerseInput(this.verseAddressInput)

        this.fetchVerseContent(verseAddress, this.displayVerseContent)
        
      } catch (error) {
        this.displayError(error)
      }
    },
    parseVerseInput: function(verseInput) {
      let verseAddressRegex =
                ("(?:([iI]{1,3}|\\d+) )?" // number before book
                        + "([a-zA-Z]+(?: [a-zA-Z]+)*)" // book
                        + "[. ]?"      // space after book
                        + "(\\d+)"  // chapter
                        + "[ \\.:]" // chapter-verse separator
                        + "(\\d+)") // verse
      let matchGroups = verseInput.match(verseAddressRegex)
      let bookInput = matchGroups[2]

      let bookMatch = this.findBookMatch(bookInput)

      return {
        'book': bookMatch, //matchGroups[2],
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
      } else {
        throw 'Invalid book name entered' // TODO: Add hint for possible matches
      }
    },
    fetchVerseContent: function(verseAddress, callback) {
      if (!this.bible[verseAddress.book]) {
        let fetchUrl = baseUrl + verseAddress.book + sourceFileExt

        axios.get(fetchUrl).then(response => {
          this.bible[verseAddress.book] = response.data // cache the fetched book content
          callback(verseAddress)
        })
      } else {
        callback(verseAddress)
      }
    },
    fetchBookNames: function() {
      let fetchUrl = baseUrl + bookNamesFilename
      axios.get(fetchUrl).then(response => {
        this.bookNames = response.data
      })
    },
    displayVerseContent: function(verseAddress) {
      try {
        let verseContent = this.bible[verseAddress.book][verseAddress.chapter][verseAddress.verse]
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
    displayError: function(errorMsg) {
      this.errorDisplay = errorMsg
    }

  }
}
</script>
