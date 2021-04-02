import React, { useEffect } from 'react';
import { startScrappingInDB } from '../server/db/crawler';

function CrawlerForm(props) {
    const restartCrawlVars = () => {
        props.setErrorMessage('');
        props.setCrawlTree([]);
        props.setTreeQueue([]);
        props.setQueueIndex(0);
    }

    const scrapeOnSubmit = (e) => {
        e.preventDefault();
        restartCrawlVars();

        if (e.target[1].value < 1) return;

        props.setIsCrawling(true);

        startScrappingInDB(e.target[0].value, e.target[1].value, e.target[2].value, props.setTreeQueue)
            .then((res) => {
                console.log(res);
                props.setIsCrawling(false);
            })
            .catch((err) => {
                console.log(err);
                props.setErrorMessage(err.message);
                props.setIsCrawling(false);
            });
    }

    return (
        <form onSubmit={scrapeOnSubmit}>
            <label>Start Url:</label>
            <input type="text" defaultValue="http://hex2rgba.devoth.com/" required></input>
            <label>Max Search Levels:</label>
            <input type="number" min="1" defaultValue="2" required></input>
            <label>Max Pages:</label>
            <input type="number" min="1" defaultValue="10"></input>

            <button type="submit" disabled={props.isCrawling}>Scrape</button>
        </form>
    );
}

export default CrawlerForm;