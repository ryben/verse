import Vue from 'vue';
import Vuex from 'vuex';

// Tell Vue to use Vuex
Vue.use(Vuex);

import BibleService from '@/services/BibleService.js'

// Create and export the store
export default new Vuex.Store({

    state: {
        verseDetails: {
            'title': '',
            'version': '',
            'content': ''
        },
        verseFontSize: 72,
        versions: [],
        isAutosizeText: false,
        isAddTextBg: false
    },
    mutations: {
        setVerseDetails(state, details) {
            state.verseDetails = details
        },
        setVerseFontSize(state, size) {
            state.verseFontSize = size
        },
        setVersions(state, versions) {
            state.versions = versions
        },
        setIsAutosizeText(state, isAutosizeText) {
            state.isAutosizeText = isAutosizeText
        },
        setIsAddTextBg(state, isAddTextBg) {
            state.isAddTextBg = isAddTextBg
        },
    },
    actions: {
        loadBibleVersions({ commit }) {
            BibleService.init().then(() => {
                commit('setVersions', BibleService.bible.versionList)
            })
        },
        fetchVerseDetails({ commit }, verseId) {
            // Use BibleService to fetch verse details and commit to state
            BibleService.getVerseDetails(verseId).then(details => {
                commit('setVerseDetails', details)
            })
        },
        async verseEntered({ commit }, { verseInput, currentVersion }) {
            let verseAddress = await BibleService.parseVerseInput(verseInput, currentVersion)

            // Fetch and Display verse 
            let verseDetails = await BibleService.fetchVerse(verseAddress)

            commit('setVerseDetails', verseDetails)
        },
        async versionChanged({ commit }, newVersion) {
            BibleService.fetchVerseDiffVersion(newVersion).then(result => {
                if (result) {
                    commit('setVerseDetails', result)
                }
            })
        },
        async showNextVerse({ commit }, isNextVerse) {
            let nextVerseAddress = await BibleService.getNextVerseAddress(isNextVerse)

            // Fetch and Display verse 
            commit('setVerseDetails', await BibleService.fetchVerse(nextVerseAddress))
        },
        increaseFontSize({ commit, getters }, isIncrease) {
            let newFontSize = getters.verseFontSize + (3 * (isIncrease ? 1 : -1))

            commit('setVerseFontSize', newFontSize)

            // TODO
            // this.saveFontSizeToLocalStorage(this.verseFontSize)
        },
        autoSizeText({ commit }, isAutosizeText) {
            commit('setIsAutosizeText', isAutosizeText)
        },
        addTextBg({ commit }, isAddTextBg) {
            commit('setIsAddTextBg', isAddTextBg)
        },
    },
    getters: {
        verseDetails: state => state.verseDetails,
        verseFontSize: state => state.verseFontSize,
        versions: state => state.versions,
        // Add other getters as needed
    },
})
