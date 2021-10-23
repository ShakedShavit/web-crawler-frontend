import React from "react";
import { startCrawlingInDB } from "../server/db/crawler";

function CrawlerForm(props) {
    const scrapeOnSubmit = (e) => {
        e.preventDefault();

        let queueName = e.target[0].value;
        let rootUrl = e.target[1].value;
        let maxDepth = e.target[2].value;
        let maxPages = e.target[3].value;

        let errMsg = "";
        if (!queueName) errMsg = "must include queue name";
        else if (queueName.length > 75) errMsg = "queue name cannot be longer than 80 characters";
        else if (/\d/.test(queueName)) errMsg = "queue name cannot contain numbers";
        else if (queueName.includes(" ")) errMsg = "queue name cannot include spaces";
        else if (!rootUrl) errMsg = "must include a web page url";
        else if (!maxDepth && !maxPages)
            errMsg = "must include either max search levels or max search pages";
        if (!!errMsg) {
            props.setErrorMessage(errMsg);
            return;
        }

        props.setErrorMessage("");

        props.setIsCrawling(true);
        startCrawlingInDB(queueName, rootUrl, maxDepth, maxPages)
            .then((res) => {
                props.setQueueName(queueName);
            })
            .catch((err) => {
                console.log(err);
                props.setErrorMessage(err.message);
                props.setIsCrawling(false);
            });
    };

    return (
        <form onSubmit={scrapeOnSubmit}>
            <label>Search Name:</label>
            <input type="text" defaultValue="my-crawl" required></input>

            <label>Root Url:</label>
            <input type="text" defaultValue="http://hex2rgba.devoth.com" required></input>

            <label>Max Search Levels:</label>
            <input type="number" min="1" defaultValue="5"></input>

            <label>Max Search Pages:</label>
            <input type="number" min="1" defaultValue="300"></input>

            <button type="submit" disabled={props.isCrawling}>
                Crawl
            </button>
        </form>
    );
}

export default CrawlerForm;
