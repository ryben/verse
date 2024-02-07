<template>
  <div id="verseContainer" tabindex="0" @keydown.left="showNextVerse(false)" @keydown.right="showNextVerse(true)"
    @keydown.page-up="showNextVerse(false)" @keydown.page-down="showNextVerse(true)" @keydown.esc="focusInput()"
    @keydown.down="increaseFontSize(false)" @keydown.up="increaseFontSize(true)">
    <div id="verseTitleTranslationContainer">
      <div id="verseTitle">
        {{ verseInfo.title.toUpperCase() }}
      </div>
      <div id="verseTranslation">
        {{ verseInfo.translation.toUpperCase() }}
      </div>
    </div>
    <div id="verseContent" :style="verseFont">
      {{ verseInfo.content }}
    </div>
  </div>
</template>


<script>

let MAX_VERSE_CHAPTER_INDICATOR = -1
const maxBookCount = 66

export default {

  name: 'VerseDisplay',
  props: {
    msg: String
  },
  data: function () {
    return {
      bible: {},
      bookNames: ['Genesis'],
      verseAddress: {},
      verseFontSize: 72,
      verseInfo: {
        title: 'Genesis 1:1',
        translation: 'Ang Dating Biblia',
        content: ''
      }
    }
  },
  mounted: function () {
    // TODO: Make sure booknames are loaded first
    this.fetchBookNames(this.loadVerseParamQuery)
    // this.fetchTranslations()
    this.fetchTranslationsStub()
  },
  computed: {
    verseFont() {
      if (this.isAutosizeText) {
        return {
          fontFamily: 'Helvetica'
        }
      } else {
        return {
          fontSize: this.verseFontSize + 'px',
          fontFamily: 'Helvetica'
        }
      }
    }
  },
  watch: {
    verseAddress: function (newVal) {
      this.errorDisplay = null
      this.fetchVerseContent(newVal)
    },
    verseTranslation: function (newVal) {
      this.errorDisplay = null
      this.verseAddress['translation'] = newVal
      this.fetchVerseContent(this.verseAddress)
      this.saveVerseToLocalStorage(this.verseAddress)
    },
    isAddTextBg: function (newVal) {
      if (newVal == false) {
        document.getElementById('verseContainer').style.background = ''
      } else {
        document.getElementById('verseContainer').style.background = '#00000099'
      }
      this.saveTextBgToLocalStorage(newVal)
    },
  },
  methods: {
    showNextVerse: function (isNextVerse) {
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

      this.verseAddress = {
        'translation': this.verseTranslation,
        'book': book,
        'chapter': chapter,
        'verse': verse
      }

      this.saveVerseToLocalStorage(this.verseAddress)
    },


    increaseFontSize: function (isIncrease) {
      this.verseFontSize += (3 * (isIncrease ? 1 : -1))
      this.saveFontSizeToLocalStorage(this.verseFontSize)
    },


    rightClickHandler: function (event) {
      event.preventDefault();
      this.focusInput()
    },
  }
}

</script>


<style>
#verseContainer {
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
  margin-top: 50px;
}



@media screen and (min-width: 1201px),
screen and (min-height: 700px) {
  #verseContainer {
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 100px;
    padding-right: 100px;
  }

  #verseContent {
    font-size: 80px;
  }

  #verseTitle {
    font-size: 50px;
  }

  #verseTranslation {
    font-size: 35px;
    margin-top: 10px;
  }
}

@media screen and (max-width: 1200px),
screen and (max-height: 700px) {
  #verseContainer {
    padding-top: 40px;
    padding-bottom: 30px;
    padding-left: 50px;
    padding-right: 50px;
  }

  #verseContent {
    font-size: 45px;
  }

  #verseTitle {
    font-size: 25px;
  }

  #verseTranslation {
    font-size: 25px;
    margin-top: 10px;
  }
}

@media screen and (max-width: 800px) {
  #verseContainer {
    padding-top: 30px;
    padding-bottom: 20px;
    padding-left: 5px;
    padding-right: 5px;
  }

  #verseContent {
    margin-top: 20px;
    font-size: 30px;
  }

  #verseTitle {
    font-size: 25px;
  }

  #verseTranslation {
    font-size: 13px;
    margin-top: 5px;
  }
}

@media screen and (max-height: 400px) {
  #verseContainer {
    padding-top: 0px;
    padding-bottom: 20px;
    padding-left: 5px;
    padding-right: 5px;
  }

  #verseTitleTranslationContainer {
    font-size: 25px;
    margin-left: 20px;
    min-width: 120px;
  }

  #verseTitle {
    font-size: 18px;
  }

  #verseTranslation {
    font-size: 13px;
    margin-top: 5px;
  }

  #verseContent {
    margin-top: 20px;
    font-size: 20px;
    margin-left: 40px;
    margin-right: 20px;
  }
}

@media screen and (max-height: 200px) {
  #verseContainer {
    padding-top: 0px;
    padding-bottom: 20px;
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
  }

  #verseTitleTranslationContainer {
    font-size: 25px;
    text-align: center;
    margin-left: 10px;
    min-width: 100px;
  }

  #verseTitle {
    font-size: 13px;
  }

  #verseTranslation {
    font-size: 10px;
    margin-top: 5px;
  }

  #verseContent {
    margin-top: 0px;
    font-size: 17px;
    margin-left: 20px;
    margin-right: 20px;
  }
}

@media screen and (max-width: 400px) {
  #verseContainer {
    padding-top: 30px;
    padding-bottom: 20px;
    padding-left: 5px;
    padding-right: 5px;
  }

  #verseContent {
    margin-top: 20px;
    font-size: 20px;
  }

  #verseTitle {
    font-size: 17px;
  }

  #verseTranslation {
    font-size: 13px;
    margin-top: 5px;
  }
}
</style>