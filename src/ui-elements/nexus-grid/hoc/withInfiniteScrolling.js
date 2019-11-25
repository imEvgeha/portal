import React, {useRef, useEffect} from 'react';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import usePrevious from '../../../util/hooks/usePrevious';
import {parseAdvancedFilter} from '../../../containers/avail/service/RightsService';
import {GRID_EVENTS} from '../../../ui-elements/nexus-grid/constants';

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
        const previousParams = usePrevious(props.params);
        const previousExcludedItems = usePrevious(props.excludedItems);

        useEffect(() => {
            const {api} = gridApiRef.current;
            if (((!isEqual(props.params, previousParams) && props.params) 
                || (!isEqual(props.excludedItems, previousExcludedItems) && props.excludedItems)) 
            && api) {
                updateData(fetchData, api);
            }
        }, [props.params, props.excludedItems]);

        const getRows = (params, fetchData, gridApi) => {
            const {startRow, successCallback, failCallback, filterModel, sortModel} = params || {};
            const parsedParams = Object.keys(props.params)
                .filter(key => !filterModel.hasOwnProperty(key))
                .reduce((object, key) => {
                    object[key] = props.params[key];
                    return object;
                }, {});
            const filterParams = filterBy(filterModel);
            const sortParams = sortBy(sortModel);
            const pageSize = paginationPageSize || 100;
            const pageNumber = Math.floor(startRow / pageSize);
            if (gridApi && gridApi.getDisplayedRowCount() === 0) {
                gridApi.showLoadingOverlay();
            }

            const preparedParams = {
                ...parsedParams,
                ...filterParams,
                ...sortParams,
            };

            fetchData(pageNumber, pageSize, preparedParams)
                .then(response => {
                    const {excludedItems} = props;
                    const {page = 0, size = 0, total = 0, data} = getResponseData(response, excludedItems);

                    if (typeof props.setTotalCount === 'function') { 
                        props.setTotalCount(total);
                    }

                    if (total > 0){
                        let lastRow = -1;
                        if ((page + 1) * size >= total) {
                            lastRow = total;
                        }
                        successCallback(data, lastRow);

                        if (typeof props.succesDataFetchCallback === 'function') {
                            const preparedData = {page, size, total, data};
                            props.succesDataFetchCallback(pageNumber, preparedData);
                        }

                        gridApi.hideOverlay();
                        return;
                    } 
                    gridApi.showNoRowsOverlay();
                })
                .catch(error => failCallback(error));
        };

        const getResponseData = (response, excludedCriteria) => {
            const {data = {}} = response || {};
            const {page = 0, size = 0, total = 0} = data || {};
            if (Array.isArray(excludedCriteria) && total > 0) {
                const key = !!excludedCriteria.length && Object.keys(excludedCriteria[0])[0];
                const items = data.data.filter(el => !excludedCriteria.some(item => el.hasOwnProperty(key) && item[key] === el[key]));
                const totalItems = total - excludedCriteria.length;
                return {
                    page, 
                    size, 
                    total: totalItems, 
                    data: items,
                };
            }

            return data;
        };

        const filterBy = filterObject => {
            const ALLOWED_TYPES_OPERAND = ['equals'];
            const FILTER_TYPES = ['set'];
            if (!isEmpty(filterObject)) {
                const filteredEqualsType = Object.keys(filterObject)
                    .filter(key => ALLOWED_TYPES_OPERAND.includes(filterObject[key].type) || FILTER_TYPES.includes(filterObject[key].filterType))
                    .reduce((obj, key) => {
                        obj[key] = filterObject[key];
                        return obj;
                      }, {});
                const filterParams = Object.keys(filteredEqualsType).reduce((object, name) => {
                    const {filter, values, filterType} = filteredEqualsType[name] || {};
                    object[name] = FILTER_TYPES.includes(filterType) ? Array.isArray(values) && values.join(', ') : filter;
                    return object;
                }, {});
                return parseAdvancedFilter(filterParams);
            }
            return {};
        };

        const sortBy = sortModel => {
            return sortModel;
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
            if (typeof props.handleGridReady === 'function') {
                props.handleGridReady(gridApi);
            }
            if (!api) {
                gridApiRef.current = {api: gridApi};
            }
            updateData(fetchData, gridApi);
        };

        const onGridEvent = data => {
            const events = [GRID_EVENTS.READY, GRID_EVENTS.FIRST_DATA_RENDERED]; 
            if (events.includes(data.type)) {
                if (typeof props.onGridEvent === 'function') {
                    props.onGridEvent(data);
                }
            }
        };

        const mergedProps = {
            ...props,
            handleGridReady,
            onGridEvent,
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
