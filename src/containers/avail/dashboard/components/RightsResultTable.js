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
import {manualRightsResultPageSelect, manualRightsResultPageUpdate, manualRightsResultPageLoading, manualRightsResultPageSort, updateManualRightsEntryColumns} from '../../../../stores/actions/avail/manualRightEntry';
import {rightServiceManager} from '../../service/RightServiceManager';
import {getDeepValue, equalOrIncluded} from '../../../../util/Common';

const colDef = [];
let registeredOnSelect= false;

const errorCellColor = '#f2dede';
const readyNewCellColor = '#D3D3D3';
const readyCellColor = '#a3a3a3';
const selectedColor = '#808080';
const defaultCellColor= '#ededed';

export const defaultMode = 'defaultMode';
export const selectRightMode = 'selectRightMode';

let mapStateToProps = state => {
    return {
        tabPage: state.manualRightsEntry.tabPage,
        tabPageSort: state.manualRightsEntry.session.tabPageSort,
        tabPageSelection: state.manualRightsEntry.session.tabPageSelection,
        tabPageLoading: state.manualRightsEntry.tabPageLoading,
        availsMapping: state.root.availsMapping,
        columnsOrder: state.manualRightsEntry.session.columns,
        columnsSize: state.manualRightsEntry.session.columnsSize,
        showSelectedAvails: state.dashboard.showSelectedAvails,
    };
};

let mapDispatchToProps = {
    manualRightsResultPageUpdate,
    manualRightsResultPageSort,
    manualRightsResultPageSelect,
    manualRightsResultPageLoading,
    updateManualRightsEntryColumns
};

