import axios from 'axios'

const baseUrl = '/verses/' // TODO: Put constants in one place
const sourceFileExt = '.json'

export const apiService = {

    async fetchBook(bibleVersionKey, book) {
        let fetchUrl = baseUrl + bibleVersionKey + '/' + book + sourceFileExt;
        try {
            const response = await axios.get(fetchUrl);
            return response.data;
        } catch (error) {
            console.error('There was an error fetching the book:', error);
            // TODO: Error handling
        }
    }
}