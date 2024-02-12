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
        isAddTextBg: false,
        background: ''
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
        setBackground(state, background) {
            state.background = background
        },
    },
    actions: {
        loadBibleVersions({ commit }) {
            BibleService.init().then(() => {
                commit('setVersions', BibleService.bible.versionList)
            })
        },
        async verseEntered(context, { verseInput, currentVersion }) {
            let verseAddress = await BibleService.parseVerseInput(verseInput, currentVersion)
            this.dispatch('fetchVerseDetails', verseAddress)
        },
        async versionChanged(context, newVersion) {
            let verseAddress = BibleService.getDiffVersionVerseAddress(newVersion)
            this.dispatch('fetchVerseDetails', verseAddress)
        },
        async showNextVerse(context, isNextVerse) {
            let nextVerseAddress = await BibleService.getNextVerseAddress(isNextVerse)
            this.dispatch('fetchVerseDetails', nextVerseAddress)
        },
        async fetchVerseDetails({ commit }, verseAddress) {
            let verseDetails = await BibleService.fetchVerse(verseAddress)
            commit('setVerseDetails', verseDetails)
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
        updateBackground({ commit }, background) {
            commit('setBackground', background)
        },
    },
    getters: {
        verseDetails: state => state.verseDetails,
        verseFontSize: state => state.verseFontSize,
        versions: state => state.versions,
    },
})
