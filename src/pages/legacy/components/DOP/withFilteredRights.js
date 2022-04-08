import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';
import {rightServiceManager} from '../../containers/avail/service/RightServiceManager';
import withRightsResultsTable from './withRightsResultsTable';
import {getConfig} from "@vubiquity-nexus/portal-utils/lib/config";

const withFilteredRights =
    (filterBy = {status: 'Ready'}) =>
    WrappedComponent => {
        class ComposedComponent extends Component {
            constructor(props) {
                super(props);
                const rowsProps = {
                    ...props.rowsProps,
                    defaultColDef: {cellStyle: props.cellStyle},
                    rowBuffer: '50',
                    rowModelType: 'infinite',
                    paginationPageSize: getConfig('avails.page.size'),
                    infiniteInitialRowCount: '0',
                    cacheOverflowSize: '2',
                    maxConcurrentDatasourceRequests: '1',
                    datasource: props.autoload ? {rowCount: null, getRows: this.getRows} : null,
                };
                this.state = {
                    rowsProps,
                    cols: [],
                    pageSize: getConfig('avails.page.size'),
                    table: null,
                };
            }

            componentDidMount() {
                const {colDef, refreshColumns} = this.props;
                this.setState({
                    cols: refreshColumns(colDef),
                });
            }

            componentDidUpdate(prevProps) {
                const {colDef, columns, availTabPageLoading, refreshColumns} = this.props;
                const {table} = this.state;

                if (!isEqual(prevProps.colDef, colDef) || !isEqual(prevProps.columns, columns)) {
                    this.setState({
                        cols: refreshColumns(colDef),
                    });
                }

                if (availTabPageLoading && availTabPageLoading !== prevProps.availTabPageLoading && table) {
                    table.api.setDatasource({rowCount: null, getRows: this.getRows});
                }
            }

            doSearch = (searchCriteria, page, pageSize, sortedParams) => {
                return rightServiceManager.callPlanningSearch(searchCriteria, page, pageSize, sortedParams);
            };

            getRows = params => {
                const {table, pageSize} = this.state;
                const {autoRefresh, sort} = this.props;
                const {startRow, failCallback, successCallback} = params;
                if (table && table.api.getDisplayedRowCount() === 0 && !autoRefresh) {
                    table.api.showLoadingOverlay();
                }

                this.doSearch(filterBy, Math.floor(startRow / pageSize), pageSize, sort)
                    .then(response => this.parseServerResponse(response, successCallback))
                    .catch(error => {
                        console.error(error);
                        failCallback();
                    });
            };

            parseServerResponse = (response, callback) => {
                const {table} = this.state;
                const {onDataLoaded} = this.props;
                if (response && response.total > 0) {
                    const {data, page, total, size} = response;
                    // if on or after the last page, work out the last row.
                    let lastRow = -1;
                    if ((page + 1) * size >= total) {
                        lastRow = total;
                    }

                    if (table) {
                        callback(data, lastRow);
                        table.api.hideOverlay();

                        if (typeof onDataLoaded === 'function') {
                            onDataLoaded(response);
                        }
                    }
                    return;
                }
                if (table) {
                    table.api.showNoRowsOverlay();
                }
            };

            setTable = element => {
                const {setTable} = this.props;
                if (element) {
                    element.api.showLoadingOverlay();
                    this.setState({table: element});

                    if (typeof setTable === 'function') {
                        setTable(element);
                    }
                }
            };

            render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        {...this.state.rowsProps}
                        colDef={this.state.cols}
                        setTable={this.setTable}
                        getRowNodeId={data => data.id}
                    />
                );
            }
        }
        ComposedComponent.propTypes = {
            autoload: PropTypes.bool,
            autoRefresh: PropTypes.number,
        };

        ComposedComponent.defaultProps = {
            autoload: true,
            autoRefresh: 0,
        };
        return withRightsResultsTable(ComposedComponent);
    };

export default withFilteredRights;
