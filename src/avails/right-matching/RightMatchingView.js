import React, {useState} from 'react';
import {compose} from 'redux';
import './RightMatchingView.scss';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScroll from '../../ui-elements/nexus-grid/withInfiniteScroll';

const RightMatchingView = (props) => {
    const [rowData, setRowData] = useState([]);
    const getGridApi = (api, columnApi) => {        
        fetchData().then(data => {
            setRowData(data);
            props.updateData(data, api)
        });
    };

    const fetchData = () => {
        const httpRequest = new XMLHttpRequest();
        const url = 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json';
        return new Promise((resolve, reject) => {
            return fetch(url)
                .then(response => {
                    response.json().then(result => resolve(result));
                })
                .catch(error => reject(error));
        });
    };

    return (
        <div className="nexus-c-right-matching-view">
            Right Matching
            <NexusGrid 
                columnDefs={[]}
                context={{name: 'infinite'}}
                rowData={rowData}
                getGridApi={getGridApi}
                rowBuffer={0}
                rowModelType='infinite'
                paginationPageSize={10}
                cacheOverflowSize={2}
                maxConcurrentDatasourceRequests={1}
                infiniteInitialRowCount={1000}
                maxBlocksInCache={10}
            />
        </div>
    );
};

export default compose(withInfiniteScroll)(RightMatchingView);
