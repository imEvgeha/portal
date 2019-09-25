import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {rightServiceManager} from '../../containers/avail/service/RightServiceManager';

const totalCount = 16000;


const doSearch = (page, pageSize, sortedParams) => {
    return rightServiceManager.doSearch(page, pageSize, sortedParams);
};

const getRows = (params, api) => {
    if (api.getDisplayedRowCount() === 0){
        api.showLoadingOverlay();
    }
    doSearch(Math.floor(params.startRow / this.state.pageSize), pageSize, this.props.sort)
    .then(response => {parseServerResponse(response, params);})
    .catch(() => {
        params.failCallback();
    });
};

const parseServerResponse = (response, callback, api) => {
    if(response && response.data.total > 0){
        // if on or after the last page, work out the last row.
        let lastRow = -1;
        if ((response.data.page + 1) * response.data.size >= response.data.total) {
            lastRow = response.data.total;
        }
        if(this.state.table){
            callback.successCallback(response.data.data, lastRow);
            this.state.table.api.hideOverlay();
        }
        return;
    } 
    api.showNoRowsOverlay();
}


const withInfinitiveScroll = BaseComponent => {
    const ComposedComponent = props => {
        const getRows = (params, data, api) => {
            console.log(params, 'params')
            console.log(`asking for ${params.startRow} to ${params.endRow}`);
            console.log(api.getModel().getRowCount())
            console.log(api.getModel().getRow(2000))
            // doSearch(
            //     Math.floor(params.startRow / this.state.pageSize), 
            //     this.state.pageSize, 
            // )
            setTimeout(function() {
                const rowsThisPage = data.slice(params.startRow, params.endRow);
                let lastRow = -1;
                if (totalCount < params.endRow) {
                    lastRow = data.length;
                }
                params.successCallback(rowsThisPage, lastRow);
            }, 500);
        };
        const updateData = (data, api) => {
            const dataSource = {
                rowCount: null,
                getRows: (params) => getRows(params, data, api),
            };
            api.setDatasource(dataSource);
        };

        return (
            <BaseComponent
                updateData={updateData}
                {...props}
            />
        );
    };
    return ComposedComponent;
};

export default withInfinitiveScroll;
