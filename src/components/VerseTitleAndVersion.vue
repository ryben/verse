<template>
  <div id="verseTitleTranslationContainer">
    <span id="verseTitle" ref="verseTitle" v-on:click="onClickTitle" @blur="onBlurTitle" @keydown.enter="onEnterTitle"
      @keydown="handleKeyDown">
      {{ verseDetails.title }}
    </span>
    <div></div>
    <span id="verseVersion" ref="verseVersion" v-on:click="onClickVersion" @blur="onBlurVersion" @keydown="handleKeyDown">
      {{ verseDetails.version }}
    </span>
    <div id="versionsDropdown" ref="versionsDropdown" v-if="isDropdownVisible" class="dropdown-menu"
      @mouseenter="onHoverDropdown" @mouseleave="onLeaveDropdown">
      <ul>
        <li v-for="version in versions" :value="version.key" :key="version.key" @click="onSelectVersion(version)">
          {{ version.name }}
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex';
import { uiMixin } from "@/mixins/uiMixin.js"

export default {
  name: 'VerseTitleAndVersion',
  mixins: [uiMixin],
  props: ['verseDetails'],
  data: function () {
    return {
      selectedVersion: "",
      isSelectingVersion: false,
      isDropdownVisible: false,
    }
  },
  mounted() {
    this.makeEditable(this.$refs.verseTitle)
    this.makeEditable(this.$refs.verseVersion)
  },
  computed: {
    ...mapState(['versions']),
  },
  watch: {
    verseDetails(value) {
      this.$refs.verseTitle.innerText = value.title
      this.$refs.verseVersion.innerText = value.version
    }
  },
  methods: {
    onHoverDropdown() {
      this.isSelectingVersion = true
    },
    onLeaveDropdown() {
      this.isSelectingVersion = false
    },
    onSelectVersion(version) {
      this.isDropdownVisible = false;
      this.isSelectingVersion = false

      this.$store.dispatch('versionChanged', { version: version.key, isSync: false })
    },
    onClickTitle() {
      this.setEditMode(this.$refs.verseTitle, true)
    },
    onClickVersion() {
      let verseVersion = this.$refs.verseVersion
      verseVersion.setAttribute('tabindex', 0) // make sure it's focusable
      verseVersion.focus()
      this.isDropdownVisible = true

      this.$nextTick(() => {
        // Style the custom dropdown
        const verseVersion = this.$refs.verseVersion;
        const versionsDropdown = this.$refs.versionsDropdown;

        if (verseVersion && versionsDropdown) {
          const width = verseVersion.offsetWidth;
          const style = window.getComputedStyle(verseVersion);
          const marginLeft = style.marginLeft;
          const fontFamily = style.fontFamily;
          const fontStyle = style.fontStyle;
          let fontSize = parseFloat(style.fontSize);
          fontSize = fontSize * 0.7; // Adjust the scaling factor as needed

          versionsDropdown.style.width = `${width}px`;
          versionsDropdown.style.marginLeft = marginLeft;
          versionsDropdown.style.fontSize = `${fontSize}px`; // Apply adjusted fontSize
          versionsDropdown.style.fontFamily = fontFamily; // Apply fontFamily
          versionsDropdown.style.fontStyle = fontStyle;
        }
      });
    },

    onBlurTitle() {
      this.setEditMode(this.$refs.verseTitle, false)
      this.$refs.verseTitle.innerText = this.verseDetails.title
    },
    onBlurVersion() {
      this.setEditMode(this.$refs.verseVersion, false)
      if (!this.isSelectingVersion) {
        // prevent hiding the dropdown before it gets clicked
        this.isDropdownVisible = false
      }
      this.$refs.verseVersion.innerText = this.verseDetails.version
    },
    onEnterTitle(event) {
      event.preventDefault()
      this.$store.dispatch('verseEnteredNoVersion', event.target.innerText)
      this.setEditMode(this.$refs.verseTitle, false)
    },
    handleKeyDown(event) {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
          event.stopPropagation()
          break
      }
    }
  }
}

</script>


<style>
#verseTitleTranslationContainer {
  position: relative;
  white-space: nowrap;
}

#verseTitle {
  color: white;
  text-transform: uppercase;
  font-size: clamp(0.8rem, 1.7vw + 3.0vh, 3rem);
}

#verseVersion {
  color: yellow;
  display: inline-block;
  font-style: oblique;
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: clamp(0.2rem, 0.6vw + 1.2vh, 0.8rem);
  font-size: clamp(0.8rem, 1.0vw + 2vh, 2rem);
  cursor: pointer;
}

#versionsDropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
}

#versionsDropdown ul {
  list-style: none;
  padding: 12px;
  margin: 0;
  background: #f0f0f0;
  box-shadow: 0 2px 4px rgba(56, 56, 56, 0.1);
  border-radius: 16px;
  background-color: rgb(240, 240, 240);
  color: black;
}

#versionsDropdown li {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

#versionsDropdown li:hover {
  background-color: #e0e0e0;
  color: rgb(32, 32, 32);
}

#versionsDropdown li:active {
  background-color: #d0d0d0;
}
</style>