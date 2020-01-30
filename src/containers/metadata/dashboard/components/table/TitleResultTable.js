import React from 'react';
import ReactDOM from 'react-dom';
import t from 'prop-types';

import config from 'react-global-configuration';
// image import
import LoadingGif from '../../../../../img/loading.gif';

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './TitleResultTable.scss';


import connect from 'react-redux/es/connect/connect';
import {
    resultPageLoading,
    resultPageSelect,
    resultPageSort,
    resultPageUpdate,
    resultPageUpdateColumnsOrder
} from '../../../../../stores/actions/metadata/index';
import {titleServiceManager} from '../../../service/TitleServiceManager';
import {Link} from 'react-router-dom';
import {titleMapping} from '../../../service/Profile';
import {titleSearchHelper} from '../../TitleSearchHelper';
import {EPISODE, SEASON, SERIES, toPrettyContentTypeIfExist} from '../../../../../constants/metadata/contentType';
import {titleService} from '../../../service/TitleService';
import {formatNumberTwoDigits} from '../../../../../util/Common';
import uniqBy from 'lodash.uniqby';
import {defineColumn} from '../../../../../ui-elements/nexus-grid/elements/columnDefinitions';
import ActionCellRender from './cell/ActionCellRender';

const colDef = [];
let registeredOnSelect = false;

/**
 * Advance Search -
 * title, studio Vod Start Date, Vod End Date
 */
let mapStateToProps = state => {
    return {
        titleTabPage: state.titleReducer.titleTabPage,
        titleTabPageSort: state.titleReducer.session.titleTabPageSort,
        useAdvancedSearch: state.titleReducer.session.useAdvancedSearch,
        freeTextSearch: state.titleReducer.freeTextSearch,
        titleTabPageSelection: state.titleReducer.session.titleTabPageSelection,
        titleTabPageLoading: state.titleReducer.titleTabPageLoading,
        titleMapping: state.root.titleMapping,
        columnsOrder: state.titleReducer.session.columns,
        columnsSize: state.titleReducer.session.columnsSize
    };
};

let mapDispatchToProps = {
    resultPageUpdate,
    resultPageSort,
    resultPageSelect,
    resultPageLoading,
    resultPageUpdateColumnsOrder
};

class TitleResultTable extends React.Component {
    static propTypes = {
        titleMapping: t.any,
        titleTabPage: t.object,
        titleTabPageSort: t.array,
        useAdvancedSearch: t.bool,
        freeTextSearch: t.object,
        titleTabPageSelection: t.object,
        titleTabPageLoading: t.bool,
        resultPageUpdate: t.func,
        resultPageSort: t.func,
        resultPageSelect: t.func,
        resultPageLoading: t.func,
        columnsOrder: t.array,
        columnsSize: t.object,
        resultPageUpdateColumnsOrder: t.func
    };

    table = null;

