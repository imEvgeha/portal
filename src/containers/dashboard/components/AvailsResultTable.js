import React from 'react';
import ReactDOM from 'react-dom';
import t from 'prop-types';

import config from 'react-global-configuration';

import './AvailResultTable.scss';

// image import
import LoadingGif from '../../../img/loading.gif';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css';

import connect from 'react-redux/es/connect/connect';
import {resultPageUpdate, resultPageSort, resultPageSelect, resultPageLoading, resultPageUpdateColumnsOrder} from '../../../actions/dashboard';
import {dashboardService} from '../DashboardService';
import {advancedSearchHelper} from '../AdvancedSearchHelper';
//import {availDetailsModal} from './AvailDetailsModal';


const colDef = [];

/**
 * Advance Search -
 * title, studio Vod Start Date, Vod End Date
 */
const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        availTabPageSort: state.dashboard.availTabPageSort,
        searchCriteria: state.dashboard.searchCriteria,
        useAdvancedSearch: state.dashboard.useAdvancedSearch,
        freeTextSearch: state.dashboard.freeTextSearch,
        availTabPageSelection: state.session.availTabPageSelection,
        availTabPageLoading: state.dashboard.availTabPageLoading,
        availsMapping: state.root.availsMapping,
        columnsOrder: state.dashboard.columns
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

//        this.onSelection = this.onSelection.bind(this);
//        this.onEdit = this.onEdit.bind(this);
//        this.editAvail = this.editAvail.bind(this);
//        this.onCellClick = this.onCellClick.bind(this);
        this.refreshColumns = this.refreshColumns.bind(this);
        this.getRows = this.getRows.bind(this);
        this.addLoadedItems = this.addLoadedItems.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.parseColumnsSchema = this.parseColumnsSchema.bind(this);
        this.onColumnReordered = this.onColumnReordered.bind(this);
        this.onSortChanged = this.onSortChanged.bind(this);

        if(colDef.length==0){
            this.parseColumnsSchema();
        }
    }

    componentDidMount() {
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
    }

    parseColumnsSchema() {
        if(this.props.availsMapping){
            this.props.availsMapping.mappings.map(column => colDef[column.javaVariableName] = {field:column.javaVariableName, headerName:column.displayName, cellRenderer: 'loadingRenderer'});
        }
    }

    onSortChanged(e) {
        let sortParams = e.api.getSortModel();
        let newSort = [];
        if(sortParams.length>0){
            sortParams.map(criteria =>{
                newSort.push({id : e.columnApi.getColumn(criteria.colId).colDef.field, desc: criteria.sort=='desc'})
            })
        }
        this.props.resultPageSort(newSort);
        this.resetLoadedItems();
        this.refreshColumns();
    }

//    onSelection(selected, selectAll) {
//        this.props.resultPageSelect({selected, selectAll});
//    }
//
//    editAvail(newAvail) {
//        let copiedAvails = this.props.availTabPage.avails.slice();
//        let avail = copiedAvails.find(b => b.id === newAvail.id);
//        if (avail) {
//            for(let availField in newAvail) avail[availField] = newAvail[availField];
//        }
//        return copiedAvails;
//    }

//    onCellClick(row) {
//        availDetailsModal.open(row, () => {
//        }, () => {
//        }, {onEdit: this.onEdit, availsMapping: this.props.availsMapping});
//    }
//
//    onEdit(editable, availDetailModal) {
//        let updatedAvail = {...availDetailModal.state.avail, [editable.props.title]: editable.value};
//        dashboardService.updateAvails(updatedAvail)
//            .then(res => {
//                let editedAvail = res.data;
//                availDetailModal.setState({
//                    avail: editedAvail,
//                    errorMessage: ''
//                });
//                this.props.resultPageUpdate({
//                    pages: this.props.availTabPage.pages,
//                    avails: this.editAvail(editedAvail),
//                    pageSize: this.props.availTabPage.pageSize,
//                    total: this.props.availTabPage.total
//                });
//            })
//            .catch(() => {
//                editable.setState({availLastEditSucceed: false});
//                availDetailModal.setState({vailsMapping: t.any,
//                    errorMessage: 'Avail edit failed'
//                });
//                editable.value = availDetailModal.state.avail[editable.props.title];
//                editable.newValue = availDetailModal.state.avail[editable.props.title];
//            });
//    }

    doSearch(page, pageSize, sortedParams) {
        if (this.props.useAdvancedSearch) {
            return dashboardService.advancedSearch(advancedSearchHelper.prepareAdvancedSearchCall(this.props.searchCriteria), page, pageSize, sortedParams);
        } else {
            return dashboardService.freeTextSearch(this.props.freeTextSearch, page, pageSize, sortedParams);
        }
    }

    getRows(params){
        console.log('getRows', params,  this.props.availTabPageSort);
        this.doSearch(Math.floor(params.startRow/this.state.pageSize), this.state.pageSize, this.props.availTabPageSort)
                   .then(response => {
                        //console.log(response);
                        this.addLoadedItems(response.data);
                        // if on or after the last page, work out the last row.
                        var lastRow = -1;
                        if (response.data.total <= params.endRow) {
                            lastRow = response.data.data.length;
                        }
                        params.successCallback(response.data.data, lastRow)
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
        let cols = []
        e.columnApi.getAllGridColumns().map(column => cols.push(column.colDef.field));
        this.props.resultPageUpdateColumnsOrder(cols);
    }

    setTable = element => {
      this.table = element;
    };

    refreshColumns(){
        let newCols=[]
        if (this.props.columnsOrder) {
            this.props.columnsOrder.map(acc => {
                if(colDef.hasOwnProperty(acc)){
                    newCols.push(JSON.parse(JSON.stringify(colDef[acc])));
                }
            });
            newCols[0].checkboxSelection  = true;
            this.setState({cols: newCols})
        };
    }

    render() {
        let dataSource = {
            rowCount: null, // behave as infinite scroll
            getRows: this.getRows
        }
        let components = {
            loadingRenderer: function(params) {
                if (params.value !== undefined) {
                    return params.value;
                } else {
                    return `<img src=${LoadingGif}>`;
                }
            }
        }

        if(this.table){
            this.table.api.setColumnDefs(this.state.cols); //forces refresh of columns
            this.table.columnApi.moveColumns(this.props.columnsOrder, 0);

            let sortModel=[]
            this.props.availTabPageSort.map(sortCriteria=>{
                sortModel.push({colId:sortCriteria.id, sort:sortCriteria.desc ? 'desc' : 'asc'})
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

            if(this.props.availTabPageLoading && this.table.api.getDisplayedRowCount()>0) {
                this.table.api.setDatasource(dataSource);

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

                    components= {components}

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
                    datasource= {dataSource}

                    enableSorting={true}
                    enableServerSideSorting= {true}
                    onSortChanged = {this.onSortChanged}

//                    enableFilter={true}
//                    floatingFilter: true,
//                    debug= {true}
                    rowSelection= "multiple"
                    rowMultiSelectWithClick = {true}

//                    rowDeselection= {true}
                    >
                </AgGridReact>

            </div>
        );

        
//        return (
//            <DragDropTable

//                selection={this.props.availTabPageSelection.selected}
//                selectAll={this.props.availTabPageSelection.selectAll}//
//
//                onSelection={this.onSelection}
//                onCellClick={this.onCellClick}
//            />
//        );
    }


}



export default connect(mapStateToProps, mapDispatchToProps)(AvailsResultTable);