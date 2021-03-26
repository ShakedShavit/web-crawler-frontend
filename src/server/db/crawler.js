import Axios from 'axios';

const URL = 'http://localhost:5000/';

export const startScrappingInDB = async (startUrl, maxDepth, maxLevel) => {
    try {
        const res = await Axios.post(URL + 'start-scrape', {
            startUrl,
            maxDepth,
            maxLevel
        });

        return res.data;
    } catch (err) {
        throw new Error(err.message);
    }
};