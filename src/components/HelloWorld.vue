<template>
  <div>
    <div id="inputBar">
      <input v-model="verseAddressInput"/>
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
      verseContent: 'Nang pasimula ay...',
      errorDisplay: null
    }
  },
  mounted: function() {
  },
  methods: {
    onClickGo: function() {
      this.errorDisplay = null
      try {
        let verseAddress = this.parseVerseInput(this.verseAddressInput)

        this.fetchVerseContent(verseAddress, this.displayVerseContent)
        this.verseTitle = this.bookNames[verseAddress.book - 1] + ' ' + verseAddress.chapter + ':' + verseAddress.verse
      } catch (error) {
        this.errorDisplay = error
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
        throw 'Invalid book name entered'
      }
    },
    fetchVerseContent: function(verseAddress, callback) {
      let baseUrl = 'https://ryben.github.io/verse/verses/'

      if (!this.bible[verseAddress.book]) {
        let fetchUrl = baseUrl + verseAddress.book + '.json'
        console.log(fetchUrl)
        axios.get(fetchUrl).then(response => {
          this.bible[verseAddress.book] = response.data // cache the fetched book content
          callback(verseAddress)
        })
      } else {
        callback(verseAddress)
      }
    },
    displayVerseContent: function(verseAddress) {
      this.verseContent = this.bible[verseAddress.book][verseAddress.chapter][verseAddress.verse]
    }

  }
}
</script>
