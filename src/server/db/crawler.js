import Axios from 'axios';

const URL = 'http://localhost:5000/';

let getCrawlData;

export const startScrappingInDB = async (startUrl, maxDepth, maxPages, setTreeQueue) => {
    const treeQueue = [];
    try {
        getCrawlData = setInterval(() => {
            setCrawlDataInterval(treeQueue, setTreeQueue)
        }, 1000);

        const res = await Axios.post(URL + 'start-scraping', {
            startUrl,
            maxDepth,
            maxPages
        });

        clearInterval(getCrawlData);
        console.log('Search Complete');

        return res.data;
    } catch (err) {
        clearInterval(getCrawlData);

        console.log(err);
        throw new Error(err.response.data.message);
    }
};

let isAsyncIntervalFuncRunning = false;
const setCrawlDataInterval = (treeQueue, setTreeQueue) => {
    if (isAsyncIntervalFuncRunning) return;
    isAsyncIntervalFuncRunning = true;

    Axios.get(URL + 'get-unfetched-sites', {})
        .then((res) => {
            if (res.data.length > 0) {
                treeQueue.push(...res.data);
                setTreeQueue([...treeQueue]);
            }
            console.log(res);

            isAsyncIntervalFuncRunning = false;
        })
        .catch((err) => {
            isAsyncIntervalFuncRunning = false;
            console.log(err);
        });
}

export const deleteQueueInDB = async () => {
    clearInterval(getCrawlData);

    try {
        const res = await Axios.delete(URL + 'delete-queue', {});
        console.log(res.data);
    } catch (err) {
        throw new Error(err.message);
    }
}