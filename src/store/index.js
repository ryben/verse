import Vue from 'vue';
import Vuex from 'vuex';

import BibleService from '@/services/BibleService.js'
import { storageManager } from '@/utils/storageManager.js'

// Tell Vue to use Vuex
Vue.use(Vuex);


// TODO: Break down into modules
export default new Vuex.Store({

    state: {
        verseDetails: {
            'title': '',
            'version': '',
            'content': ''
        },
        verseAddress: {},
        currentVersion: '',
        verseFontSize: 0.0,
        versions: [],
        isAddTextBg: false,
        selectedBg: '',
        bgImageCustomUrl: null,
        errorDisplay: ''
    },
    mutations: {
        setVerseDetails(state, details) {
            state.verseDetails = details
        },
        setVerseAddress(state, verseAddress) {
            state.verseAddress = verseAddress
        },
        setVerseFontSize(state, size) {
            state.verseFontSize = size
        },
        setVersions(state, versions) {
            state.versions = versions
        },
        setCurrentVersion(state, currentVersion) {
            state.currentVersion = currentVersion
        },
        setIsAddTextBg(state, isAddTextBg) {
            state.isAddTextBg = isAddTextBg
        },
        setSelectedBg(state, selectedBg) {
            state.selectedBg = selectedBg
        },
        setBgImageCustomUrl(state, bgImageCustomUrl) {
            state.bgImageCustomUrl = bgImageCustomUrl
        },
        setErrorDisplay(state, errorDisplay) {
            state.errorDisplay = errorDisplay
        },
    },
    actions: {
        initStore({ commit }) {
            BibleService.init().then(() => {
                let versionList = BibleService.bible.versionList
                commit('setVersions', versionList)
            })
        },
        loadBibleVersions({ commit }) {
            BibleService.init().then(() => {
                commit('setVersions', BibleService.bible.versionList)
            })
        },
        async verseEntered({ dispatch }, { verseInput, currentVersion }) {
            try {
                let verseAddress = await BibleService.parseVerseInput(verseInput, currentVersion)
                dispatch('fetchVerseDetails', verseAddress)
                dispatch('updateErrorDisplay', '') // clear error message
            } catch (error) {
                dispatch('updateErrorDisplay', error)
            }
        },
        async verseEnteredNoVersion({ getters, dispatch }, verseInput) {
            let verseAddress = getters.verseAddress
            dispatch('verseEntered', { verseInput: verseInput, currentVersion: verseAddress.version })
        },
        async versionChanged({ commit, dispatch }, newVersion) {
            let verseAddress = BibleService.getDiffVersionVerseAddress(newVersion)
            commit('setCurrentVersion', newVersion)
            dispatch('fetchVerseDetails', verseAddress)
        },
        async showNextVerse({ dispatch }, isNextVerse) {
            let nextVerseAddress = await BibleService.getNextVerseAddress(isNextVerse)
            dispatch('fetchVerseDetails', nextVerseAddress)
        },
        async fetchVerseDetails({ commit, dispatch }, verseAddress) {
            let verseDetails
            try {
                verseDetails = await BibleService.fetchVerse(verseAddress)

                commit('setVerseAddress', verseAddress)
                commit('setVerseDetails', verseDetails)
                dispatch('updateErrorDisplay', '') // clear error message
            } catch (error) {
                dispatch('updateErrorDisplay', error.message)
            }

            storageManager.saveVerseToLocalStorage(verseAddress)
        },
        increaseFontSize({ commit, getters }, isIncrease) {
            let newFontSize = getters.verseFontSize + 0.2 * (isIncrease ? 1 : -1)

            commit('setVerseFontSize', newFontSize)
            storageManager.saveFontSizeToLocalStorage(newFontSize)
        },
        addTextBg({ commit }, isAddTextBg) {
            storageManager.saveTextBgToLocalStorage(isAddTextBg)
            commit('setIsAddTextBg', isAddTextBg)
        },
        setSelectedBg({ commit }, selectedBg) {
            storageManager.saveBgImageToLocalStorage(selectedBg)
            commit('setSelectedBg', selectedBg)
        },
        setBgImageCustomUrl({ commit }, bgImageCustomUrl) {
            commit('setBgImageCustomUrl', bgImageCustomUrl)
        },
        saveBgImageCustomUrl(context, bgImageCustomUrl) {
            storageManager.saveBgImageCustomUrlToLocalStorage(bgImageCustomUrl)
        },
        loadStateFromStorage({ commit, dispatch }) { // TODO: Merge with loadBgFromStorage
            let savedState = storageManager.loadState()

            dispatch('fetchVerseDetails', savedState.verseAddress)
            commit('setVerseFontSize', parseFloat(savedState.verseFontSize))
        },
        loadBgFromStorage({ commit }) {
            let savedState = storageManager.loadState()

            commit('setIsAddTextBg', savedState.isAddTextBg)
            commit('setSelectedBg', savedState.selectedBg)
            commit('setBgImageCustomUrl', savedState.bgCustomImgUrl)
        },
        updateErrorDisplay({ commit }, errorMessage) {
            commit('setErrorDisplay', errorMessage)
        }
    },
    getters: {
        verseDetails: state => state.verseDetails,
        verseFontSize: state => state.verseFontSize,
        versions: state => state.versions,
        currentVersion: state => state.currentVersion,
        verseAddress: state => state.verseAddress,
    },
})
