<template>
  <div>
    <div id="inputBar">
      <input/>
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
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function() {
    return {
      verseTitle: "Genesis 1:1",
      verseTranslation: "Ang Dating Biblia",
      verseContent: "Nang pasimula ay..."
    }
  },
  methods: {
    onClickGo: function() {
      let verseAddressRegex =
                ("(?:([iI]{1,3}|\\d+) )?" // number before book
                        + "([a-zA-Z]+(?: [a-zA-Z]+)*)" // book
                        + "[. ]?"      // space after book
                        + "(\\d+)"  // chapter
                        + "[ \\.:]" // chapter-verse separator
                        + "(\\d+)") // verse
      console.log(verseAddressRegex)
    }
  }
}
</script>
