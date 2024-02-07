<template>
  <div id="app">
    <div id="baseDiv" @contextmenu="rightClickHandler($event)">
      <CustomBackground />
      <!-- <VerseDisplay /> -->
      <ControlBar />
    </div>
    <!-- <VerseReader /> -->
  </div>
</template>

<script>
// import VerseReader from './components/VerseReader.vue'
import CustomBackground from './components/CustomBackground.vue'
// import VerseDisplay from './components/VerseDisplay.vue'
import ControlBar from './components/ControlBar.vue'

export default {
  name: 'App',
  components: {
    // VerseReader
    CustomBackground,
    // VerseDisplay,
    ControlBar
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
