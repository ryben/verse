const baseUrl = '/verses/' // TODO: Put constants in one place
const bookNamesFilename = 'books.json'
const translationsFilename = 'translations.json'
const sourceFileExt = '.json'

import axios from 'axios'

export const BibleService = {

    showNextVerse: function (isNextVerse) {
        let book = this.verseAddress.book
        let chapter = this.verseAddress.chapter
        let verse = this.verseAddress.verse

        if (isNextVerse) {
            verse++
        } else {
            verse--
        }

        // if reached the end of the chapter
        if (verse > Object.keys(this.bible[this.verseTranslation][book][chapter]).length) {
            chapter++
            verse = 1
        } else if (verse < 1) { // if at start of chapter
            chapter--
            verse = MAX_VERSE_CHAPTER_INDICATOR
        }

        // if reached the end of the book
        if (chapter > Object.keys(this.bible[this.verseTranslation][book]).length) {
            book++
            chapter = 1
        } else if (chapter < 1) {
            book--
            chapter = MAX_VERSE_CHAPTER_INDICATOR
        }

        // if reached end of the bible
        if (book > maxBookCount) {
            book = 1
        } else if (book < 1) {
            book = maxBookCount
        }

        this.verseAddress = createVerseAddress(
            this.verseTranslation,
            book,
            chapter,
            verse
        )

        this.saveVerseToLocalStorage(this.verseAddress)
    },

    loadVerseParamQuery: function () {
        var url = new URL(window.location.href);
        let verseParam = url.searchParams.get('v')
        if (verseParam) {
            this.verseAddressInput = verseParam
        }

        this.processVerseInput(this.verseAddressInput)
        this.focusInput()
    },
    processVerseInput: function (verseInput) {
        this.errorDisplay = null
        try {
            let verseAddress = this.parseVerseInput(verseInput)
            this.fetchVerseContent(verseAddress)
            return verseAddress
        } catch (error) {
            this.displayError('Caught exception: ' + error)
        }
    },
    parseVerseInput: function (verseInput) {
        let matchGroups = verseInput.match(verseAddressRegex)

        if (!matchGroups) {
            throw 'Invalid input'
        }

        let bookInput = matchGroups[2]

        // special shorthand
        if (bookInput.toLowerCase() == 'jn') {
            bookInput = "juan"
        }

        if (matchGroups[1]) { // Number before book e.g. the "2" in "2 Hari"
            bookInput = matchGroups[1] + ' ' + bookInput
        }

        let bookMatch = this.findBookMatch(bookInput)

        return createVerseAddress(
            this.verseTranslation,
            bookMatch,
            matchGroups[3] + '',
            matchGroups[4] + ''
        )
    },
    createVerseAddress(translation, book, chapter, verse) {
        return {
            'translation': translation,
            'book': book,
            'chapter': chapter,
            'verse': verse
        }
    },
    findBookMatch(bookName) {
        let bookMatches = []

        for (let i = 0; i < this.bookNames.length; i++) {
            if (this.bookNames[i].substring(0, bookName.length).toLowerCase() == bookName.toLowerCase()) {
                bookMatches.push(i)
            }
        }

        if (bookMatches.length == 1) {
            return bookMatches[0] + 1 // offset of 1 since book number starts with 1
        } else if (bookMatches.length == 2) {
            let match1 = this.bookNames[bookMatches[0]]
            let match2 = this.bookNames[bookMatches[1]]
            if (this.isSubstringOfOther(match1, match2)) {
                return 1 + (match1.length < match2.length ? bookMatches[0] : bookMatches[1])
            } else {
                return bookMatches[0] + 1 // return the first match
            }
        } else {
            throw 'Invalid book name entered' // TODO: Add hint for possible matches
        }
    },
    fetchVerseContent: function (verseAddress) {
        if (this.verseTranslation != verseAddress['translation']) {
            this.verseTranslation = verseAddress['translation']
        }

        if (!this.bible[this.verseTranslation][verseAddress.book]) {
            let fetchUrl = baseUrl + this.verseTranslation + '/' + verseAddress.book + '' + sourceFileExt

            axios.get(fetchUrl).then(response => {
                this.bible[this.verseTranslation][verseAddress.book] = response.data // cache the fetched book content
                this.displayVerseContent(verseAddress)
            })
        } else {
            this.displayVerseContent(verseAddress)
        }
    },
    fetchBookNames: function (callback) {
        let fetchUrl = baseUrl + this.verseTranslation + "/" + bookNamesFilename
        axios.get(fetchUrl).then(response => {
            this.bookNames = response.data
            callback()
        })
    },
    fetchTranslationsStub: function () {
        let response = {
            "adb": "Ang Dating Biblia",
            "kjv": "King James Version",
            "nkjv": "New King James Version"
        }
        Object.keys(response).forEach(key => {
            console.log(key)
            this.bible[key] = {}
        });
        this.translations = response
    },
    fetchTranslations: function () {
        let fetchUrl = baseUrl + translationsFilename
        axios.get(fetchUrl).then(response => {
            Object.keys(response.data).forEach(key => {
                console.log(key)
                this.bible[key] = {}
            });
            this.translations = response.data
        })
    },
    displayVerseContent: function (verseAddress) {
        try {
            let bookContent = this.bible[this.verseTranslation][verseAddress.book]

            // MAX_VERSE_CHAPTER_INDICATOR is set as value of chapter/verse when next/previous button is tapped and bounds are reached
            if (verseAddress.chapter == MAX_VERSE_CHAPTER_INDICATOR) {
                verseAddress.chapter = Object.keys(bookContent).length
            }

            let chapterContent = bookContent[verseAddress.chapter]
            if (verseAddress.verse == MAX_VERSE_CHAPTER_INDICATOR) {
                verseAddress.verse = Object.keys(chapterContent).length
            }

            let verseContent = chapterContent[verseAddress.verse]

            if (verseContent) {
                this.verseInfo.content = verseContent
                this.verseInfo.title = this.bookNames[verseAddress.book - 1] + ' ' + verseAddress.chapter + ':' + verseAddress.verse
                this.verseInfo.translation = this.translations[this.verseTranslation]
            } else {
                throw 'Verse not found'
            }

            this.verseAddress = verseAddress // at this point, the verse address is validated, save the current verse address
        } catch (error) {
            this.displayError('Verse not found')
        }
    },
}