import React from 'react';

const withInfiniteScrolling = (fetchData, infiniteProps = {}) => BaseComponent => {
    const {
        rowBuffer = 10,
        paginationPageSize = 100,
        cacheOverflowSize = 2,
        rowModelType = 'infinite',
        maxConcurrentDatasourceRequests = 1,
        maxBlocksInCache = 100,
    } = infiniteProps;

    const ComposedComponent = props => {
        const getRows = (params, fetchData, gridApi) => {
            const {startRow, successCallback, failCallback} = params || {};
            const pageSize = paginationPageSize || 100;
            const pageNumber = Math.floor(startRow / pageSize);
            if (gridApi && gridApi.getDisplayedRowCount() === 0) {
                gridApi.showLoadingOverlay();
            }
            fetchData(pageNumber, pageSize, props.params)
                .then(response => {
                    const {data = {}} = response || {};
                    const {page = 0, size = 0, total = 0} = data;
                    if (total > 0){
                        let lastRow = -1;
                        if ((page + 1) * size >= total) {
                            lastRow = total;
                        }
                        if (typeof props.setTotalCount === 'function') { 
                            props.setTotalCount(total);
                        }

                        successCallback(data.data, lastRow);
                        if(typeof props.succesDataFetchCallback === 'function') {
                            props.succesDataFetchCallback(pageNumber, data);
                        }

                        gridApi.hideOverlay();
                        return;
                    } 
                    gridApi.showNoRowsOverlay();
                })
                .catch(error => failCallback(error));
        };
        const updateData = (fetchData, gridApi) => {
            const dataSource = {
                rowCount: null,
                getRows: params => getRows(params, fetchData, gridApi),
            };
            gridApi.setDatasource(dataSource);
        };
        const mergedProps = {
            ...props,
            setRowData: gridApi => updateData(fetchData, gridApi),
            rowBuffer,
            rowModelType,
            paginationPageSize,
            cacheOverflowSize,
            maxConcurrentDatasourceRequests,
            maxBlocksInCache,
            deltaRowDataMode: true,
            getRowNodeId: data => data.id,
            suppressAnimationFrame: true,
        };

        return (
            <BaseComponent
                {...mergedProps}
            />
        );
    };
    return ComposedComponent;
};

export default withInfiniteScrolling;
