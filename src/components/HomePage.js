import React, { useEffect, useState } from 'react';
import * as deepcopy from 'deepcopy';
import CrawlerForm from './CrawlerForm';
import TreeElement from './TreeElement';
import { deleteQueueInDB } from '../server/db/crawler';

function HomePage() {
    const [treeQueue, setTreeQueue] = useState([]);
    const [queueIndex, setQueueIndex] = useState(0);
    const [crawlTree, setCrawlTree] = useState([]);
    const [errorMessage, setErrorMessage] = useState([]);
    const [isCrawling, setIsCrawling] = useState(false);

    useEffect(() => {
        let i = queueIndex;
        let treeCopy = deepcopy(crawlTree);
        for (; i < treeQueue.length; i++) {
            if (treeQueue[i].level === 1) {
                treeCopy.push({ ...treeQueue[i], children: [] });
            } else {
                treeCopy.forEach(site => {
                    recursiveSearch(site, treeQueue[i]);
                });
            }
        }
        setCrawlTree(treeCopy);
        setQueueIndex(i);
    }, [treeQueue.length]);

    // Problem probably in this function (the treeQueue is fine)
    const recursiveSearch = (siteNode, child) => {
        console.log(siteNode);
        if (siteNode.level === child.level - 1) {
            if (siteNode.url === child.parentUrl) {
                siteNode.children.push({ ...child, children: [] });
            }
            return;
        }
        siteNode.children.forEach(site => {
            recursiveSearch(site, child);
        });
    }

    const stopCrawling = () => {
        deleteQueueInDB()
            .then((res) => {
                setIsCrawling(false);
            })
            .catch((err) => {
                setIsCrawling(false);
                console.log(err);
            });
    }


    return (
        <div>
            <button onClick={stopCrawling} disabled={!isCrawling}>Stop Process</button>
            <CrawlerForm setTreeQueue={setTreeQueue} setErrorMessage={setErrorMessage} setCrawlTree={setCrawlTree} setQueueIndex={setQueueIndex} isCrawling={isCrawling} setIsCrawling={setIsCrawling} />
            <br></br>
            <div>{errorMessage}</div>
            <br></br>
            {
                crawlTree.map((site) => {
                    return (
                        <TreeElement key={site.url} site={site} />
                    )
                })
            }
        </div>
    );
}

export default HomePage;