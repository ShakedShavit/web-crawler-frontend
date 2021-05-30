import Axios from 'axios';

const URL = 'http://localhost:5000/';

export const startCrawlingInDB = async (queueName, rootUrl, maxDepth = null, maxPages = null) => {
    try {
        await Axios.post(URL + 'start-scraping', {
            queueName,
            rootUrl,
            maxDepth,
            maxPages
        });
    } catch (err) {
        console.log(err);
        if (!err.response) throw new Error('cannot access server');
        throw new Error(err.response.data.message);
    }
}

export const getCrawlTreeFromDB = async (queueName) => {
    try {
        const res = await Axios.get(URL + 'get-tree', {
            // transformResponse: [],
            params: { queueName }
        });
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}

export const deleteQueueInDB = async (queueName) => {
    try {
        await Axios.delete(URL + 'delete-queue', { params: { queueName } });
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}