import React from 'react';
import ReactDOM from 'react-dom';
import t from 'prop-types';
import moment from 'moment';
import {Link} from 'react-router-dom';

import config from 'react-global-configuration';

// image import
import LoadingGif from '../../../../img/loading.gif';

import RightsURL from '../../util/RightsURL';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './RightsResultTable.scss';

import connect from 'react-redux/es/connect/connect';
import {resultPageUpdate, resultPageSort, resultPageSelect, resultPageLoading, resultPageUpdateColumnsOrder} from '../../../../stores/actions/avail/dashboard';
import {rightServiceManager} from '../../service/RightServiceManager';
import {getDeepValue} from '../../../../util/Common';

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

class RightsResultTable extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        availTabPage: t.object,
        availTabPageSort: t.array,
        availTabPageSelection: t.object,
        availTabPageLoading: t.bool,
        resultPageUpdate: t.func,
        resultPageSort: t.func,
        resultPageSelect: t.func,
        resultPageLoading: t.func,
        columnsOrder: t.array,
        columns:t.array,
        columnsSize: t.object,
        resultPageUpdateColumnsOrder: t.func,
        showSelectedAvails: t.bool,
        fromServer: t.bool,
        hidden: t.bool,
        nav: t.object,
        autoRefresh: t.number
    };

    static defaultProps = {
        autoload: true,
        autoRefresh: 0
    }

    table = null;

    constructor(props) {
        super(props);
        this.state = {
            originalData: this.props.availTabPageSelection.selected.slice(0),
            pageSize: config.get('avails.page.size'),
            cols:[],
            defaultColDef: {
                cellStyle: this.cellStyle
            }
        };

        this.refresh = null;

        this.loadingRenderer = this.loadingRenderer.bind(this);
        this.refreshColumns = this.refreshColumns.bind(this);
        this.getRows = this.getRows.bind(this);
        this.reload = this.reload.bind(this);
        this.addLoadedItems = this.addLoadedItems.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.parseColumnsSchema = this.parseColumnsSchema.bind(this);
        this.onColumnReordered = this.onColumnReordered.bind(this);
        this.onColumnResized = this.onColumnResized.bind(this);
        this.onSortChanged = this.onSortChanged.bind(this);
        this.refreshSelected = this.refreshSelected.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.clearAllSelected = this.clearAllSelected.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onSelectionChangedProcess = this.onSelectionChangedProcess.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.parseColumnsSchema();
    }

    componentDidMount() {
        this.dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: this.getRows
        };

        if(this.props.setClearAllSelected) {
            this.props.setClearAllSelected(this.clearAllSelected);
        }

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        //ugly hack to change height once advanced filter finishes its transition (appearing or dissapearing)
        let elem = document.querySelector('.vu-advanced-search-panel');
        if(elem) {
            elem.addEventListener('transitionend', this.updateWindowDimensions);
        }
        elem = document.querySelector('.vu-free-text-search');
        if(elem) {
            elem.addEventListener('transitionend', this.updateWindowDimensions);
        }
        this.refreshColumns();

        if(this.props.autoRefresh && this.refresh === null){
            this.refresh = setInterval(this.reload, this.props.autoRefresh);
        }
    }

    componentWillUnmount() {
        if(this.refresh !== null){
            clearInterval(this.refresh);
            this.refresh = null;
        }
        window.removeEventListener('resize', this.updateWindowDimensions);
        let elem = document.querySelector('.vu-advanced-search-panel');
        if(elem) {
            elem.removeEventListener('transitionend', this.updateWindowDimensions);
        }
        elem = document.querySelector('.vu-free-text-search');
        if(elem) {
            elem.removeEventListener('transitionend', this.updateWindowDimensions);
        }
    }

    updateWindowDimensions() {
        let offsetTop  = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        this.setState({ height: window.innerHeight - offsetTop - 10});
    }

    componentDidUpdate(prevProps) {
        if(!this.table) return;
        if(this.props.availsMapping !== prevProps.availsMapping){
            this.parseColumnsSchema();
        }
        if(this.props.columns !== prevProps.columns || this.props.columnsOrder !== prevProps.columnsOrder || this.props.availsMapping !== prevProps.availsMapping){
            const cols = this.props.columns || this.props.columnsOrder;
            this.refreshColumns();
            setTimeout(()=>{
                this.table.columnApi.moveColumns(cols, 1);
            },1);
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
                    setTimeout(() => {this.refreshSelected();}, 1);
                }
            }
        }

        //when we go out of 'See selected avails'
        if(prevProps.showSelectedAvails !== this.props.showSelectedAvails && this.props.showSelectedAvails === false && !this.props.fromServer){
            this.setState({originalData: this.props.availTabPageSelection.selected.slice(0)});
            setTimeout(() => {this.table.api.selectAll();}, 1);
        }
        if(prevProps.hidden !== this.props.hidden && !this.props.hidden){
            this.updateWindowDimensions();
            this.refreshSelected();
        }
    }

    parseColumnsSchema() {
        if(colDef.length > 0){
            return;
        }
        let formatter = (column) => {
            switch (column.dataType) {
                case 'localdate' : return function(params){
                    if(params.data && params.data[column.javaVariableName]) return moment(params.data[column.javaVariableName]).format('L') + ' ' + moment(params.data[column.javaVariableName]).format('HH:mm');
                    else return undefined;
                };
                case 'date' : return function(params){
                    if(params.data && params.data[column.javaVariableName]) return moment(params.data[column.javaVariableName].substr(0, 10)).format('L');
                    else return undefined;
                };
                default: return null;
            }
        };
        if(this.props.availsMapping){
            this.props.availsMapping.mappings.map(column => colDef[column.javaVariableName] = {
                field:column.javaVariableName,
                headerName:column.displayName,
                cellRendererFramework: this.loadingRenderer,
                valueFormatter: formatter(column),
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
        const oneVisibleSelected = this.isOneVisibleSelected();
        if(allVisibleSelected !== this.props.availTabPageSelection.selectAll || oneVisibleSelected === this.props.availTabPageSelection.selectNone) {
            this.props.resultPageSelect({selected: this.props.availTabPageSelection.selected, selectAll: allVisibleSelected, selectNone: !oneVisibleSelected});
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

    clearAllSelected(){
        if(this.table){
            this.table.api.deselectAll();
        }
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
            if(this.props.availTabPageSelection.selected && this.props.availTabPageSelection.selected.length > 0)
                selected = selected.concat(this.props.availTabPageSelection.selected);
        }
        this.props.resultPageSelect({selected: selected, selectNone: !this.isOneVisibleSelected(), selectAll: this.areAllVisibleSelected()});
    }

    isOneVisibleSelected(){
        const visibleRange = this.table.api.getVerticalPixelRange();
        const visibleNodes = this.table.api.getRenderedNodes().filter(({rowTop, rowHeight}) => (rowTop + rowHeight > visibleRange.top) && (rowTop < visibleRange.bottom));
        const selectedNodes = visibleNodes.filter(({selected}) => selected);
        return selectedNodes.length > 0;
    }

    areAllVisibleSelected(){
        const visibleRange = this.table.api.getVerticalPixelRange();
        const visibleNodes = this.table.api.getRenderedNodes().filter(({rowTop, rowHeight}) => (rowTop + rowHeight > visibleRange.top) && (rowTop < visibleRange.bottom));
        const selectedNodes = visibleNodes.filter(({selected}) => selected);

        return visibleNodes.length === selectedNodes.length;
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

    reload(){
        if(this.props.fromServer && this.table != null && this.props.autoRefresh) {
            this.table.api.setDatasource(this.dataSource);
        }
    }

    doSearch(page, pageSize, sortedParams) {
        return rightServiceManager.doSearch(page, pageSize, sortedParams);
    }

    getRows(params){
        if(this.table && this.table.api.getDisplayedRowCount() === 0 && !this.props.autoRefresh){
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
        const cols = this.props.columns || this.props.columnsOrder;
        if(cols){
            cols.map(acc => {
                if(colDef.hasOwnProperty(acc)){
                    newCols.push(colDef[acc]);
                }
            });
            this.setState({ cols: newCols});
        }
    }

    loadingRenderer(params){
        let error = null;
        if(params.data && params.data.validationErrors){
            params.data.validationErrors.forEach( e => {
                if(e.fieldName === params.colDef.field){
                    error = e.message;
                    if(e.sourceDetails){
                        if(e.sourceDetails.originalValue) error += ', original value:  \'' + e.sourceDetails.originalValue + '\'';
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

        let val;
        if(params.data) {
            val = getDeepValue(params.data, params.colDef.field);
        }
        if(val && val === Object(val) && !Array.isArray(val)){
            val = JSON.stringify(val);
        }
        if(Array.isArray(val) && val.length > 1){
            val = val.join(', ');
        }
        const content = error || params.valueFormatted || val;
        if (val !== undefined) {
            if (content || content === false) {
                let highlighted = false;
                if(params.data && params.data.highlightedFields) {
                    highlighted = params.data.highlightedFields.indexOf(params.colDef.field) > -1;
                }
                return(
                    <Link to={RightsURL.getRightUrl(params.data.id, this.props.nav)}>
                        <div
                        title= {error}
                        className = {highlighted ? 'font-weight-bold' : ''}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', color: error ? '#a94442' : null}}>
                            {String(content)}
                        </div>
                        {highlighted &&
                            <div
                                style={{position: 'absolute', top: '0px', right: '0px', lineHeight:'1'}}>
                                <span title={'* fields in bold are original values provided by the studios'} style={{color: 'grey'}}><i className="far fa-question-circle"></i></span>
                            </div>
                        }
                    </Link>
                );
            }
            else return val;
        } else {
            if(params.data){
                return '';
            }else {
                return <img src={LoadingGif}/>;
            }
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
                rowBuffer: '0',
                rowData: this.state.originalData,
                onFirstDataRendered: this.staticDataLoaded
            };
        } else {
            rowsProps = {
                rowBuffer: '50',
                rowModelType: 'infinite',
                paginationPageSize: this.state.pageSize,
                infiniteInitialRowCount: '0',
                cacheOverflowSize: '2',
                maxConcurrentDatasourceRequests: '1',
                datasource: this.props.autoload ? this.dataSource : null,
                enableServerSideSorting: true,
                onSortChanged: this.onSortChanged
            };
        }

        return(
            <div>
                <div
                    className = {'ag-theme-balham ' + (this.props.hidden ? 'd-none' : '')}
                    style={{
                        height: this.state.height + 'px',
                        width: '100%'
                    }}
                >
                    <AgGridReact
                        ref={this.setTable}
                        {...rowsProps}

                        getRowNodeId={data => data.id}

                        defaultColDef = {this.state.defaultColDef}
                        columnDefs= {this.state.cols}
                        suppressDragLeaveHidesColumns= {true}
                        enableColResize= {true}
                        onDragStopped = {this.onColumnReordered}
                        onColumnResized = {this.onColumnResized}

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

export default connect(mapStateToProps, mapDispatchToProps)(RightsResultTable);

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
        const visibleRange = this.props.api.getVerticalPixelRange();
        const visibleNodes = this.props.api.getRenderedNodes().filter(({rowTop, rowHeight}) => (rowTop + rowHeight > visibleRange.top) && (rowTop < visibleRange.bottom));

        if(!this.props.availTabPageSelection.selectAll) {
            const notSelectedNodes = visibleNodes.filter(({selected}) => !selected);
            notSelectedNodes.forEach(node => {
                node.setSelected(true);
            });
        }
        else {
            const selectedNodes = visibleNodes.filter(({selected}) => selected);
            selectedNodes.forEach(node => {
                node.setSelected(false);
            });
        }
    }

    render() {
        const allVisibleSelected = this.props.availTabPageSelection.selectAll;
        const atLeastOneVisibleSelected = !this.props.availTabPageSelection.selectNone;

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