import axios from 'axios'
import { utils } from '@/utils/utils.js'

const baseUrl = '/verses' // TODO: Group constants
const versionsFilename = 'versions.json'
const sourceFileExt = '.json'
const bookNamesFilename = 'books.json'
const versions = 'versions'

const maxBookCount = 66
const MAX_VERSE_CHAPTER_INDICATOR = -1

const verseAddressRegex =
    ("(?:([iI]{1,3}|\\d+)\\s+)?" // number before book
        + "([a-zA-Z]+(?: [a-zA-Z]+)*)" // book
        + "\\s+"      // space after book
        + "(\\d+)"  // chapter
        + "(?:\\.|:|\\s+)" // chapter-verse separator
        + "(\\d+)") // verse



class BibleService {
    static instance = null

    bible = {
        versions: [
            {
                name: 'Ang Dating Biblia',
                key: 'adb',
                bookNames: ['Genesis', 'Exodo'],
                content: {
                    '1': { // Book
                        '1': { // Chapter
                            '1': 'Nang pasimula' // Verse
                        }
                    }
                }
            }
        ],
    }

    constructor() {
        if (!BibleService.instance) {
            BibleService.instance = this
        }
        return BibleService.instance
    }

    async init() {
        this.bible[versions] = await this.loadBibleVersions()
    }

    showNextVerse(isNextVerse) {
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

        this.verseAddress = this.createVerseAddress(
            this.verseTranslation,
            book,
            chapter,
            verse
        )

        this.saveVerseToLocalStorage(this.verseAddress)
    }

    loadVerseParamQuery() {
        var url = new URL(window.location.href);
        let verseParam = url.searchParams.get('v')
        if (verseParam) {
            this.verseAddressInput = verseParam
        }

        this.processVerseInput(this.verseAddressInput)
        this.focusInput()
    }
    async parseVerseInput(verseInput, bibleVersionKey) {
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

        let bookMatch = await this.findBookMatch(bookInput, bibleVersionKey)

        return this.createVerseAddress(
            bibleVersionKey,
            bookMatch,
            matchGroups[3] + '',
            matchGroups[4] + ''
        )
    }
    createVerseAddress(version, book, chapter, verse) {
        return {
            'version': version,
            'book': book,
            'chapter': chapter,
            'verse': verse
        }
    }
    getBibleVersion(bibleVersionKey) {
        for (const vIndex in this.bible.versions) {
            let version = this.bible.versions[vIndex]

            if (version.key == bibleVersionKey) {
                return version
            }
        }
        return {}
    }
    async findBookMatch(bookName, bibleVersionKey) {
        let bookMatches = []
        let bibleVersion = this.getBibleVersion(bibleVersionKey)

        if (utils.isEmpty(bibleVersion.bookNames)) {
            // Fetch book names for requested bible version
            let fetchUrl = `${baseUrl}/${bibleVersion.key}/${bookNamesFilename}`
            bibleVersion.bookNames = await this.fetch(fetchUrl)
        }

        for (let i = 0; i < bibleVersion.bookNames.length; i++) {
            if (bibleVersion.bookNames[i].substring(0, bookName.length).toLowerCase() == bookName.toLowerCase()) {
                bookMatches.push(i)
            }
        }

        if (bookMatches.length == 1) {
            return bookMatches[0] + 1 // offset of 1 since book number starts with 1
        } else if (bookMatches.length == 2) {
            let match1 = bibleVersion.bookNames[bookMatches[0]]
            let match2 = bibleVersion.bookNames[bookMatches[1]]
            if (this.isSubstringOfOther(match1, match2)) {
                return 1 + (match1.length < match2.length ? bookMatches[0] : bookMatches[1])
            } else {
                return bookMatches[0] + 1 // return the first match
            }
        } else {
            throw 'Invalid book name entered' // TODO: Add hint for possible matches
        }
    }
    async loadBook() {

    }
    async fetchVerse(verseAddress) {
        let bibleVersion = this.getBibleVersion(verseAddress.version)

        // If bible version is not initialized yet
        if (utils.isEmpty(bibleVersion.content)) {
            bibleVersion.content = {}
        }

        // If book is not loaded yet
        if (utils.isEmpty(bibleVersion.content[verseAddress.book])) {
            // load and cache the fetched book content
            let fetchUrl = `${baseUrl}/${bibleVersion.key}/${verseAddress.book}${sourceFileExt}`
            bibleVersion.content[verseAddress.book] = await this.fetch(fetchUrl)
        }

        // Return verse info
        return this.getVerseInfo(verseAddress)
    }
    getVerseInfo(verseAddress) {
        try {
            let bibleVersion = this.getBibleVersion(verseAddress.version)
            let bookContent = bibleVersion.content[verseAddress.book]

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
                return {
                    'title': bibleVersion.bookNames[verseAddress.book - 1] + ' ' + verseAddress.chapter + ':' + verseAddress.verse,
                    'content': verseContent,
                    'version': bibleVersion.name
                }
            } else {
                throw 'Verse not found'
            }
        } catch (error) {
            // TODO
            // this.displayError('Verse not found')
        }
    }

    async loadBibleVersions() {
        let fetchUrl = `${baseUrl}/${versionsFilename}`
        return await this.fetch(fetchUrl)
    }

    async fetch(resourceUrl) {
        try {
            const response = await axios.get(resourceUrl);
            return response.data;
        } catch (error) {
            console.error('There was an error fetching a resource:', error);
            // TODO: Error handling
        }
    }

}

export default new BibleService()