import React from 'react';
import ReactDOM from 'react-dom';
import t from 'prop-types';
import moment from 'moment';
import {Link} from 'react-router-dom';

import config from 'react-global-configuration';

// image import
import LoadingGif from '../../../../img/loading.gif';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './AvailResultTable.scss';

import connect from 'react-redux/es/connect/connect';
import {resultPageUpdate, resultPageSort, resultPageSelect, resultPageLoading, resultPageUpdateColumnsOrder} from '../../../../stores/actions/avail/dashboard';
import {availServiceManager} from '../../service/AvailServiceManager';

const colDef = [];
let registeredOnSelect= false;

/**
 * Advance Search -
 * title, studio Vod Start Date, Vod End Date
 */
let mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        availTabPageSort: state.dashboard.session.availTabPageSort,
        freeTextSearch: state.dashboard.freeTextSearch,
        availTabPageSelection: state.dashboard.session.availTabPageSelection,
        availTabPageLoading: state.dashboard.availTabPageLoading,
        availsMapping: state.root.availsMapping,
        columnsOrder: state.dashboard.session.columns,
        columnsSize: state.dashboard.session.columnsSize,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};

let mapDispatchToProps = {
    resultPageUpdate,
    resultPageSort,
    resultPageSelect,
    resultPageLoading,
    resultPageUpdateColumnsOrder
};

