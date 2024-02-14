<template>
  <div id="verseTitleTranslationContainer">
    <span id="verseTitle" ref="verseTitle" v-on:click="onClickTitle" @blur="onBlurTitle" @keydown.enter="onEnterTitle"
      @keydown="handleKeyDown">
      {{ verseDetails.title }}
    </span>
    <div></div>
    <span id="verseVersion" ref="verseVersion" v-on:click="onClickVersion" @blur="onBlurVersion"
      @keydown.enter="onEnterVersion" @keydown="handleKeyDown">
      {{ verseDetails.version }}
    </span>
    <div id="versionsDropdown" ref="versionsDropdown" v-if="isDropdownVisible" class="dropdown-menu"
      @mouseenter="onHoverDropdown" @mouseleave="onLeaveDropdown">
      <ul>
        <li v-for="option in versionOptions" :key="option" @click="selectVersion(option)"
          :class="{ 'selected': verseDetails.version === option }">
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>


<script>


export default {
  name: 'VerseTitleAndVersion',
  props: ['verseDetails'],
  data: function () {
    return {
      isEditingTitle: false,
      isEditingVersion: false,
      isSelectingVersion: false,
      isDropdownVisible: false,
      versionOptions: [
        'Ang Dating Biblia',
        'King James Version',
        'New King James Version'
      ]
    }
  },
  mounted() {
    this.applyEditable(this.$refs.verseTitle)
    this.applyEditable(this.$refs.verseVersion)
  },
  computed: {

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
    selectVersion(option) {
      this.isDropdownVisible = false;
      this.isSelectingVersion = false
      this.makeIsEditing(this.$refs.verseVersion, false)

      console.log("Clicked: " + option)
    },
    applyEditable(ref) {
      this.makeLookEditable(ref, false)
      ref.addEventListener('mouseover', () => {
        this.makeLookEditable(ref)
      })
      ref.addEventListener('mouseout', () => {
        if (!this.isEditing(ref)) {
          this.makeLookEditable(ref, false)
        }
      })
    },
    isEditing(ref) {
      if (ref == this.$refs.verseTitle) {
        return this.isEditingTitle
      } else if (ref == this.$refs.verseVersion) {
        return this.isEditingVersion
      }
    },
    makeIsEditing(ref, isEditing = true) {
      if (ref == this.$refs.verseTitle) {
        this.isEditingTitle = isEditing
      } else if (ref == this.$refs.verseVersion) {
        if (this.isSelectingVersion == false) {
          this.isEditingVersion = isEditing
          this.isDropdownVisible = isEditing
        }
      }
    },
    onClickTitle(event) {
      this.setEditMode(event.target, true)
    },
    onClickVersion(event) {
      this.setEditMode(event.target, true)

      this.$nextTick(() => {
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

    onBlurTitle(event) {
      this.setEditMode(event.target, false)
      this.$refs.verseTitle.innerText = this.verseDetails.title
    },
    onBlurVersion(event) {
      this.setEditMode(event.target, false)
      this.$refs.verseVersion.innerText = this.verseDetails.version
    },
    setEditMode(target, isEditMode) {
      let title = this.$refs.verseTitle
      let version = this.$refs.verseVersion

      let targetRef = target == title ? title : version

      if (isEditMode) {
        targetRef.setAttribute('contenteditable', 'true');
        targetRef.focus(); // Optional: focus the element for immediate editing

        if (!this.isEditing(targetRef)) {
          this.makeEditable(targetRef)
          this.makeIsEditing(targetRef)
        }
      } else {
        targetRef.setAttribute('contenteditable', 'false');
        this.makeLookEditable(targetRef, false)
        this.makeIsEditing(targetRef, false)
      }
    },
    makeEditable(elementRef) {
      // Wait for the next tick to ensure the content is editable and focused
      this.$nextTick(() => {
        const range = document.createRange();
        range.selectNodeContents(elementRef);

        const selection = window.getSelection();
        selection.removeAllRanges(); // Clear any existing selections
        selection.addRange(range); // Select all text within the element
      });

      this.makeLookEditable(elementRef)
    },
    makeLookEditable(elementRef, isEditable = true) {
      if (isEditable) {
        elementRef.style.cssText = `
          outline: 3px solid rgba(255, 255, 255, 0.7);
          outline-offset: 3px 6px;
          border-radius: 10px;
          background-color: rgba(0, 0, 0, 0.3);
          padding: 5px 16px;
          margin: 0px -16px;
        `
      } else {
        elementRef.style.cssText = ''
      }
    },
    onEnterTitle(event) {
      event.preventDefault()
      this.$store.dispatch('verseEnteredNoVersion', event.target.innerText)
      this.setEditMode(event.target, false)
    },
    onEnterVersion(event) {
      event.preventDefault()
      this.setEditMode(event.target, false)
      // this.$store.dispatch('verseEnteredNoVersion', event.target.innerHTML)
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
}

#verseTitle {
  color: white;
  font-size: 50px;
  text-transform: uppercase;
}

#verseVersion {
  color: yellow;
  font-style: oblique;
  font-size: 35px;
  margin-top: 10px;
  text-transform: uppercase;
  display: inline-block
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background-color: lightgray;
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




@media screen and (min-width: 1201px),
screen and (min-height: 700px) {

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
  #verseTitle {
    font-size: 25px;
  }

  #verseVersion {
    font-size: 25px;
    margin-top: 10px;
  }
}

@media screen and (max-width: 800px) {
  #verseTitle {
    font-size: 25px;
  }

  #verseVersion {
    font-size: 13px;
    margin-top: 5px;
  }
}

@media screen and (max-height: 400px) {
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
}

@media screen and (max-height: 200px) {

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

}

@media screen and (max-width: 400px) {

  #verseTitle {
    font-size: 17px;
  }

  #verseVersion {
    font-size: 13px;
    margin-top: 5px;
  }
}
</style>