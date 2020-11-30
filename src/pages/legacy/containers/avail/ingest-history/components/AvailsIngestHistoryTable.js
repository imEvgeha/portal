import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import config from 'react-global-configuration';

import {AgGridReact} from 'ag-grid-react';

import AvailHistoryRecordRenderer from './AvailHistoryRecordRenderer';
import './AvailsIngestHistoryTable.scss';

import HistoryURL from '../../util/HistoryURL';

// image import
import LoadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';

import {connect} from 'react-redux';
import {
    resultPageHistoryUpdate,
    searchFormSetHistorySearchCriteria,
    searchFormUpdateAdvancedHistorySearchCriteria,
} from '../../../../stores/actions/avail/history';
import {historyServiceManager} from '../HistoryServiceManager';
import getContextMenuItems from '../../../../../../ui/elements/nexus-grid/elements/cell-renderer/getContextMenuItems';

const mapStateToProps = state => {
    return {
        availHistoryPage: state.history.availHistoryPage,
        availHistoryLoading: state.history.availHistoryLoading,
        searchCriteria: state.history.session.searchCriteria,
        advancedSearchCriteria: state.history.session.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    resultPageHistoryUpdate,
    searchFormSetHistorySearchCriteria,
    searchFormUpdateAdvancedHistorySearchCriteria,
};

class AvailsIngestHistoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: config.get('avails.page.size'),
            cols: [{headerName: '', cellRendererFramework: this.loadingRenderer, minWidth: 150}],
        };

        this.getRows = this.getRows.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        this.setState({dataSource: {rowCount: null, getRows: this.getRows}});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        const offsetTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        const offsetLeft = ReactDOM.findDOMNode(this).getBoundingClientRect().left;
        this.setState({
            height: window.innerHeight - offsetTop - 140 + 'px',
            width: window.innerWidth - offsetLeft - 20 + 'px',
        });
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.availHistoryLoading !== prevProps.availHistoryLoading &&
            this.props.availHistoryLoading === true &&
            this.table !== null
        ) {
            this.table.api.setDatasource(this.state.dataSource);
        }
    }

    doSearch(page, pageSize, sortedParams) {
        return historyServiceManager.doSearch(page, pageSize, sortedParams);
    }

    getRows(params) {
        if (this.table.api.getDisplayedRowCount() == 0) {
            this.table.api.showLoadingOverlay();
        }

        this.doSearch(
            Math.floor(params.startRow / this.state.pageSize),
            this.state.pageSize,
            this.props.availTabPageSort
        )
            .then(response => {
                if (response && response.total > 0) {
                    this.addLoadedItems(response);
                    // if on or after the last page, work out the last row.
                    let lastRow = -1;
                    if ((response.page + 1) * response.size >= response.total) {
                        lastRow = response.total;
                    }
                    params.successCallback(response.data, lastRow);
                    if (this.table) {
                        this.table.api.hideOverlay();
                    }
                } else {
                    if (this.table) {
                        this.table.api.showNoRowsOverlay();
                        this.resetLoadedItems();
                    }
                }
            })
            .catch(error => {
                console.error('Unexpected error');
                console.error(error);
                params.failCallback();
            });
    }

    addLoadedItems(data) {
        const items = data.data;
        if (items.length > 0) {
            this.props.resultPageHistoryUpdate({
                pages: this.props.availHistoryPage.pages + 1,
                avails: this.props.availHistoryPage.records.concat(items),
                pageSize: this.props.availHistoryPage.pageSize + items.length,
                total: data.total,
            });
        }
    }

    resetLoadedItems() {
        this.props.resultPageHistoryUpdate({
            pages: 0,
            avails: [],
            pageSize: 0,
            total: 0,
        });
    }

    setTable = element => {
        this.table = element;
        if (this.table) {
            element.api.showLoadingOverlay();
        }
    };

    loadingRenderer(params) {
        if (params.data !== undefined) {
            return (
                <div>
                    <AvailHistoryRecordRenderer {...params} />
                </div>
            );
        } else {
            return <img src={LoadingGif} />;
        }
    }

    setIngestType(type) {
        if (type !== this.props.searchCriteria.ingestType) {
            HistoryURL.saveHistoryAdvancedFilterUrl({...this.props.advancedSearchCriteria, ingestType: type});
            this.props.searchFormUpdateAdvancedHistorySearchCriteria({
                ...this.props.advancedSearchCriteria,
                ingestType: type,
            });
            this.props.searchFormSetHistorySearchCriteria({...this.props.searchCriteria, ingestType: type});
            this.table.api.setDatasource(this.state.dataSource);
        }
    }

    render() {
        return (
            <div id="avail-ingest-history-result-table">
                <div className="container-fluid" style={{paddingLeft: '0'}}>
                    <div className="justify-content-between" style={{paddingTop: '16px'}}>
                        <div className="align-bottom" style={{marginBottom: '10px'}}>
                            <span
                                className="table-top-text"
                                id="avail-ingest-history-result-number"
                                style={{paddingTop: '10px', marginLeft: '20px'}}
                            >
                                Results: {this.props.availHistoryPage.total}
                            </span>
                        </div>
                    </div>
                    <div className="tab">
                        <button
                            className={'tablinks ' + (this.props.searchCriteria.ingestType === '' ? 'active' : '')}
                            onClick={() => this.setIngestType('')}
                        >
                            All
                        </button>
                        <button
                            className={'tablinks ' + (this.props.searchCriteria.ingestType === 'Email' ? 'active' : '')}
                            onClick={() => this.setIngestType('Email')}
                        >
                            Emailed
                        </button>
                        <button
                            className={
                                'tablinks ' + (this.props.searchCriteria.ingestType === 'Upload' ? 'active' : '')
                            }
                            onClick={() => this.setIngestType('Upload')}
                        >
                            Uploaded
                        </button>
                    </div>
                    <div
                        className="ag-theme-balham"
                        style={{
                            height: this.state.height,
                            width: this.state.width,
                        }}
                    >
                        <AgGridReact
                            ref={this.setTable}
                            onGridReady={params => params.api.sizeColumnsToFit()}
                            onGridSizeChanged={params => params.api.sizeColumnsToFit()}
                            getRowNodeId={data => data.id}
                            columnDefs={this.state.cols}
                            rowBuffer="2"
                            rowModelType="infinite"
                            paginationPageSize={this.state.pageSize}
                            infiniteInitialRowCount="0"
                            cacheOverflowSize="2"
                            maxConcurrentDatasourceRequests="1"
                            datasource={this.state.dataSource}
                            headerHeight="0"
                            rowHeight="70"
                            suppressHorizontalScroll={true}
                            getContextMenuItems={getContextMenuItems}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

AvailsIngestHistoryTable.propTypes = {
    searchCriteria: PropTypes.object,
    advancedSearchCriteria: PropTypes.object,
    availHistoryLoading: PropTypes.bool,
    resultPageHistoryUpdate: PropTypes.func,
    searchFormSetHistorySearchCriteria: PropTypes.func,
    searchFormUpdateAdvancedHistorySearchCriteria: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AvailsIngestHistoryTable);
