<template>
  <div id="verseContainer" tabindex="0" @keydown="handleKeydown" v-on:copy="handleCopy">
    <div id="verseTitleTranslationContainer">
      <VerseTitleAndVersion :verse-details="verseDetails" />
    </div>
    <div id="verseContent" ref="verseContent">
      {{ verseDetails.content }}
    </div>
  </div>
</template>


<script>

import VerseTitleAndVersion from '@/components/VerseTitleAndVersion.vue'
import { mapState } from 'vuex';

export default {
  name: 'VerseDisplay',
  props: [],
  components: { VerseTitleAndVersion },
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
  top: 10px;
  left: 10px;
  right: 10px;
  outline: none;

  padding-top: clamp(0.1rem, 2vw + 5vh, 4.4rem);
  padding-left: clamp(0.1rem, 6vw + 2vh, 7rem);
  padding-right: clamp(0.1rem, 5vw, 20rem);
}

#verseContent {
  color: white;
  text-align: center;
  margin-top: clamp(0.1rem, 1vw + 3vh, 10rem);
  font-size: clamp(0.5rem, 1.5vw + 3.5vh, 6rem);
}

@media screen and (max-height: 280px) {
  #verseTitleTranslationContainer {
    margin-top: clamp(0.1rem, 2vw + 3vh, 2rem);
    margin-left: clamp(0.1rem, 0.5vw + 1vh, 0.2rem);
  }

  #verseContainer {
    padding-top: clamp(0.1rem, 1vw + 2vh, 2rem);
    padding-left: clamp(0.1rem, 3vw + 2vh, 3rem);
    padding-right: clamp(0.1rem, 5vw, 3rem);
    display: flex;
  }

  #verseContent {
    margin-top: clamp(0.1rem, 1vw + 3vh, 10rem);
    font-size: clamp(0.5rem, 1.5vw + 3.5vh, 6rem);
    margin-left: clamp(0.1rem, 1vw + 3vh, 10rem);
    margin-right: 5px;
  }
}
</style>