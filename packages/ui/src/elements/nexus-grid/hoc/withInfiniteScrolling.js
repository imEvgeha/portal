/* eslint-disable react/destructuring-assignment */
import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {cleanObject} from '@vubiquity-nexus/portal-utils/lib/Common';
import {omit, isEqual, debounce} from 'lodash';
import {connect, useSelector} from 'react-redux';
import {useDateTimeContext} from '../../../../lib/elements/nexus-date-time-context/NexusDateTimeProvider';
import {toggleRefreshGridData} from '../../../grid/gridActions';
import {getShouldGridRefresh} from '../../../grid/gridSelectors';
import {filterBy, sortBy} from '../utils';
import usePrevious from './hooks/usePrevious';
import {
    DEFAULT_HOC_PROPS,
    ROW_BUFFER,
    PAGINATION_PAGE_SIZE,
    PAGINATION_SIZE_STEP,
    CACHE_OVERFLOW_SIZE,
    MAX_CONCURRENT_DATASOURCE_REQUEST,
    MAX_BLOCKS_IN_CACHE,
    ROW_MODEL_TYPE,
    GRID_EVENTS,
} from '../constants';

const withInfiniteScrolling =
    ({
        hocProps = DEFAULT_HOC_PROPS,
        fetchData,
        filtersInBody = false,
        rowBuffer = ROW_BUFFER,
        paginationPageSize = PAGINATION_PAGE_SIZE,
        cacheOverflowSize = CACHE_OVERFLOW_SIZE,
        maxConcurrentDatasourceRequests = MAX_CONCURRENT_DATASOURCE_REQUEST,
        maxBlocksInCache = MAX_BLOCKS_IN_CACHE,
    } = {}) =>
    WrappedComponent => {
        const ComposedComponent = props => {
            const hasBeenCalledRef = useRef(false);
            const isMounted = useRef(true);
            const previousParams = usePrevious(props.params);
            const [gridApi, setGridApi] = useState();
            const {isLocal} = useDateTimeContext();

            useEffect(() => {
                return () => {
                    isMounted.current = false;
                };
            }, []);

            // Handle refreshing grid's data from outside
            useEffect(() => {
                if (isMounted.current && props.shouldGridRefresh && fetchData && gridApi) {
                    updateData(fetchData, gridApi);
                    props.toggleRefreshGridData(false);
                }
            }, [props.shouldGridRefresh, fetchData, gridApi]);

            //  params
            useEffect(() => {
                const {params, isDatasourceEnabled} = props;
                if (
                    isMounted.current &&
                    !isEqual(params, previousParams) &&
                    params &&
                    gridApi &&
                    !hasBeenCalledRef.current &&
                    isDatasourceEnabled
                ) {
                    updateData(fetchData, gridApi);
                }
            }, [props.params]);

            //  update data when datasource is enabled
            useEffect(() => {
                const {isDatasourceEnabled} = props;
                if (isMounted.current && gridApi && isDatasourceEnabled) {
                    updateData(fetchData, gridApi);
                }
            }, [gridApi, props.isDatasourceEnabled, props.externalFilter, isLocal]);
            /**
             * aggrid issue: getRows needs to be called with debounce (wait = 0, invocation is deferred until to the next tick)
             * in order to avoid subsequently calling fetchData with the same params every time filter, sort and columns model
             * is reset to default state (AG-142)
             */
            const getRows = debounce((params, fetchData, gridApi) => {
                const {startRow, successCallback, failCallback, filterModel, sortModel, context} = params || {};
                const parsedParams = Object.keys(props.params || {})
                    .filter(key => !filterModel.hasOwnProperty(key))
                    .reduce((object, key) => {
                        if (filtersInBody) {
                            object[`${key}List`] = [props.params[key]];
                        } else {
                            object[key] = props.params[key];
                        }
                        return object;
                    }, {});
                let filterParams = {
                    ...filterBy(filterModel, props.prepareFilterParams, filtersInBody),
                    ...props.externalFilter,
                };
                const sortParams = sortBy(sortModel);
                const pageSize = paginationPageSize || PAGINATION_PAGE_SIZE;
                const pageNumber = Math.floor(startRow / pageSize);

                if (isMounted.current && gridApi && startRow === 0) {
                    gridApi.showLoadingOverlay();
                }

                filterParams = cleanObject(filterParams, true);
                const preparedParams = filtersInBody
                    ? {}
                    : {
                          ...parsedParams,
                          ...filterParams,
                      };

                const body = filtersInBody
                    ? {
                          ...parsedParams,
                          ...filterParams,
                          isLocal,
                      }
                    : {isLocal};

                if (typeof props.setDataLoading === 'function' && isMounted.current) {
                    props.setDataLoading(true);
                }

                fetchData(preparedParams, pageNumber, pageSize, sortParams, body)
                    .then(response => {
                        const {page = pageNumber, size = pageSize, total = 0, data} = response || {};

                        // Callback to return the response of tha API
                        props.setData(response);
                        if (typeof props.setTotalCount === 'function' && isMounted.current) {
                            props.setTotalCount(total);
                        }

                        if (typeof props.setDisplayedRows === 'function' && isMounted.current) {
                            const count = (page + 1) * pageSize;
                            props.setDisplayedRows(count >= total ? total : count);
                        }

                        if (total > 0) {
                            const updatedTotal = size * page + PAGINATION_SIZE_STEP;
                            successCallback(data, updatedTotal > total ? total : updatedTotal);

                            // selected rows
                            if (context && context.selectedRows) {
                                gridApi.forEachNode(rowNode => {
                                    const selectedNode = context.selectedRows.find(({id}) => id === rowNode.id);
                                    if (selectedNode) {
                                        rowNode.setSelected(true, false, true);
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

                        successCallback(data, 0);
                        gridApi.showNoRowsOverlay();
                    })
                    .catch(error => {
                        failCallback(error);
                        gridApi.showNoRowsOverlay();
                    })
                    .finally(() => {
                        hasBeenCalledRef.current = false;
                        if (typeof props.setDataLoading === 'function' && isMounted.current) {
                            props.setDataLoading(false);
                        }
                    });
            }, 0);

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
                const events = [
                    GRID_EVENTS.READY,
                    GRID_EVENTS.FIRST_DATA_RENDERED,
                    GRID_EVENTS.SELECTION_CHANGED,
                    GRID_EVENTS.FILTER_CHANGED,
                ];
                const {api, type} = data || {};
                if (type === GRID_EVENTS.READY && !gridApi) {
                    setGridApi(api);
                }

                if (isMounted.current && events.includes(type) && typeof onGridEvent === 'function') {
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
                immutableData: true,
                getRowNodeId: data => data.id,
                suppressAnimationFrame: true,
            };

            return <WrappedComponent {...mergedProps} />;
        };

        ComposedComponent.propTypes = {
            ...WrappedComponent.propTypes,
            onGridEvent: PropTypes.func,
            setTotalCount: PropTypes.func,
            setData: PropTypes.func,
            setDisplayedRows: PropTypes.func,
            successDataFetchCallback: PropTypes.func,
            onAddAdditionalField: PropTypes.func,
            params: PropTypes.object,
            isDatasourceEnabled: PropTypes.bool,
        };

        ComposedComponent.defaultProps = {
            ...WrappedComponent.defaultProps,
            onGridEvent: null,
            setTotalCount: null,
            setDisplayedRows: () => null,
            successDataFetchCallback: null,
            onAddAdditionalField: null,
            params: null,
            isDatasourceEnabled: true,
            setData: () => null,
        };

        const mapStateToProps = state => ({
            shouldGridRefresh: getShouldGridRefresh(state),
        });

        const mapDispatchToProps = dispatch => ({
            toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
        });

        return connect(mapStateToProps, mapDispatchToProps)(ComposedComponent);
    };

export default withInfiniteScrolling;
