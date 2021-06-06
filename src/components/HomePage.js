import React, { useEffect, useReducer, useState } from 'react';
import CrawlerForm from './CrawlerForm';
import { getCrawlTreeFromDB, deleteQueueInDB } from '../server/db/crawler';
import ReactJsonPrint from 'react-json-print'
import treeReducer, { initialTreeState } from '../reducers/searchTreeReducer';
import { updateTreeAction } from '../actions/searchTreeActions';

function HomePage() {
    const [treeState, dispatchTreeState] = useReducer(treeReducer, initialTreeState);

    const [queueName, setQueueName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isCrawling, setIsCrawling] = useState(false);
    const [showForm, setShowForm] = useState(true);

    let isDeletingQueue = false;
    console.log(treeState);

    const getTreeInterval = async () => {
        while (isCrawling && !!queueName && !isDeletingQueue) {
            try {
                let crawlInfo = await getCrawlTreeFromDB(queueName);
                setErrorMessage('');

                if (!!crawlInfo) {
                    dispatchTreeState(updateTreeAction(
                        crawlInfo?.tree?.length > 0 ? crawlInfo.tree : '{}'
                    ));
                }

                if (crawlInfo?.isCrawlingDone) {
                    setIsCrawling(false);
                    setQueueName('');
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                console.log(err);
                setErrorMessage(err.message);
                setIsCrawling(false);
                setQueueName('');
                break;
            }
        }
    }

    useEffect(() => {
        if (!isCrawling || !queueName) return;
        const fetchData = async () => {
            await getTreeInterval();
        }
        fetchData();
    }, [isCrawling, queueName]);

    const stopCrawling = () => {
        isDeletingQueue = true;
        deleteQueueInDB(queueName)
            .then((res) => {
                setIsCrawling(false);
                setQueueName('');
                isDeletingQueue = false;
            })
            .catch((err) => {
                setIsCrawling(false);
                setQueueName('');
                console.log(err);
                setErrorMessage(err.message);
                isDeletingQueue = false;
            });
    }

    const changeFormShow = () => {
        setShowForm(!showForm);
    }

    return (
        <div>
            <button onClick={stopCrawling} disabled={!isCrawling}>Stop Process</button>
            <div className="show-form-button" onClick={changeFormShow}>{ showForm ? "-" : "+" }</div>
            { showForm &&
            <CrawlerForm
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                isCrawling={isCrawling}
                setIsCrawling={setIsCrawling}
                setQueueName={setQueueName}
            /> }
            <br></br>
            <div>{errorMessage}</div>
            <br></br>
            { isCrawling && <div>Crawling in process...</div> }
            { treeState !== '{}' && <div className="tree"><ReactJsonPrint dataString={ treeState } expanded={true} /></div> }
        </div>
    );
}

export default HomePage;