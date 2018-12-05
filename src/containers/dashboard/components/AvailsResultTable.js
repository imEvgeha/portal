import React from 'react';
import ReactDOM from 'react-dom';
import t from 'prop-types';
import moment from 'moment';

import config from 'react-global-configuration';

// image import
import LoadingGif from '../../../img/loading.gif';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './AvailResultTable.scss';

import connect from 'react-redux/es/connect/connect';
import {resultPageUpdate, resultPageSort, resultPageSelect, resultPageLoading, resultPageUpdateColumnsOrder} from '../../../actions/dashboard';
import {dashboardService} from '../DashboardService';
import {advancedSearchHelper} from '../AdvancedSearchHelper';
import {availDetailsModal} from './AvailDetailsModal';


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
        searchCriteria: state.dashboard.session.searchCriteria,
        useAdvancedSearch: state.dashboard.session.useAdvancedSearch,
        freeTextSearch: state.dashboard.freeTextSearch,
        availTabPageSelection: state.dashboard.session.availTabPageSelection,
        availTabPageLoading: state.dashboard.availTabPageLoading,
        availsMapping: state.root.availsMapping,
        columnsOrder: state.dashboard.session.columns
    };
};

const mapDispatchToProps = {
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
        searchCriteria: t.object,
        useAdvancedSearch: t.bool,
        freeTextSearch: t.object,
        availTabPageSelection: t.object,
        availTabPageLoading: t.bool,
        resultPageUpdate: t.func,
        resultPageSort: t.func,
        resultPageSelect: t.func,
        resultPageLoading: t.func,
        columnsOrder: t.array,
        resultPageUpdateColumnsOrder: t.func
    };

    table = null;

    constructor(props) {
        super(props);
        this.state = {
            pageSize: config.get('avails.page.size'),
            cols:[]
        };

        this.loadingRenderer = this.loadingRenderer.bind(this);
        this.refreshColumns = this.refreshColumns.bind(this);
        this.getRows = this.getRows.bind(this);
        this.addLoadedItems = this.addLoadedItems.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.parseColumnsSchema = this.parseColumnsSchema.bind(this);
        this.onColumnReordered = this.onColumnReordered.bind(this);
        this.onSortChanged = this.onSortChanged.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onSelectionChangedProcess = this.onSelectionChangedProcess.bind(this);
        this.onEdit = this.onEdit.bind(this);

        if(colDef.length==0){
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
        this.refreshColumns();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        let offsetTop  = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        this.setState({ height: (window.innerHeight - offsetTop - 10) + 'px' });
    }

    componentDidUpdate(prevProps) {
      if(this.props.columnsOrder != prevProps.columnsOrder) this.refreshColumns();
      if(this.props.availTabPageLoading != prevProps.availTabPageLoading && this.props.availTabPageLoading === true && this.table != null) {
        this.table.api.showLoadingOverlay();
        this.table.api.setDatasource(this.dataSource);
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
                width: 300
            });
        }
    }

    onSortChanged(e) {
        let sortParams = e.api.getSortModel();
        let newSort = [];
        if(sortParams.length>0){
            sortParams.map(criteria =>{
                newSort.push({id : e.columnApi.getColumn(criteria.colId).colDef.field, desc: criteria.sort=='desc'});
            });
        }
        this.props.resultPageSort(newSort);
        this.resetLoadedItems();
        this.refreshColumns();
    }

    onSelectionChanged(e){
        if(!registeredOnSelect){
            registeredOnSelect = true;
            setTimeout(this.onSelectionChangedProcess, 1, e);
        }
    }

    onSelectionChangedProcess(e){
        registeredOnSelect = false;

        let selectedRows = e.api.getSelectedRows();
        let selected=[];
        selectedRows.map(row => {
            selected.push(row.id);
        });
        let loadedRows = e.api.getDisplayedRowCount();
        if(!e.api.isMaxRowFound()){
            loadedRows-=e.api.gridOptionsWrapper.gridOptions.cacheOverflowSize;
        }
        this.props.resultPageSelect({selected: selected, selectAll: selected.length == loadedRows});
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
        this.props.resultPageUpdate({
            pages: this.props.availTabPage.pages,
            avails: this.editAvail(avail),
            pageSize: this.props.availTabPage.pageSize,
            total: this.props.availTabPage.total
        });
    }

    doSearch(page, pageSize, sortedParams) {
        if (this.props.useAdvancedSearch) {
            return dashboardService.advancedSearch(advancedSearchHelper.prepareAdvancedSearchCall(this.props.searchCriteria), page, pageSize, sortedParams);
        } else {
            return dashboardService.freeTextSearch(this.props.freeTextSearch, page, pageSize, sortedParams);
        }
    }

    getRows(params){
        //console.log('getRows', params,  this.props.availTabPageSort);
        this.doSearch(Math.floor(params.startRow/this.state.pageSize), this.state.pageSize, this.props.availTabPageSort)
                   .then(response => {
                        if(response.data.total > 0){
                            //console.log(response);
                            this.addLoadedItems(response.data);
                            // if on or after the last page, work out the last row.
                            let lastRow = -1;
                            if ((response.data.page + 1) * response.data.size >= response.data.total) {
                                lastRow = response.data.total;
                            }
                            params.successCallback(response.data.data, lastRow);

                            if(response.data.page === 0){
                                //clear selected and not present rows

                                let prevSelection = this.props.availTabPageSelection.selected.slice(0);
                                this.table.api.deselectAll();

                                this.table.api.forEachNode(rowNode => {
                                     if(rowNode.data && prevSelection.indexOf(rowNode.data.id) > -1 && !rowNode.isSelected()){
                                        rowNode.setSelected(true);
                                    }
                                });
                                this.table.api.hideOverlay();
                            }
                            this.onSelectionChanged(this.table);
                        }else{
                            this.table.api.showNoRowsOverlay();
                        }
                   }).catch((error) => {
                       console.error('Unexpected error');
                       console.error(error);
                       params.failCallback();
                   });
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

    resetLoadedItems(){
        this.props.resultPageUpdate({
            pages: 0,
            avails: [],
            pageSize: 0,
            total:0
        });
    }

    onColumnReordered(e) {
        let cols = [];
        e.columnApi.getAllGridColumns().map(column => {
            if(column.colDef.headerName!='') cols.push(column.colDef.field);
        });
        this.props.resultPageUpdateColumnsOrder(cols);
    }

    setTable = element => {
        this.table = element;
        if(this.table) element.api.showLoadingOverlay();
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
            headerComponentFramework: CheckBoxHeader
        });
        if (this.props.columnsOrder) {
            this.props.columnsOrder.map(acc => {
                if(colDef.hasOwnProperty(acc)){
                    newCols.push(colDef[acc]);
                }
            });
            this.setState({cols: newCols});
        }
    }

    onCellClicked(row){
        availDetailsModal.open(this.table.api.getRowNode(row.id).data, () => {
                }, () => {
                }, {onEdit: this.onEdit, availsMapping: this.props.availsMapping});
    }

    loadingRenderer(params){
        let content = params.valueFormatted || params.value;
        if (params.value !== undefined) {
            if (content) {
                return(
                    <a href="#" onClick={() => this.onCellClicked(params.data)}>
                        {content}
                    </a>
                );
            }
            else return params.value;
        } else {
            return <img src={LoadingGif}/>;
        }
    }

    render() {

        if(this.table){
            this.table.columnApi.moveColumns(this.props.columnsOrder, 1);

            let sortModel=[];
            this.props.availTabPageSort.map(sortCriteria=>{
                sortModel.push({colId:sortCriteria.id, sort:sortCriteria.desc ? 'desc' : 'asc'});
            });
            let currentSortModel=this.table.api.getSortModel();
            let toChangeSortModel=false;

            if(currentSortModel.length!=sortModel.length) toChangeSortModel=true;

            for(let i=0; i < sortModel.length && !toChangeSortModel; i++){
                if(sortModel[i].colId != currentSortModel[i].colId) toChangeSortModel = true;
                if(sortModel[i].sortCriteria != currentSortModel[i].sortCriteria) toChangeSortModel = true;
            }

            if(toChangeSortModel){
                this.table.api.setSortModel(sortModel);
            }
        }

        return(
            <div
                className="ag-theme-balham"
                style={{
                    height: this.state.height,
                    width: '100%' }}
                    >
                <AgGridReact
                    ref={this.setTable}

                    onGridReady={params => params.api.sizeColumnsToFit()}
                    getRowNodeId= {data => data.id}

                    columnDefs= {this.state.cols}
                    suppressDragLeaveHidesColumns= {true}
                    enableColResize= {true}
                    onDragStopped = {this.onColumnReordered}

                    rowBuffer= '50'
                    rowModelType= 'infinite'
                    paginationPageSize= {this.state.pageSize}
                    infiniteInitialRowCount= '0'
                    cacheOverflowSize= '2'
                    maxConcurrentDatasourceRequests= '1'
                    datasource= {this.dataSource}

                    enableSorting={true}
                    enableServerSideSorting= {true}
                    onSortChanged = {this.onSortChanged}

                    rowSelection= "multiple"
                    onSelectionChanged= {this.onSelectionChanged}
                    suppressRowClickSelection = {true}

                    headerHeight= '52'
                    rowHeight= '48'

                    >
                </AgGridReact>

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
        api: t.object
    };

    constructor(props) {
        super(props);
        this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
    }

    onCheckBoxClick(){
        if(!this.props.availTabPageSelection.selectAll) {
            this.props.api.forEachNode(node=>{
                if(!node.isSelected()) {
                    node.setSelected(true);
                }
            });
        }
        else {
            this.props.api.deselectAll();
        }
    }

    render() {
        let rows = this.props.availTabPageSelection.selected.length;
        let selectAll = this.props.availTabPageSelection.selectAll;
        return (
            <span className="ag-selection-checkbox" onClick = {this.onCheckBoxClick}>
                <span className={`ag-icon ag-icon-checkbox-checked ${selectAll ? '' : 'ag-hidden'}`}></span>
                <span className={`ag-icon ag-icon-checkbox-unchecked ${rows == 0 ? '' : 'ag-hidden'}`}></span>
                <span className={`ag-icon ag-icon-checkbox-indeterminate ${rows > 0 && !selectAll ? '' : 'ag-hidden'}`}></span>
            </span>
        );
    }
}

let CheckBoxHeader = connect(mapStateToProps)(CheckBoxHeaderInternal);