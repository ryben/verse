<template>
  <div id="app">
    <VerseReader/>
  </div>
</template>

<script>
import VerseReader from './components/VerseReader.vue'

export default {
  name: 'App',
  components: {
    VerseReader
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-image: url('assets/background.jpg');

  /* Full height */
  height: 100%; 

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
} 

body, html {
  height: 100%;
  margin: 0;
}
</style>
