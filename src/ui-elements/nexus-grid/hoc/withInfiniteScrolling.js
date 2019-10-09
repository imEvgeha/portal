import React, {useRef, useEffect} from 'react';

const ROW_BUFFER = 10;
const PAGINATION_PAGE_SIZE = 100;
const CACHE_OVERFLOW_SIZE = 2;
const MAX_CONCURRENT_DATASOURCE_REQUEST = 1;
const MAX_BLOCKS_IN_CACHE = 100;

const withInfiniteScrolling = (fetchData, infiniteProps = {}) => BaseComponent => {
    const {
        rowBuffer = ROW_BUFFER,
        paginationPageSize = PAGINATION_PAGE_SIZE,
        cacheOverflowSize = CACHE_OVERFLOW_SIZE,
        rowModelType = 'infinite',
        maxConcurrentDatasourceRequests = MAX_CONCURRENT_DATASOURCE_REQUEST,
        maxBlocksInCache = MAX_BLOCKS_IN_CACHE,
    } = infiniteProps;

    const ComposedComponent = props => {
        const gridApiRef = useRef({});
        useEffect(() => {
            const {api} = gridApiRef.current;
            if (api) {
                setTimeout(() => updateData(fetchData, api), 0);
            }
        }, [props.params]);
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
                        if (typeof props.succesDataFetchCallback === 'function') {
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

        const handleGridReady = gridApi => {
            const {api} = gridApiRef.current;
            if (!api) {
                gridApiRef.current = {api: gridApi};
            }
            updateData(fetchData, gridApi);
        };

        const mergedProps = {
            ...props,
            handleGridReady,
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
