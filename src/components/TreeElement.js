import React from 'react';

function TreeElement(props) {
    return (
        <div>
            <span>{props.site.url}</span>
            <span>{props.site.level}</span>
            <ul>
            {
                props.site.children.map((child) => {
                    return <li key={child.url}><TreeElement key={child.url} site={child} /></li>
                })
            }
            </ul>
            <br></br>
        </div>
    );
}

export default TreeElement;