class AvailsResultTable extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        availTabPage: t.object,
        availTabPageSort: t.array,
        freeTextSearch: t.object,
        availTabPageSelection: t.object,
        availTabPageLoading: t.bool,
        resultPageUpdate: t.func,
        resultPageSort: t.func,
        resultPageSelect: t.func,
        resultPageLoading: t.func,
        columnsOrder: t.array,
        columnsSize: t.object,
        resultPageUpdateColumnsOrder: t.func,
        showSelectedAvails: t.bool,
        fromServer: t.bool,
        hidden: t.bool
    };

    table = null;

    constructor(props) {
        super(props);
        this.state = {
            originalData: this.props.availTabPageSelection.selected.slice(0),
            atLeastOneSelected: false,
            pageSize: config.get('avails.page.size'),
            cols:[],
            defaultColDef: {
                cellStyle: this.cellStyle
            }
        };

        this.loadingRenderer = this.loadingRenderer.bind(this);
        this.refreshColumns = this.refreshColumns.bind(this);
        this.getRows = this.getRows.bind(this);
        this.addLoadedItems = this.addLoadedItems.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.parseColumnsSchema = this.parseColumnsSchema.bind(this);
        this.onColumnReordered = this.onColumnReordered.bind(this);
        this.onColumnResized = this.onColumnResized.bind(this);
        this.onSortChanged = this.onSortChanged.bind(this);
        this.refreshSelected = this.refreshSelected.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onSelectionChangedProcess = this.onSelectionChangedProcess.bind(this);
        this.onEdit = this.onEdit.bind(this);

        if(colDef.length === 0){
            this.parseColumnsSchema();
        }
    }

    componentDidMount() {
        this.dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: this.getRows
        };

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        //ugly hack to change height once advanced filter finishes its transition (appearing or dissapearing)
        let elem = document.querySelector('.vu-advanced-search-panel');
        elem.addEventListener('transitionend', this.updateWindowDimensions);
        elem = document.querySelector('.vu-free-text-search');
        elem.addEventListener('transitionend', this.updateWindowDimensions);
        this.refreshColumns();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        let elem = document.querySelector('.vu-advanced-search-panel');
        elem.removeEventListener('transitionend', this.updateWindowDimensions);
        elem = document.querySelector('.vu-free-text-search');
        elem.removeEventListener('transitionend', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        let offsetTop  = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        this.setState({ height: (window.innerHeight - offsetTop - 10) + 'px' });
    }

    componentDidUpdate(prevProps) {
        if(!this.table) return;
        if(this.props.columnsOrder !== prevProps.columnsOrder) {
            this.refreshColumns();
            for(let i=0; i< Math.min(this.props.columnsOrder.length, prevProps.columnsOrder.length); i++){
                this.table.columnApi.moveColumn(this.props.columnsOrder[i], i+1);
            }

            this.setState({});
        }

        this.refreshSort();

        if(this.props.fromServer && this.props.availTabPageLoading !== prevProps.availTabPageLoading && this.props.availTabPageLoading === true && this.table != null) {
            this.table.api.setDatasource(this.dataSource);
        }

        if(prevProps.availTabPageSelection !== this.props.availTabPageSelection){
            if(this.props.fromServer){
                if(this.props.showSelectedAvails){
                    this.refreshSelected();
                }
            }else{
                if(!this.props.showSelectedAvails) {
                    this.setState({originalData: this.props.availTabPageSelection.selected.slice(0)});
                    setTimeout(() => {this.table.api.selectAll();}, 1);
                }
            }
        }

        //when we go out of 'See selected avails'
        if(prevProps.showSelectedAvails !== this.props.showSelectedAvails && this.props.showSelectedAvails === false && !this.props.fromServer){
            this.setState({originalData: this.props.availTabPageSelection.selected.slice(0)});
            setTimeout(() => {this.table.api.selectAll();}, 1);
        }
        if(prevProps.hidden !== this.props.hidden && this.props.hidden){
            this.updateWindowDimensions();
        }
    }

    parseColumnsSchema() {
        if(this.props.availsMapping){
            this.props.availsMapping.mappings.map(column => colDef[column.javaVariableName] = {
                field:column.javaVariableName,
                headerName:column.displayName,
                cellRendererFramework: this.loadingRenderer,
                valueFormatter: column.dataType==='date' ? function(params) {
                    if(params.data && params.data[column.javaVariableName]) return moment(params.data[column.javaVariableName]).format('L');
                    else return undefined;
                } : null,
                width: this.props.columnsSize && this.props.columnsSize.hasOwnProperty(column.javaVariableName)? this.props.columnsSize[column.javaVariableName] : 250
            });
        }
    }

    refreshSort(){
        if(!this.table) return;
        let sortModel=[];
        this.props.availTabPageSort.map(sortCriteria=>{
            sortModel.push({colId:sortCriteria.id, sort:sortCriteria.desc ? 'desc' : 'asc'});
        });

        let currentSortModel=this.table.api.getSortModel();
        let toChangeSortModel=false;

        if(currentSortModel.length !== sortModel.length) toChangeSortModel=true;

        for(let i=0; i < sortModel.length && !toChangeSortModel; i++){
            if(sortModel[i].colId !== currentSortModel[i].colId) toChangeSortModel = true;
            if(sortModel[i].sortCriteria !== currentSortModel[i].sortCriteria) toChangeSortModel = true;
        }

        if(toChangeSortModel){
            this.table.api.setSortModel(sortModel);
        }
    }

    onSortChanged(e) {
        let sortParams = e.api.getSortModel();
        let newSort = [];
        if(sortParams.length > 0){
            sortParams.map(criteria =>{
                newSort.push({id : e.columnApi.getColumn(criteria.colId).colDef.field, desc: criteria.sort === 'desc'});
            });
        }
        this.props.resultPageSort(newSort);
    }

    onSelectionChanged(){
        if(!registeredOnSelect){
            registeredOnSelect = true;
            setTimeout(this.onSelectionChangedProcess, 1);
        }
    }

    onScroll(){
        const allVisibleSelected = this.areAllVisibleSelected();
        if(allVisibleSelected !== this.props.availTabPageSelection.selectAll) {
            this.props.resultPageSelect({selected: this.props.availTabPageSelection.selected, selectAll: allVisibleSelected});
            return;
        }
        const oneVisibleSelected = this.isOneVisibleSelected();
        if(oneVisibleSelected !== this.state.atLeastOneSelected) {
            this.props.resultPageSelect({selected: this.props.availTabPageSelection.selected, selectAll: allVisibleSelected});
            this.setState({atLeastOneSelected:oneVisibleSelected});
        }
    }

    refreshSelected(){
        if(!this.table) return;
        this.table.api.deselectAll();
        this.table.api.forEachNode(rowNode => {
            if(rowNode.data && this.props.availTabPageSelection.selected.filter(sel => (sel.id === rowNode.data.id)).length > 0){
                rowNode.setSelected(true);
            }
        });
    }

    onSelectionChangedProcess(){
        registeredOnSelect = false;
        if(!this.table) return;

        if(this.props.hidden) return;

        let selected = this.table.api.getSelectedRows().slice(0);

        if(this.table.api.getDisplayedRowCount() > 0){
            this.props.availTabPageSelection.selected.map(sel => {
                if(selected.filter(rec => (sel.id === rec.id)).length === 0 && this.table.api.getRowNode(sel.id) === null) {
                    selected.push(sel);
                }
            });
        } else {
            if(this.props.availTabPageSelection.selected && this.props.availTabPageSelection.selected.length > 0) {
                selected = selected.concat(this.props.availTabPageSelection.selected);
            }
        }
        this.props.resultPageSelect({selected: selected, selectAll: this.areAllVisibleSelected()});
    }

    isOneVisibleSelected(){
        let first = this.table.api.getFirstDisplayedRow();
        let last = this.table.api.getLastDisplayedRow();

        for (let i = first; i < last + 1; i++) {
            let node = this.table.api.getDisplayedRowAtIndex(i);
            if(node.isSelected()) {
                return true;
            }
        }

        return false;
    }

    areAllVisibleSelected(){
        let first = this.table.api.getFirstDisplayedRow();
        let last = this.table.api.getLastDisplayedRow();

        for (let i = first; i < last + 1; i++) {
            let node = this.table.api.getDisplayedRowAtIndex(i);
            if(!node.isSelected()) {
               return false;
            }
        }

        return true;
    }

    editAvail(newAvail) {
        let copiedAvails = this.props.availTabPage.avails.slice();
        let avail = copiedAvails.find(b => b.id === newAvail.id);
        if (avail) {
            for(let availField in newAvail) avail[availField] = newAvail[availField];
        }
        return copiedAvails;
    }

    onEdit(avail) {
        this.table.api.getRowNode(avail.id).setData(avail);
        this.table.api.redrawRows([this.table.api.getRowNode(avail.id)]);
        this.props.resultPageUpdate({
            pages: this.props.availTabPage.pages,
            avails: this.editAvail(avail),
            pageSize: this.props.availTabPage.pageSize,
            total: this.props.availTabPage.total
        });
    }

    doSearch(page, pageSize, sortedParams) {
        return availServiceManager.doSearch(page, pageSize, sortedParams);
    }

    getRows(params){
        if(this.table && this.table.api.getDisplayedRowCount() === 0){
            this.table.api.showLoadingOverlay();
        }
        this.doSearch(Math.floor(params.startRow/this.state.pageSize), this.state.pageSize, this.props.availTabPageSort)
                   .then(response => {
                       //console.log(response);
                        if(response && response.data.total > 0){
                            this.addLoadedItems(response.data);
                            // if on or after the last page, work out the last row.
                            let lastRow = -1;
                            if ((response.data.page + 1) * response.data.size >= response.data.total) {
                                lastRow = response.data.total;
                            }

                            if(this.table){
                                params.successCallback(response.data.data, lastRow);
                                if(this.props.availTabPageSelection.selected.length > 0){
                                    this.table.api.forEachNode(rowNode => {
                                        if(rowNode.data && this.props.availTabPageSelection.selected.filter(sel => (sel.id === rowNode.data.id)).length > 0){
                                            rowNode.setSelected(true);
                                        }
                                    });
                                }

                                this.table.api.hideOverlay();
                                this.onSelectionChanged();
                            }
                        }else{
                            if(this.table){
                                this.table.api.showNoRowsOverlay();
                            }
                        }
                   }).catch((error) => {
                       console.error('Unexpected error');
                       console.error(error);
                       params.failCallback();
                   });
    }

    staticDataLoaded(e){
        e.api.selectAll();
    }

    addLoadedItems(data) {
        let items = data.data;
        if (items.length > 0) {
            this.props.resultPageUpdate({
                pages: this.props.availTabPage.pages + 1,
                avails: this.props.availTabPage.avails.concat(items),
                pageSize: this.props.availTabPage.pageSize + items.length,
                total: data.total
            });
        }
    }

    onColumnReordered(e) {
        let cols = [];
        e.columnApi.getAllGridColumns().map(column => {
            if(column.colDef.headerName !== '') cols.push(column.colDef.field);
        });
        this.props.resultPageUpdateColumnsOrder(cols);
    }

    onColumnResized(e) {
        if(e.finished){
            this.props.columnsSize[e.column.colDef.field] = e.column.actualWidth;
        }
    }

    setTable = element => {
        this.table = element;
        if(this.table){
            element.api.showLoadingOverlay();
        }
    };

    refreshColumns(){
        let newCols=[];
        newCols.push({
            headerName: '',
            checkboxSelection: true,
            width: 40,
            pinned: 'left',
            suppressResize: true,
            suppressSizeToFit: true,
            suppressMovable: true,
            lockPosition: true,
            headerComponentFramework: CheckBoxHeader
        });
        if (this.props.columnsOrder) {
            this.props.columnsOrder.map(acc => {
                if(colDef.hasOwnProperty(acc)){
                    newCols.push(colDef[acc]);
                }
            });
            this.cols = newCols;
        }
    }

    loadingRenderer(params){
        let error = null;
        if(params.data && params.data.validationErrors){
            params.data.validationErrors.forEach( e => {
                if(e.fieldName === params.colDef.field){
                    error = e.message;
                    if(e.sourceDetails){
                        if(e.sourceDetails.originalValue) error += ' \'' + e.sourceDetails.originalValue + '\'';
                        if(e.sourceDetails.fileName){
                            error += ', in file ' + e.sourceDetails.fileName
                                   + ', row number ' + e.sourceDetails.rowId
                                   + ', column ' + e.sourceDetails.originalFieldName;
                        }
                    }

                }
                return error;
            });
        }

        const content = error || params.valueFormatted || params.value;
        if (params.value !== undefined) {
            if (content) {
                return(
                    <Link to={{ pathname: '/avails/' + params.data.id }}>
                        <div
                        title= {error}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', color: error ? '#a94442' : null}}>
                            {content}
                        </div>
                    </Link>
                );
            }
            else return params.value;
        } else {
            return <img src={LoadingGif}/>;
        }
    }

     cellStyle(params) {
        let error = null;
        if(params.data && params.data.validationErrors){
            params.data.validationErrors.forEach( e => {
             if(e.fieldName === params.colDef.field){
                 error = e;
             }
            });
        }
        if (params.colDef.headerName !== '' && error) {
            return {backgroundColor: '#f2dede'};
        } else {
            return null;
        }
    }

    render() {
        let rowsProps = {};
        if(!this.props.fromServer) {
            rowsProps = {
                rowData: this.state.originalData,
                onFirstDataRendered: this.staticDataLoaded
            };
        } else {
            rowsProps = {
                rowBuffer: '0',
                rowModelType: 'infinite',
                paginationPageSize: this.state.pageSize,
                infiniteInitialRowCount: '0',
                cacheOverflowSize: '2',
                maxConcurrentDatasourceRequests: '1',
                datasource: this.dataSource,
                enableServerSideSorting: true,
                onSortChanged: this.onSortChanged
            };
        }

        return(
            <div>
                <div
                    className = {'ag-theme-balham ' + (this.props.hidden ? 'd-none' : '')}
                    style={{
                        height: this.state.height,
                        width: '100%'
                    }}
                >
                    <AgGridReact
                        ref={this.setTable}
                        {...rowsProps}

                        getRowNodeId={data => data.id}

                        defaultColDef={this.state.defaultColDef}
                        columnDefs={this.cols}
                        suppressDragLeaveHidesColumns={true}
                        enableColResize={true}
                        onDragStopped={this.onColumnReordered}
                        onColumnResized={this.onColumnResized}

                        enableSorting={true}
                        onBodyScroll={this.onScroll}

                        rowSelection="multiple"
                        onSelectionChanged={this.onSelectionChanged}
                        suppressRowClickSelection={true}

                        headerHeight='52'
                        rowHeight='48'
                    >
                    </AgGridReact>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailsResultTable);

import {Component} from 'react';

mapStateToProps = state => {
    return {
        availTabPageSelection: state.dashboard.session.availTabPageSelection
    };
};

class CheckBoxHeaderInternal extends Component {
    static propTypes = {
        availTabPageSelection: t.object,
        api: t.object,
    };

    constructor(props) {
        super(props);
        this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
    }

    onCheckBoxClick(){
        let first = this.props.api.getFirstDisplayedRow();
        let last = this.props.api.getLastDisplayedRow();

        if(!this.props.availTabPageSelection.selectAll) {
            for (let i = first; i < last + 1; i++) {
                let node = this.props.api.getDisplayedRowAtIndex(i);
                if(!node.isSelected()) {
                    node.setSelected(true);
                }
            }
        }
        else {
            for (let i = first; i < last + 1; i++) {
                let node = this.props.api.getDisplayedRowAtIndex(i);
                if (node.isSelected()) {
                    node.setSelected(false);
                }
            }
        }
    }

    render() {
        let allVisibleSelected = this.props.availTabPageSelection.selectAll;
        let atLeastOneVisibleSelected = false;
        let first = this.props.api.getFirstDisplayedRow();
        let last = this.props.api.getLastDisplayedRow();

        for (let i = first; !atLeastOneVisibleSelected && i < last + 1; i++) {
            let node = this.props.api.getDisplayedRowAtIndex(i);
            if(node.isSelected()) {
                atLeastOneVisibleSelected = true;
            }
        }

        return (
            <span className="ag-selection-checkbox" onClick = {this.onCheckBoxClick}>
                <span className={`ag-icon ag-icon-checkbox-checked ${atLeastOneVisibleSelected && allVisibleSelected ? '' : 'ag-hidden'}`}> </span>
                <span className={`ag-icon ag-icon-checkbox-unchecked ${!atLeastOneVisibleSelected ? '' : 'ag-hidden'}`}> </span>
                <span className={`ag-icon ag-icon-checkbox-indeterminate ${atLeastOneVisibleSelected && !allVisibleSelected ? '' : 'ag-hidden'}`}> </span>
            </span>
        );
    }
}

let CheckBoxHeader = connect(mapStateToProps, null)(CheckBoxHeaderInternal);