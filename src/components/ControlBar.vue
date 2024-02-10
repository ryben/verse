<template>
    <div id="controlBar">
        <input v-model="verseAddressInput" v-on:keyup.enter="onClickGo" v-on:keyup.up="showNextVerse(false)"
            v-on:keyup.down="showNextVerse(true)" v-on:keyup.page-up="showNextVerse(false)"
            v-on:keyup.page-down="showNextVerse(true)" id="verseInput" ref="verseInput" @paste="onPasteVerseAddress" />
        <select name="translation" id="translationInput" class="selector" v-model="currentVersion">
            <option v-for="version in versions" :value="version.key" :key="version.key">{{ version.name }}</option>
        </select>
        <a class="button" style="margin-right: 15px; width: 40px;" @click="onClickGo">Go</a>
        <span style="margin-right: 15px;">
            <a class="button" @click="showNextVerse(false)">&lt; Prev</a>
            <a class="button" @click="showNextVerse(true)">Next &gt;</a>
        </span>
        <span>
            <a class="button" @click="increaseFontSize(false)">−</a>
            <a class="button" @click="increaseFontSize(true)">+</a>
        </span>
        <label class="toggle" style="margin-right: 15px;">
            <input type="checkbox" v-model="isAutosizeText">
            <span class="labels" data-on="Auto-size" data-off="Custom Size"></span>
        </label>
        <label class="toggle">
            <input type="checkbox" v-model="isAddTextBg">
            <span class="labels" data-on="With Text BG" data-off="As Is BG"></span>
        </label>
        <select id="bgSelector" class="selector">
            <!-- TODO: selectedBg - send event up -->
            <!-- <select id="bgSelector" class="selector" v-model="selectedBg"> -->
            <option v-for="(value, key) in backgrounds" :value="value" v-bind:key="key">{{ key }}</option>
        </select>
        <input id="bgImgCustomUrlInput" style="display:none;" v-model="bgCustomImgUrl" />
        <span id="errorDisplay" style="margin-left: 15px; color: darkred; font-weight: bold;">
            {{ errorDisplay }}
        </span>
    </div>
</template>

<script>
import BibleService from '@/services/BibleService.js'

const BG_CUSTOM_URL = "BG_CUSTOM_URL"
const defaultVersionIndex = 0

export default {
    name: 'ControlBar',
    data: function () {
        return {
            defaultVerse: 'Apoc 1 1',
            verseAddressInput: '',
            versions: [],
            currentVersion: '',
            translations: { 'adb': 'Ang Dating Biblia' },
            isAutosizeText: false,
            isAddTextBg: false,
            backgrounds: {
                'Blue BG': 'blue.jpg',
                'Brown BG': 'brown.jpg',
                'Orange': 'orange.jpg',
                'White': 'white.jpg',
                'Image URL': BG_CUSTOM_URL
            },
            bgCustomImgUrl: '',
            errorDisplay: null,
        }
    },
    mounted: function () {
        // Immediately invoked async function expression
        (async () => {
            await this.initBibleService()
        })();

    },
    methods: {
        async initBibleService() {
            console.log("----")
            await BibleService.init()

            // Retrieve bible versions list
            BibleService.bible.versions.forEach(version => {
                this.versions.push({
                    'key': version.key,
                    'name': version.name
                })
            })

            // Select default version (first one)
            this.currentVersion = this.versions[defaultVersionIndex].key
            this.verseAddressInput = this.defaultVerse

            this.$emit('verse-entered', [this.defaultVerse, this.currentVersion])
        },
        onClickGo() {
            // TODO
            // let verseAddress = bibleService.processVerseInput(verseAddressInput)
            this.$emit('verse-entered', this.verseAddressInput)
            // TODO
            // this.saveVerseToLocalStorage(verseAddress)
        },
        onPasteVerseAddress(event) {
            let pasted = event.clipboardData.getData('text')
            if (pasted.match(BibleService.verseAddressRegex)) {
                this.processVerseInput(pasted)
            }
        },
        increaseFontSize(isIncrease) {
            console.log(isIncrease)
            // TODO: Emit event up
        },
        focusInput() {
            let verseInput = this.$refs.verseInput
            verseInput.focus()
            verseInput.select()
        },
        displayError(errorMsg) {
            this.errorDisplay = errorMsg
        },
        showNextVerse(isNextVerse) {
            console.log(isNextVerse)
            // TODO: Emit event up
        }
    }
}
</script>


<style>
#controlBar {
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}


.button {
    background-color: #e7e7e7;
    /* Gray */
    color: black;
    border: none;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    border-radius: 2px;
    margin: 1px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    cursor: pointer;
    user-select: none;
    font-weight: bold;
}


input {
    margin: 1px;
    display: inline-block;
    font-size: 12px;
    border-radius: 2px;
    padding: 5px 15px;
    font-weight: bold;
    text-transform: uppercase;
}

#verseInput {
    width: 100px;
}

.selector {
    display: inline-block;
    font-size: 11px;
    border-radius: 2px;
    padding: 5px 5px;
    font-weight: bold;
    text-transform: uppercase;
    background-color: rgb(226, 226, 226);
}

#translationInput {
    width: 150px;
}

.button:hover {
    background-color: #b4b4b4
}

.button:active {
    background-color: #919191;
}

#bgImgCustomUrlInput {
    width: 100px;
}



/* START Toggle */

.toggle {
    --width: 80px;
    --height: calc(var(--width) / 3.3);

    position: relative;
    display: inline-block;
    width: var(--width);
    height: var(--height);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    margin-bottom: -8px;
    font-weight: bold;
    margin-left: 3px;
}

.toggle input {
    display: none;
}

.toggle .labels {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 12px;
    font-family: sans-serif;
    transition: all 0.4s ease-in-out;
    overflow: hidden;
}

.toggle .labels::after {
    content: attr(data-off);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    color: #4d4d4d;
    background-color: rgb(226, 226, 226);
    transition: all 0.1s ease-in-out;
}

.toggle .labels::before {
    content: attr(data-on);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: calc(var(--width) * -1);
    height: 100%;
    width: 100%;
    color: #ffffff;
    background-color: #585858;
    text-align: center;
    transition: all 0.1s ease-in-out;
}

.toggle input:checked~.labels::after {
    transform: translateX(var(--width));
}

.toggle input:checked~.labels::before {
    transform: translateX(var(--width));
}

/* END Toggle */
</style>