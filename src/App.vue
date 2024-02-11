<template>
  <div id="app">
    <div id="baseDiv" @contextmenu="rightClickHandler($event)">
      <CustomBackground />
      <VerseDisplay :verse-details="verseDetails"/>
      <ControlBar @verse-entered="verseEntered" />
    </div>
    <!-- <VerseReader /> -->
  </div>
</template>

<script>

// import VerseReader from './components/VerseReader.vue'
import CustomBackground from '@/components/CustomBackground.vue'
import VerseDisplay from '@/components/VerseDisplay.vue'
import ControlBar from '@/components/ControlBar.vue'

import BibleService from '@/services/BibleService.js'

export default {
  name: 'App',
  components: {
    // VerseReader
    CustomBackground,
    VerseDisplay,
    ControlBar
  },
  data: function () {
    return {
      verseDetails: {
        'title' : '',
        'version' : '',
        'content' : ''
      }
    }
  },
  methods: {
    async verseEntered(input) {
      let verseInput = input[0]
      let bibleVersionKey = input[1]

      let verseAddress = await BibleService.parseVerseInput(verseInput, bibleVersionKey)

      // Fetch and Display verse 
      this.verseDetails = await BibleService.fetchVerse(verseAddress)

      // TODO: Cache validated verse address
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* background-image: url('assets/blue.jpg'); */

  /* Full height */
  height: 100%;

  /* Center and scale the image nicely */
  background-size: 100% 100%;

  margin: 0px;
}


#baseDiv {
  height: 100%;
}

body,
html {
  height: 100%;
  margin: 0;
}
</style>
