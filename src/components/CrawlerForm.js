import React from 'react';

function CrawlerForm() {
    const scrapeOnSubmit = (e) => {
        e.preventDefault();
        if (e.target[0].value < 1 || e.target[1].value < 1) return;
    }

    return (
        <form onSubmit={scrapeOnSubmit}>
            <label>Start Url:</label>
            <input type="text" required></input>
            <label>Max Search Levels:</label>
            <input type="number" min="1" required></input>
            <label>Max Pages:</label>
            <input type="number" min="1" required></input>

            <button type="submit">Scrape</button>
        </form>
    );
}

export default CrawlerForm;