    constructor(props) {
        super(props);
        this.state = {
            pageSize: config.get('title.page.size'),
            cols: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
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
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onSelectionChangedProcess = this.onSelectionChangedProcess.bind(this);
        this.onEdit = this.onEdit.bind(this);

        if (colDef.length == 0) {
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
        let elem = document.querySelector('.vu-advanced-search-panel');
        elem.removeEventListener('transitionend', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        let offsetTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        this.setState({ height: (window.innerHeight - offsetTop - 40) + 'px' });
    }

    componentDidUpdate(prevProps) {
        if (this.props.columnsOrder != prevProps.columnsOrder) {
            this.refreshColumns();
            for (let i = 0; i < Math.min(this.props.columnsOrder.length, prevProps.columnsOrder.length); i++) {
                this.table.columnApi.moveColumn(this.props.columnsOrder[i], i + 1);
            }

            this.setState({});
        }

        if (this.props.titleTabPageSort != prevProps.titleTabPageSort) {
            let sortModel = [];
            this.props.titleTabPageSort.map(sortCriteria => {
                sortModel.push({ colId: sortCriteria.id, sort: sortCriteria.desc ? 'desc' : 'asc' });
            });

            let currentSortModel = this.table.api.getSortModel();
            let toChangeSortModel = false;

            if (currentSortModel.length != sortModel.length) toChangeSortModel = true;

            for (let i = 0; i < sortModel.length && !toChangeSortModel; i++) {
                if (sortModel[i].colId != currentSortModel[i].colId) toChangeSortModel = true;
                if (sortModel[i].sortCriteria != currentSortModel[i].sortCriteria) toChangeSortModel = true;
            }

            if (toChangeSortModel) {
                this.table.api.setSortModel(sortModel);
            }

        }

        if (this.props.titleTabPageLoading != prevProps.titleTabPageLoading && this.props.titleTabPageLoading === true && this.table != null) {
            this.table.api.setDatasource(this.dataSource);
        }
    }

    parseColumnsSchema() {
        if (titleMapping) {
            titleMapping.mappings.map(column => colDef[column.javaVariableName] = {
                headerName: column.displayName,
                filter: 'agTextColumnFilter',
                filterParams: {
                    filterOptions: ['contains', 'notContains']
                },
                field: column.javaVariableName,
                cellRendererFramework: this.loadingRenderer,
                width: 623
            });
        }
    }

    onSortChanged(e) {
        let sortParams = e.api.getSortModel();
        let newSort = [];
        if (sortParams.length > 0) {
            sortParams.map(criteria => {
                newSort.push({ id: e.columnApi.getColumn(criteria.colId).colDef.field, desc: criteria.sort == 'desc' });
            });
        }
        this.props.resultPageSort(newSort);
    }

    onSelectionChanged(e) {
        if (!registeredOnSelect) {
            registeredOnSelect = true;
            setTimeout(this.onSelectionChangedProcess, 1, e);
        }
    }

    onSelectionChangedProcess(e) {
        registeredOnSelect = false;

        let selectedRows = e.api.getSelectedRows();
        let selected = [];
        selectedRows.map(row => {
            selected.push(row.id);
        });

        if (e.api.getDisplayedRowCount() > 0) {
            this.props.titleTabPageSelection.selected.map(id => {
                if (selected.indexOf(id) === -1 && e.api.getRowNode(id) === null) selected.push(id);
            });
        } else {
            if (this.props.titleTabPageSelection.selection && this.props.titleTabPageSelection.selection.length > 0)
                selected = selected.concat(this.props.titleTabPageSelection.selection);
        }

        let allLoadedSelected = true;

        e.api.forEachNode(node => {
            if (!node.isSelected()) allLoadedSelected = false;
        });
        this.props.resultPageSelect({ selected: selected, selectAll: allLoadedSelected });
    }

    editTitle(newTitle) {
        let copiedTitle = this.props.titleTabPage.titles.slice();
        let title = copiedTitle.find(b => b.id === newTitle.id);
        if (title) {
            for (let titleField in newTitle) title[titleField] = newTitle[titleField];
        }
        return copiedTitle;
    }

    onEdit(title) {
        this.table.api.getRowNode(title.id).setData(title);
        this.table.api.redrawRows([this.table.api.getRowNode(title.id)]);
        this.props.resultPageUpdate({
            pages: this.props.titleTabPage.pages,
            titles: this.editTitle(title),
            pageSize: this.props.titleTabPage.pageSize,
            total: this.props.titleTabPage.total
        });
    }

    doSearch(page, pageSize, sortedParams) {
        return titleServiceManager.doSearch(page, pageSize, sortedParams);
    }

    getRows(params) {
        if (this.table && this.table.api.getDisplayedRowCount() == 0) {
            this.table.api.showLoadingOverlay();
        }
        this.doSearch(Math.floor(params.startRow / this.state.pageSize), this.state.pageSize, this.props.titleTabPageSort)
            .then(response => {
                const {data} = response;
                if (data.total > 0) {
                    this.addLoadedItems(data);
                    const ids = this.getParentTitleIds(data.data);
                    if(ids.length > 0) {
                        this.addUpdatedItemToTable(data, ids, params);
                    } else {
                        this.addItemToTable(data, params);
                    }
                } else {
                    this.table.api.showNoRowsOverlay();
                }
            }).catch((error) => {
                console.error('Unexpected error');
                console.error(error);
                params.failCallback();
            });
    }

    addUpdatedItemToTable = (request, ids, params) => {
        const titleRequest = Object.assign({}, request);
        titleService.bulkGetTitles(ids).then(res => {
            const parents = res.data;
            titleRequest.data = titleRequest.data.map(title => {
                if(title.contentType.toUpperCase() === SEASON.apiName) {
                    title.title = this.getFormatTitle(parents, title, SEASON.apiName);
                } else if(title.contentType.toUpperCase() === EPISODE.apiName) {
                    title.title = this.getFormatTitle(parents, title, EPISODE.apiName);
                }
                return title;
            });
            this.addItemToTable(titleRequest, params);
        });
    };

    getFormatTitle = (parents, item, contentType) => {
        const parent = this.getSeriesParent(item, parents);
        const {title: seriesTitle} = parent || {};
        const {episodic, title: episodeTitle} = item || {};
        const {seasonNumber, episodeNumber} = episodic || {};

        switch (contentType) {
            case SEASON.apiName:
                return parent ? `${seriesTitle}: S${formatNumberTwoDigits(seasonNumber)}` : `[SeriesNotFound]: S${formatNumberTwoDigits(seasonNumber)}`;
            case EPISODE.apiName:
                return parent ?
                    `${seriesTitle}: S${formatNumberTwoDigits(seasonNumber)}, E${formatNumberTwoDigits(episodeNumber)}: ${episodeTitle}`
                    : `[SeriesNotFound]: S${formatNumberTwoDigits(seasonNumber)}, E${formatNumberTwoDigits(episodeNumber)}: ${episodeTitle}`;
        }

        return item.title;
    };

    getSeriesParent = (item, parents) => {
        const parentId = this.getSeriesParentId(item);
        if (parentId) {
            return parents.find(t => t.id === parentId);
        }
        return null;
    };

    addItemToTable = (data, params) => {
        // if on or after the last page, work out the last row.
        let lastRow = -1;
        if ((data.page + 1) * data.size >= data.total) {
            lastRow = data.total;
        }
        params.successCallback(data.data, lastRow);

        if (this.props.titleTabPageSelection.selected.length > 0) {
            this.table.api.forEachNode(rowNode => {
                if (rowNode.data && this.props.titleTabPageSelection.selected.indexOf(rowNode.data.id) > -1) {
                    rowNode.setSelected(true);
                }
            });
        }

        this.table.api.hideOverlay();
        this.onSelectionChanged(this.table);
    };

    getParentTitleIds = (items) => {
        const parents = items.filter(item => item.contentType.toUpperCase() === SEASON.apiName || item.contentType.toUpperCase() === EPISODE.apiName && item.parentIds)
            .map(t => {
                const id = this.getSeriesParentId(t);
                if (id) {
                    return {id};
                }
                return {};
            });
        return uniqBy(parents, 'id');
    };

    getSeriesParentId = (title) => {
        const {parentIds} = title;
        if(parentIds) {
            const parent = parentIds.find(el => el.contentType.toUpperCase() === SERIES.apiName);
            if(parent) {
                return parent.id;
            }
        }
        return null;
    };

    addLoadedItems(data) {
        let items = data.data.map(e => e.contentType = toPrettyContentTypeIfExist(e.contentType));

        if (items.length > 0) {
            this.props.resultPageUpdate({
                pages: this.props.titleTabPage.pages + 1,
                titles: this.props.titleTabPage.titles.concat(items),
                pageSize: this.props.titleTabPage.pageSize + items.length,
                total: data.total
            });
        }
    }

    resetLoadedItems() {
        this.props.resultPageUpdate({
            pages: 0,
            titles: [],
            pageSize: 0,
            total: 0
        });
    }

    onColumnReordered(e) {
        let cols = [];
        e.columnApi.getAllGridColumns().map(column => {
            if (column.colDef.headerName !== '' && column.colDef.headerName !== 'Action') cols.push(column.colDef.field);
        });
        this.props.resultPageUpdateColumnsOrder(cols);
    }

    onColumnResized(e) {
        if (e.finished) {
            this.props.columnsSize[e.column.colDef.field] = e.column.actualWidth;
        }
    }

    setTable = element => {
        this.table = element;
        if (this.table) {
            element.api.showLoadingOverlay();
        }
    };

    refreshColumns() {
        let newCols = [];
        if (this.props.columnsOrder) {
            this.props.columnsOrder.map(acc => {
                if (colDef.hasOwnProperty(acc)) {
                    newCols.push(colDef[acc]);
                }
            });
            const actionColumn = defineColumn({
                headerName: 'Action',
                field: 'action',
                cellRendererFramework: ActionCellRender
            });
            this.cols = [actionColumn, ...newCols];
        }
    }

    loadingRenderer = (params) => {
        let error = null;
        if (!params.value && params.data && params.data.validationErrors) {
            params.data.validationErrors.forEach(e => {
                if(params.colDef 
                   && ((e.fieldName === params.colDef.field) 
                   || (e.fieldName === '[start, availStart]' && params.colDef.field === 'start') 
                   || (e.fieldName === '[start, availStart]' && params.colDef.field === 'availStart'))) {
                    error = e.message + ', error processing field ' + e.originalFieldName +
                        ' with value ' + e.originalValue +
                        ' at row ' + e.rowId +
                        ' from file ' + e.fileName;
                    return;
                }
            });
        }

        const content = params.valueFormatted || params.value || error;
        if (params.value !== undefined) {
            if (content) {
                return (
                    <Link to={'metadata/detail/' + params.data.id}>
                        <div
                            title={error}
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden', color: error ? '#a94442' : null }}>
                            {content}
                        </div>
                    </Link>
                );
            }
            else return params.value;
        } else {
            return <img src={LoadingGif} />;
        }
    }

    cellStyle(params) {
        let error = null;
        if (!params.value && params.data && params.data.validationErrors) {
            params.data.validationErrors.forEach(e => {
                if (e.fieldName === params.colDef.field 
                    || (e.fieldName.includes('country') && params.colDef.field === 'territory') 
                    || (e.fieldName.includes('territoryExcluded') && params.colDef.field === 'territoryExcluded')
                    || (e.fieldName === '[start, availStart]' && params.colDef.field === 'start') 
                    || (e.fieldName === '[start, availStart]' && params.colDef.field === 'availStart')) {
                    error = e;
                    return;
                }
            });
        }
        if (params.colDef.headerName !== '' && error) {
            return { backgroundColor: '#f2dede' };
        } else {
            return null;
        }
    }
    handleTitleFreeTextSearch(searchCriteria) {
        titleSearchHelper.freeTextSearch(searchCriteria);
    }

    // handleFilterChanged = (e) => {
    //     const { contentType: { filter } } = e.api.getFilterModel();
    //     const filterObj = {
    //         contentType: filter
    //     };
    //     if(e.api.getFilterModel()) {            
    //         this.handleTitleFreeTextSearch(filterObj);
    //     }
        
    // }
    render() {
        return (
            <div
                className="ag-theme-balham"
                style={{
                    height: this.state.height,
                    width: '100%'
                }}
            >
                <AgGridReact
                    id="titleTable"
                    ref={this.setTable}

                    getRowNodeId={data => data.id}

                    defaultColDef={this.state.defaultColDef}
                    columnDefs={this.cols}
                    suppressDragLeaveHidesColumns={true}
                    onDragStopped={this.onColumnReordered}
                    onColumnResized={this.onColumnResized}

                    rowBuffer='50'
                    rowModelType='infinite'
                    paginationPageSize={this.state.pageSize}
                    infiniteInitialRowCount='0'
                    cacheOverflowSize='2'
                    maxConcurrentDatasourceRequests='1'
                    datasource={this.dataSource}

                    pagination={true}

                    onSortChanged={this.onSortChanged}

                    // enableFilter
                    // onFilterChanged={this.handleFilterChanged}

                    rowSelection="multiple"
                    onSelectionChanged={this.onSelectionChanged}
                    suppressRowClickSelection={true}
                    headerHeight='52'
                    rowHeight='48'

                >
                </AgGridReact>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TitleResultTable);
