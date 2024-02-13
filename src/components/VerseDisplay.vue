<template>
  <div id="verseContainer" tabindex="0" @keydown="handleKeydown" v-on:copy="handleCopy">
    <div id="verseTitleTranslationContainer">
      <div id="verseTitle">
        {{ verseDetails.title.toUpperCase() }}
      </div>
      <div id="verseVersion">
        {{ verseDetails.version.toUpperCase() }}
      </div>
    </div>
    <div id="verseContent" :style="verseFont">
      {{ verseDetails.content }}
    </div>
  </div>
</template>


<script>

import { mapState } from 'vuex';

export default {
  name: 'VerseDisplay',
  props: [],
  data: function () {
    return {
    }
  },
  mounted() {
    this.$nextTick(() => {
      const content = document.getElementById('verseContainer')
      content.addEventListener('copy', this.handleCopy)
    })
  },
  computed: {
    ...mapState(['verseDetails', 'verseFontSize', 'isAutosizeText']),
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
  methods: {
    showNextVerse: function (isNextVerse) {
      this.$store.dispatch('showNextVerse', isNextVerse)
    },
    increaseFontSize(isIncrease) {
      this.$store.dispatch('increaseFontSize', isIncrease)
    },
    focusInput() {
      this.$emit('focus-input')
    },
    handleCopy(e) {
      e.preventDefault(); // Prevent the default copy behavior
      const selection = document.getSelection();
      if (selection) {
        e.clipboardData.setData('text/plain', selection.toString()); // Copy only the text part
      }
    },
    handleKeydown(event) {
      switch (event.key) {
        case 'ArrowLeft':
        case 'PageUp':
          this.showNextVerse(false);
          break;
        case 'ArrowRight':
        case 'PageDown':
          this.showNextVerse(true);
          break;
        case 'Escape':
          this.focusInput();
          break;
        case 'ArrowDown':
          this.increaseFontSize(false);
          break;
        case 'ArrowUp':
          this.increaseFontSize(true);
          break;
      }
    },
    beforeDestroy() {
      const content = document.getElementById('verseContainer');
      if (content) {
        content.removeEventListener('copy', this.handleCopy);
      }
    }
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

#verseVersion {
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

  #verseVersion {
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

  #verseVersion {
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

  #verseVersion {
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

  #verseVersion {
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

  #verseVersion {
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

  #verseVersion {
    font-size: 13px;
    margin-top: 5px;
  }
}
</style>