import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';
import usePrevious from '../../../util/hooks/usePrevious';
import {parseAdvancedFilter} from '../../../containers/avail/service/RightsService';
import {GRID_EVENTS} from '../../../ui-elements/nexus-grid/constants';

const DEFAULT_HOC_PROPS = [
    'params',
    'setTotalCount',
    'isDatasourceEnabled',
    'successDataFetchCallback',
    'selectedRows',
];

const ROW_BUFFER = 10;
const PAGINATION_PAGE_SIZE = 100;
const CACHE_OVERFLOW_SIZE = 2;
const MAX_CONCURRENT_DATASOURCE_REQUEST = 1;
const MAX_BLOCKS_IN_CACHE = 100;
const ROW_MODEL_TYPE = 'infinite';

const withInfiniteScrolling = ({
    hocProps = DEFAULT_HOC_PROPS, 
    fetchData, 
    rowBuffer = ROW_BUFFER,
    paginationPageSize = PAGINATION_PAGE_SIZE,
    cacheOverflowSize = CACHE_OVERFLOW_SIZE,
    maxConcurrentDatasourceRequests = MAX_CONCURRENT_DATASOURCE_REQUEST,
    maxBlocksInCache = MAX_BLOCKS_IN_CACHE,
} = {}) => WrappedComponent => {
    const ComposedComponent = props => {
        const hasBeenCalledRef = useRef();
        const previousParams = usePrevious(props.params);
        const [gridApi, setGridApi] = useState();

        //  params
        useEffect(() => {
            const {params, isDatasourceEnabled} = props;
            if ((!isEqual(params, previousParams) && params) 
                && gridApi 
                && !hasBeenCalledRef.current
                && isDatasourceEnabled
               ) {
                updateData(fetchData, gridApi);
            }
        }, [props.params]);

        //  update data when datasource is enabled
        useEffect(() => {
            const {isDatasourceEnabled} = props;
            if (gridApi && isDatasourceEnabled) {
                updateData(fetchData, gridApi);
            }
        }, [gridApi, props.isDatasourceEnabled]);

        const getRows = (params, fetchData, gridApi) => {
            const {startRow, successCallback, failCallback, filterModel, sortModel} = params || {};
            const parsedParams = Object.keys(props.params || {})
                .filter(key => !filterModel.hasOwnProperty(key))
                .reduce((object, key) => {
                    object[key] = props.params[key];
                    return object;
                }, {});
            const filterParams = filterBy(filterModel);

            // handle filter
            if (typeof props.filterAction === 'function') {
                props.filterAction({column: filterParams});
            }

            const sortParams = sortBy(sortModel);
            const pageSize = paginationPageSize || 100;
            const pageNumber = Math.floor(startRow / pageSize);

            if (gridApi && gridApi.getDisplayedRowCount() === 0) {
                gridApi.showLoadingOverlay();
            }

            const preparedParams = {
                ...parsedParams,
                ...filterParams,
            };

            fetchData(preparedParams, pageNumber, pageSize, sortParams)
                .then(response => {
                    const {page = 0, size = 0, total = 0, data} = (response && response.data) || {};

                    if (typeof props.setTotalCount === 'function') { 
                        props.setTotalCount(total);
                    }

                    if (total > 0){
                        let lastRow = -1;
                        if ((page + 1) * size >= total) {
                            lastRow = total;
                        }
                        // TODO: it shouldn't be here
                        if (typeof props.onAddAdditionalField === 'function') {
                            props.onAddAdditionalField(data, (updatedData) => successCallback(updatedData, lastRow));
                        } else {
                            successCallback(data, lastRow);
                        }

                        // selected rows
                        if (props.selectedRows) {
                            gridApi.forEachNode(rowNode => {
                                const selectedNode = props.selectedRows[rowNode.id];
                                if (selectedNode) {
                                    rowNode.setSelected(true);
                                }
                            });
                        }  

                        if (typeof props.successDataFetchCallback === 'function') {
                            const preparedData = {page, size, total, data};
                            props.successDataFetchCallback(pageNumber, preparedData);
                        }

                        gridApi.hideOverlay();
                        return;
                    } 

                    gridApi.showNoRowsOverlay();
                })
                .catch(error => failCallback(error))
                .finally(() => hasBeenCalledRef.current = false);
        };

        // filtering 
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

        // sorting
        const sortBy = sortModel => {
            return sortModel;
        };

        const updateData = (fetchData, gridApi) => {
            hasBeenCalledRef.current = true;
            const dataSource = {
                rowCount: null,
                getRows: params => getRows(params, fetchData, gridApi),
            };
            gridApi.setDatasource(dataSource);
        };

        const onGridEvent = data => {
            const {onGridEvent} = props;
            const events = [GRID_EVENTS.READY, GRID_EVENTS.FIRST_DATA_RENDERED, GRID_EVENTS.SELECTION_CHANGED]; 
            const {api, type} = data || {};
            if (type === GRID_EVENTS.READY && !gridApi) {
                setGridApi(api);
            }

            if (events.includes(type) && typeof onGridEvent === 'function') {
                props.onGridEvent(data);
            }
        };

        const propsWithoutHocProps = omit(props, [...DEFAULT_HOC_PROPS, ...hocProps]);

        const mergedProps = {
            ...propsWithoutHocProps,
            onGridEvent,
            rowBuffer,
            rowModelType: ROW_MODEL_TYPE,
            paginationPageSize,
            cacheOverflowSize,
            maxConcurrentDatasourceRequests,
            maxBlocksInCache,
            deltaRowDataMode: true,
            getRowNodeId: data => data.id,
            suppressAnimationFrame: true,
        };

        return (
            <WrappedComponent
                {...mergedProps}
            />
        );
    };

    ComposedComponent.propTypes = {
        ...WrappedComponent.propTypes,
        onGridEvent: PropTypes.func,
        setTotalCount: PropTypes.func,
        successDataFetchCallback: PropTypes.func,
        onAddAdditionalField: PropTypes.func,
        params: PropTypes.object,
        isDatasourceEnabled: PropTypes.bool,
    };

    ComposedComponent.defaultProps = {
        ...WrappedComponent.defaultProps,
        onGridEvent: null,
        setTotalCount: null,
        successDataFetchCallback: null,
        onAddAdditionalField: null,
        params: null,
        isDatasourceEnabled: true,
    };

    return ComposedComponent;
};

export default withInfiniteScrolling;