class RightsResultTable extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        tabPage: t.object,
        tabPageSort: t.array,
        tabPageSelection: t.object,
        tabPageLoading: t.bool,
        manualRightsResultPageUpdate: t.func,
        manualRightsResultPageSort: t.func,
        manualRightsResultPageSelect: t.func,
        manualRightsResultPageLoading: t.func,
        columnsOrder: t.array,
        columns:t.array,
        columnsSize: t.object,
        updateManualRightsEntryColumns: t.func,
        showSelectedAvails: t.bool,
        fromServer: t.bool,
        hidden: t.bool,
        nav: t.object,
        autoRefresh: t.number,
        mode: t.string,
        selectedTab: t.string,
        searchCriteria: t.object,
        onTableLoaded: t.func,
    };

    static defaultProps = {
        autoload: true,
        autoRefresh: 0,
        mode: defaultMode,
        searchCriteria: {}
    };

    table = null;

    constructor(props) {
        super(props);
        this.state = {
            originalData: this.props.tabPageSelection.selected.slice(0),
            pageSize: config.get('avails.page.size'),
            cols:[],
            defaultColDef: {
                sortable: true,
                resizable: true,
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
        console.log('componentDidMount')
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
        this.table.api.setDatasource(this.dataSource);
        this.props.onTableLoaded(this.table);
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

        const isLoading = this.props.tabPageLoading !== prevProps.tabPageLoading && this.props.tabPageLoading === true;
        const isNewTab = prevProps.selectedTab !== this.props.selectedTab;
        const shouldRefetch = this.props.fromServer && this.table != null && this.props.hidden !== true && ( isLoading || isNewTab);
        if(shouldRefetch) {
            this.table.api.setDatasource(this.dataSource);
        }

        if(prevProps.tabPageSelection !== this.props.tabPageSelection){
            if(this.props.fromServer){
                if(this.props.showSelectedAvails){
                    this.refreshSelected();
                }
            }else{
                if(!this.props.showSelectedAvails) {
                    this.setState({originalData: this.props.tabPageSelection.selected.slice(0)});
                    setTimeout(() => {this.refreshSelected();}, 1);
                }
            }
        }

        //when we go out of 'See selected avails'
        if(prevProps.showSelectedAvails !== this.props.showSelectedAvails && this.props.showSelectedAvails === false && !this.props.fromServer){
            this.setState({originalData: this.props.tabPageSelection.selected.slice(0)});
            setTimeout(() => {this.table.api.selectAll();}, 1);
        }
        if(prevProps.hidden !== this.props.hidden && !this.props.hidden){
            this.updateWindowDimensions();
            this.refreshSelected();
            this.table.api.redrawRows();
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
                    if((params.data && params.data[column.javaVariableName]) && moment(params.data[column.javaVariableName].toString().substr(0, 10)).isValid()) {
                        return moment(params.data[column.javaVariableName].toString().substr(0, 10)).format('L');
                    }
                    else return undefined;
                };
                case 'string' : if(column.javaVariableName === 'castCrew') return function(params){
                    if(params.data && params.data[column.javaVariableName]){
                        let data = params.data[column.javaVariableName];
                        data = data.map(({personType, displayName}) => personType + ': ' + displayName).join('; ');
                        return data;
                    } else return undefined;
                }; else return null;
                case 'territoryType' : return function(params){
                    if(params.data && params.data[column.javaVariableName]) {
                        let cellValue = params.data[column.javaVariableName].map(e => String(e.country)).join(', ');
                        return cellValue ? cellValue : undefined;
                    }
                    else return undefined;
                };
                default: return null;
            }
        };
        if(this.props.availsMapping){
            this.props.availsMapping.mappings.filter(({dataType}) => dataType).map(column => colDef[column.javaVariableName] = {
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
        this.props.tabPageSort.map(sortCriteria=>{
            sortModel.push({colId:this.props.availsMapping.mappings.find(({queryParamName}) => queryParamName === sortCriteria.id).javaVariableName, sort:sortCriteria.desc ? 'desc' : 'asc'});
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
                newSort.push({id : this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === criteria.colId).queryParamName , desc: criteria.sort === 'desc'});
            });
        }
        this.props.manualRightsResultPageSort(newSort);
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
        if(allVisibleSelected !== this.props.tabPageSelection.selectAll || oneVisibleSelected === this.props.tabPageSelection.selectNone) {
            this.props.manualRightsResultPageSelect({selected: this.props.tabPageSelection.selected, selectAll: allVisibleSelected, selectNone: !oneVisibleSelected});
        }
    }

    refreshSelected(){
        if(!this.table) return;
        this.table.api.deselectAll();
        this.table.api.forEachNode(rowNode => {
            if(rowNode.data && this.props.tabPageSelection.selected.filter(sel => (sel.id === rowNode.data.id)).length > 0){
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
            this.props.tabPageSelection.selected.map(sel => {
                if(selected.filter(rec => (sel.id === rec.id)).length === 0 && this.table.api.getRowNode(sel.id) === null) {
                    selected.push(sel);
                }
            });
        } else {
            if(this.props.tabPageSelection.selected && this.props.tabPageSelection.selected.length > 0)
                selected = selected.concat(this.props.tabPageSelection.selected);
        }

        let nodesToUpdate = selected
            .filter(x => !this.props.tabPageSelection.selected.includes(x))
            .concat(this.props.tabPageSelection.selected.filter(x => !selected.includes(x)))
            .map(i => this.table.api.getRowNode(i.id));

        this.table.api.redrawRows({rowNodes: nodesToUpdate});

        this.props.manualRightsResultPageSelect({selected: selected, selectNone: !this.isOneVisibleSelected(), selectAll: this.areAllVisibleSelected()});
    }

    isOneVisibleSelected(){
        const visibleRange = this.table.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset = 0.7 + (this.table.api.headerRootComp.gridPanel.scrollVisibleService.horizontalScrollShowing ? 0.4 : 0);
        const visibleNodes = this.table.api.getRenderedNodes().filter(({rowTop, rowHeight}) => (rowTop + rowHeight * topOffset > visibleRange.top) && (rowTop + rowHeight * bottomOffset < visibleRange.bottom));
        const selectedNodes = visibleNodes.filter(({selected}) => selected);
        return selectedNodes.length > 0;
    }

    areAllVisibleSelected(){
        const visibleRange = this.table.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset = 0.7 + (this.table.api.headerRootComp.gridPanel.scrollVisibleService.horizontalScrollShowing ? 0.4 : 0);
        const visibleNodes = this.table.api.getRenderedNodes().filter(({rowTop, rowHeight}) => (rowTop + rowHeight * topOffset > visibleRange.top) && (rowTop + rowHeight * bottomOffset < visibleRange.bottom));
        const selectedNodes = visibleNodes.filter(({selected}) => selected);

        return visibleNodes.length === selectedNodes.length;
    }

    editAvail(newAvail) {
        let copiedAvails = this.props.tabPage.avails.slice();
        let avail = copiedAvails.find(b => b.id === newAvail.id);
        if (avail) {
            for(let availField in newAvail) avail[availField] = newAvail[availField];
        }
        return copiedAvails;
    }

    onEdit(avail) {
        this.table.api.getRowNode(avail.id).setData(avail);
        this.table.api.redrawRows({rowNodes: [this.table.api.getRowNode(avail.id)]});
        this.props.manualRightsResultPageUpdate({
            pages: this.props.tabPage.pages,
            avails: this.editAvail(avail),
            pageSize: this.props.tabPage.pageSize,
            total: this.props.tabPage.total
        });
    }

    reload(){
        if(this.props.fromServer && this.table != null && this.props.autoRefresh) {
            this.table.api.setDatasource(this.dataSource);
        }
    }

    doSearch(page, pageSize, sortedParams) {
        return rightServiceManager.callPlanningSearch(this.props.searchCriteria, page, pageSize, sortedParams);
    }

    getRows(params){
        if(this.table && this.table.api.getDisplayedRowCount() === 0 && !this.props.autoRefresh){
            this.table.api.showLoadingOverlay();
        }
        this.doSearch(Math.floor(params.startRow/this.state.pageSize), this.state.pageSize, this.props.tabPageSort)
                   .then(response => {
                        if(response && response.data.total > 0){
                            this.addLoadedItems(response.data);
                            // if on or after the last page, work out the last row.
                            let lastRow = -1;
                            if ((response.data.page + 1) * response.data.size >= response.data.total) {
                                lastRow = response.data.total;
                            }

                            if(this.table){
                                params.successCallback(response.data.data, lastRow);
                                if(this.props.tabPageSelection.selected.length > 0){
                                    this.table.api.forEachNode(rowNode => {
                                        if(rowNode.data && this.props.tabPageSelection.selected.filter(sel => (sel.id === rowNode.data.id)).length > 0){
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
            this.props.manualRightsResultPageUpdate({
                pages: this.props.tabPage.pages + 1,
                avails: this.props.tabPage.avails.concat(items),
                pageSize: this.props.tabPage.pageSize + items.length,
                total: data.total
            });
        }
    }

    onColumnReordered(e) {
        let cols = [];
        e.columnApi.getAllGridColumns().map(column => {
            if(column.colDef.headerName !== '') cols.push(column.colDef.field);
        });
        this.props.updateManualRightsEntryColumns(cols);
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
            resizable: false,
            suppressSizeToFit: true,
            suppressMovable: true,
            lockPosition: true,
            headerComponentFramework: CheckBoxHeader
        });
        let cols = this.props.columns || this.props.columnsOrder;
        if(!cols){
            cols = this.props.availsMapping.mappings.filter(({dataType}) => dataType).map(({javaVariableName}) => javaVariableName);
            this.props.updateManualRightsEntryColumns(cols);
        }
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
                if(equalOrIncluded(params.colDef.field, e.fieldName)){
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

    cellStyle = (params) => {
        let error = null;
        if(params.data && params.data.validationErrors){
            params.data.validationErrors.forEach( e => {
             if(equalOrIncluded(params.colDef.field, e.fieldName)){
                 error = e;
             }
            });
        }

        if (params.colDef.headerName !== '' && error) {
            return {backgroundColor: errorCellColor};
        } else if(this.props.mode === selectRightMode) {
            if(params.node.selected === true) {
                return {backgroundColor: selectedColor};
            } else if(params.data && params.data.status === 'ReadyNew') {
                return {backgroundColor: readyNewCellColor};
            } else if(params.data && params.data.status === 'Ready') {
                return {backgroundColor: readyCellColor};
            } else {
                return {backgroundColor: defaultCellColor};
            }
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
                        onDragStopped = {this.onColumnReordered}
                        onColumnResized = {this.onColumnResized}

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
        tabPageSelection: state.manualRightsEntry.session.tabPageSelection
    };
};

class CheckBoxHeaderInternal extends Component {
    static propTypes = {
        tabPageSelection: t.object,
        api: t.object,
    };

    constructor(props) {
        super(props);
        this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
    }


    onCheckBoxClick(){
        const visibleRange = this.props.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset = 0.7 + (this.props.api.headerRootComp.gridPanel.scrollVisibleService.horizontalScrollShowing ? 0.4 : 0);
        const visibleNodes = this.props.api.getRenderedNodes().filter(({rowTop, rowHeight}) => (rowTop + rowHeight * topOffset > visibleRange.top) && (rowTop + rowHeight * bottomOffset < visibleRange.bottom));

        if(!this.props.tabPageSelection.selectAll) {
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
        const allVisibleSelected = this.props.tabPageSelection.selectAll;
        const atLeastOneVisibleSelected = !this.props.tabPageSelection.selectNone;

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
