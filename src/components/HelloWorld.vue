<template>
  <div>
    <div id="inputBar">
      <input v-model="verseAddressInput"/>
      <button @click="onClickGo">Go</button>
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
      verseAddressInput: 'Genesis 1:1',
      verseTitle: 'Genesis 1:1',
      verseTranslation: 'Ang Dating Biblia',
      verseContent: 'Nang pasimula ay...'
    }
  },
  methods: {
    onClickGo: function() {
      let verseAddress = this.parseVerseInput(this.verseAddressInput)
      this.fetchVerseContent(verseAddress, this.displayVerseContent)
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
      return {
        'book': '1', //matchGroups[2],
        'chapter': matchGroups[3] + '',
        'verse': matchGroups[4] + ''
      }
    },
    fetchVerseContent: function(verseAddress, callback) {
      let baseUrl = 'https://ryben.github.io/verse/verses/'

      if (!this.bible[verseAddress.book]) {
        axios.get(baseUrl + verseAddress.book + '.json').then(response => {
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
