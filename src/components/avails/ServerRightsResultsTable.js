import React from 'react';
import {connect} from 'react-redux';
import config from 'react-global-configuration';

import RightsResultsTable from './RightsResultsTable';
import {rightServiceManager} from '../../containers/avail/service/RightServiceManager';
import {getLocale} from '../../stores/selectors/localization/localeSelector';

export default function withRights(WrappedComponent) {
    return (props) => <ServerRightsResultsTableConnected WrappedComponent={WrappedComponent} {...props} />;
}

class ServerRightsResultsTable extends RightsResultsTable {


    static defaultProps = {
        autoload: true,
        autoRefresh: 0,
        locale: 'en-us',
    };

    constructor(props) {
        super(props);

        this.loadingRenderer = this.loadingRenderer.bind(this);
        this.refreshColumns = this.refreshColumns.bind(this);
        this.getRows = this.getRows.bind(this);
        this.setTable = this.setTable.bind(this);
        this.parseServerResponse = this.parseServerResponse.bind(this);

        const {
            availsMapping = {},
            locale,
            defaultColDef,
        } = this.props || {};

        let originalColDef = this.parseColumnsSchema(availsMapping.mappings || [], locale);

        let rowsProps = {defaultColDef: {
            ...defaultColDef,
            cellStyle: this.cellStyle
        }};

        rowsProps = {
            ...rowsProps,
            rowBuffer: '50',
            rowModelType: 'infinite',
            paginationPageSize: config.get('avails.page.size'),
            infiniteInitialRowCount: '0',
            cacheOverflowSize: '2',
            maxConcurrentDatasourceRequests: '1',
            datasource: this.props.autoload ? { rowCount: null, getRows: this.getRows} : null,
        };


        let colDef = {...this.props.colDef, ...originalColDef};
        this.state = {
            originalColDef: originalColDef,
            colDef: colDef,
            cols: [],
            pageSize: config.get('avails.page.size'),
            table: null,
            rowsProps: {...this.props.rowsProps, ...rowsProps}
        };
    }

    componentDidMount() {
        let newColDef = {...this.props.colDef, ...this.state.originalColDef};
        this.refreshColumns(newColDef);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.colDef !== this.props.colDef || prevProps.cols !== this.props.cols || prevProps.columns !== this.props.columns){
            let newColDef = {...this.props.colDef, ...this.state.originalColDef};
            this.refreshColumns(newColDef);
        }

        if(this.props.availTabPageLoading !== prevProps.availTabPageLoading && this.props.availTabPageLoading === true && this.state.table != null) {
            this.state.table.api.setDatasource({ rowCount: null, getRows: this.getRows});
        }
    }

    doSearch(page, pageSize, sortedParams) {
        return rightServiceManager.doSearch(page, pageSize, sortedParams);
    }

    getRows(params){
        if(this.state.table && this.state.table.api.getDisplayedRowCount() === 0 && !this.props.autoRefresh){
            this.state.table.api.showLoadingOverlay();
        }

        //Could be a problem with calculation page number. The cacheBlockSize, value row blocks by default is 100.
        //We should have the same as pageSize value.
        this.doSearch(Math.floor(params.startRow/this.state.pageSize), this.state.pageSize, this.props.sort)
           .then(response => {this.parseServerResponse(response, params);})
           .catch((error) => {
               console.error('Unexpected error');
               console.error(error);
               params.failCallback();
           });
        }

    parseServerResponse(response, callback){
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
        }else{
            if(this.state.table){
                this.state.table.api.showNoRowsOverlay();
            }
        }
        if(this.props.onDataLoaded){
            this.props.onDataLoaded(response);
        }
    }

    setTable(element){
        if(element){
            element.api.showLoadingOverlay();
            this.setState({table:element});
            if(this.props.setTable){
                this.props.setTable(element);
            }
        }
    }

    render(){
        const {WrappedComponent} = this.props;
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

const mapStateToProps = state => ({
    locale: getLocale(state),
});

const ServerRightsResultsTableConnected = connect(mapStateToProps)(ServerRightsResultsTable);
