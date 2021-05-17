import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import PropTypes from 'prop-types';
import {get, uniqBy} from 'lodash';
import config from 'react-global-configuration';
// image import
import './TitleResultTable.scss';
import LoadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {
    resultPageSelect,
    resultPageSort,
    resultPageUpdate,
    resultPageUpdateColumnsOrder,
} from '../../../../../stores/actions/metadata/index';
import {titleServiceManager} from '../../../service/TitleServiceManager';
import {Link} from 'react-router-dom';
import {titleMapping} from '../../../service/Profile';
import {titleSearchHelper} from '../../TitleSearchHelper';
import {EPISODE, SEASON, SERIES, toPrettyContentTypeIfExist} from '../../../../../constants/metadata/contentType';
import {titleService} from '../../../service/TitleService';
import {formatNumberTwoDigits} from '@vubiquity-nexus/portal-utils/lib/Common';
import {defineColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import ActionCellRender from './cell/ActionCellRenderer';
import {getRepositoryCell} from '../../../../../../avails/utils';
import getContextMenuItems from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/getContextMenuItems';
import {getSortModel} from '@vubiquity-nexus/portal-utils/lib/utils';
import {renderTitleName} from '../utils/utils';

const colDef = [];
let registeredOnSelect = false;

/**
 * Advance Search -
 * title, studio Vod Start Date, Vod End Date
 */
const mapStateToProps = state => {
    return {
        titleTabPage: state.titleReducer.titleTabPage,
        titleTabPageSort: state.titleReducer.session.titleTabPageSort,
        freeTextSearch: state.titleReducer.freeTextSearch,
        titleTabPageSelection: state.titleReducer.session.titleTabPageSelection,
        titleTabPageLoading: state.titleReducer.titleTabPageLoading,
        columnsOrder: state.titleReducer.session.columns,
        columnsSize: state.titleReducer.session.columnsSize,
    };
};

const mapDispatchToProps = {
    resultPageUpdate,
    resultPageSort,
    resultPageSelect,
    resultPageUpdateColumnsOrder,
};

class TitleResultTable extends React.Component {
    table = null;

    constructor(props) {
        super(props);
        this.state = {
            pageSize: config.get('title.page.size'),
            defaultColDef: {
                sortable: true,
                resizable: true,
                cellStyle: this.cellStyle,
            },
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
            getRows: this.getRows,
        };

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        //ugly hack to change height once advanced filter finishes its transition (appearing or dissapearing)
        this.refreshColumns();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        const offsetTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        this.setState({height: window.innerHeight - offsetTop - 40 + 'px'});
    }

    componentDidUpdate(prevProps) {
        if (this.props.titleTabPageSort != prevProps.titleTabPageSort) {
            const sortModel = [];
            this.props.titleTabPageSort.map(sortCriteria => {
                sortModel.push({colId: sortCriteria.id, sort: sortCriteria.desc ? 'desc' : 'asc'});
            });

            const currentSortModel = getSortModel(this.table.columnApi);
            let toChangeSortModel = false;

            if (currentSortModel.length != sortModel.length) toChangeSortModel = true;

            for (let i = 0; i < sortModel.length && !toChangeSortModel; i++) {
                if (sortModel[i].colId != currentSortModel[i].colId) toChangeSortModel = true;
                if (sortModel[i].sortCriteria != currentSortModel[i].sortCriteria) toChangeSortModel = true;
            }

            if (toChangeSortModel) {
                setSorting(sortModel, this.table.columnApi);
            }
        }

        if (
            this.props.titleTabPageLoading != prevProps.titleTabPageLoading &&
            this.props.titleTabPageLoading === true &&
            this.table != null
        ) {
            this.table.api.setDatasource(this.dataSource);
        }
    }

    parseColumnsSchema() {
        if (titleMapping) {
            titleMapping.mappings.map(
                column =>
                    (colDef[column.javaVariableName] = {
                        headerName: column.displayName,
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            filterOptions: ['contains', 'notContains'],
                        },
                        field: column.javaVariableName,
                        cellRendererFramework: this.loadingRenderer,
                        width: 623,
                    })
            );
        }
    }

    onSortChanged(e) {
        const sortParams = getSortModel(e.columnApi);
        const newSort = [];
        if (sortParams.length > 0) {
            sortParams.map(criteria => {
                newSort.push({id: e.columnApi.getColumn(criteria.colId).colDef.field, desc: criteria.sort == 'desc'});
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

        const selectedRows = e.api.getSelectedRows();
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
        this.props.resultPageSelect({selected: selected, selectAll: allLoadedSelected});
    }

    editTitle(newTitle) {
        const copiedTitle = this.props.titleTabPage.titles.slice();
        const title = copiedTitle.find(b => b.id === newTitle.id);
        if (title) {
            for (const titleField in newTitle) title[titleField] = newTitle[titleField];
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
            total: this.props.titleTabPage.total,
        });
    }

    doSearch(page, pageSize, sortedParams) {
        return titleServiceManager.doSearch(page, pageSize, sortedParams);
    }

    getRows(params) {
        if (this.table && this.table.api) {
            this.table.api.showLoadingOverlay();
        }
        this.doSearch(
            Math.floor(params.startRow / this.state.pageSize),
            this.state.pageSize,
            this.props.titleTabPageSort
        )
            .then(response => {
                const {data, total} = response || {};
                if (total > 0) {
                    // put some value on repository field to avoid 'loading' in case when result have one row
                    if(total === 1) data[0].repository = data[0].id.split('_')[0];
                    this.addLoadedItems(response);
                    this.addItemToTable(response, params);
                } else {
                    this.table && this.table.api && this.table.api.showNoRowsOverlay();
                    params.failCallback();
                }
            })
            .catch(error => {
                console.error('Unexpected error');
                console.error(error);
                params.failCallback();
            });
    }

    getFormatTitle = (item, contentType) => {
        const {episodic, title: episodeTitle} = item || {};
        const {seriesTitleName, seasonNumber, episodeNumber} = episodic || {};

        switch (contentType) {
            case SEASON.apiName:
                return seriesTitleName
                    ? `${seriesTitleName} S${formatNumberTwoDigits(seasonNumber)}`
                    : `[SeriesNotFound] S${formatNumberTwoDigits(seasonNumber)}`;
            case EPISODE.apiName:
                return renderTitleName(episodeTitle, contentType, seasonNumber, episodeNumber, seriesTitleName);
        }

        return item.title;
    };

    addItemToTable = (data, params) => {
        // if on or after the last page, work out the last row.
        let lastRow = -1;
        if ((data.page + 1) * data.size >= data.total) {
            lastRow = data.total;
        }

        const rows = data.data.map(row => {
            const contentType = row.contentType.toUpperCase();
            row.concatenatedTitle = row.title;
            if (contentType === SEASON.apiName) {
                row.title = this.getFormatTitle(row, SEASON.apiName);
            } else if (contentType === EPISODE.apiName) {
                row.concatenatedTitle = this.getFormatTitle(row, EPISODE.apiName);
            }
            return row;
        });

        params.successCallback(rows, lastRow);

        if (this.props.titleTabPageSelection.selected.length > 0) {
            this.table.api.forEachNode(rowNode => {
                if (rowNode.data && this.props.titleTabPageSelection.selected.indexOf(rowNode.data.id) > -1) {
                    rowNode.setSelected(true);
                }
            });
        }

        this.table?.api.hideOverlay();
        this.onSelectionChanged(this.table);
    };

    addLoadedItems(data) {
        const items = data.data.map(e => (e.contentType = toPrettyContentTypeIfExist(e.contentType)));

        if (items.length > 0) {
            this.props.resultPageUpdate({
                pages: this.props.titleTabPage.pages + 1,
                titles: this.props.titleTabPage.titles.concat(items),
                pageSize: this.props.titleTabPage.pageSize + items.length,
                total: data.total,
            });
        }
    }

    resetLoadedItems() {
        this.props.resultPageUpdate({
            pages: 0,
            titles: [],
            pageSize: 0,
            total: 0,
        });
    }

    onColumnReordered(e) {
        const cols = [];
        e.columnApi.getAllGridColumns().map(column => {
            if (get(column, 'colDef.headerName', '') !== 'Action') cols.push(column.colDef.field);
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
        const newCols = [];
        const columnsOrder = ['title', 'concatenatedTitle', 'contentType', 'releaseYear'];
        columnsOrder.map(acc => {
            if (colDef.hasOwnProperty(acc)) {
                newCols.push(colDef[acc]);
            }
        });
        newCols.push(getRepositoryCell({headerName: 'Repository'}));
        const actionColumn = defineColumn({
            headerName: 'Action',
            field: 'action',
            cellRendererFramework: ActionCellRender,
        });
        this.cols = [actionColumn, ...newCols];
    }

    loadingRenderer = params => {
        let error = null;
        if (!params.value && params.data && params.data.validationErrors) {
            params.data.validationErrors.forEach(e => {
                if (
                    params.colDef &&
                    (e.fieldName === params.colDef.field ||
                        (e.fieldName === '[start, availStart]' && params.colDef.field === 'start') ||
                        (e.fieldName === '[start, availStart]' && params.colDef.field === 'availStart'))
                ) {
                    error =
                        e.message +
                        ', error processing field ' +
                        e.originalFieldName +
                        ' with value ' +
                        e.originalValue +
                        ' at row ' +
                        e.rowId +
                        ' from file ' +
                        e.fileName;
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
                            style={{textOverflow: 'ellipsis', overflow: 'hidden', color: error ? '#a94442' : null}}
                        >
                            {content}
                        </div>
                    </Link>
                );
            } else return params.value;
        } else {
            return '';
        }
    };

    cellStyle(params) {
        let error = null;
        if (!params.value && params.data && params.data.validationErrors) {
            params.data.validationErrors.forEach(e => {
                if (
                    e.fieldName === params.colDef.field ||
                    (e.fieldName.includes('country') && params.colDef.field === 'territory') ||
                    (e.fieldName.includes('territoryExcluded') && params.colDef.field === 'territoryExcluded') ||
                    (e.fieldName === '[start, availStart]' && params.colDef.field === 'start') ||
                    (e.fieldName === '[start, availStart]' && params.colDef.field === 'availStart')
                ) {
                    error = e;
                    return;
                }
            });
        }
        if (params.colDef.headerName !== '' && error) {
            return {backgroundColor: '#f2dede'};
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
                    width: '100%',
                }}
            >
                <AgGridReact
                    id="titleTable"
                    getContextMenuItems={params => getContextMenuItems(params, '/metadata/detail')}
                    ref={this.setTable}
                    getRowNodeId={data => data.id}
                    defaultColDef={this.state.defaultColDef}
                    columnDefs={this.cols}
                    suppressDragLeaveHidesColumns={true}
                    onDragStopped={this.onColumnReordered}
                    onColumnResized={this.onColumnResized}
                    rowBuffer="50"
                    rowModelType="infinite"
                    paginationPageSize={this.state.pageSize}
                    infiniteInitialRowCount="0"
                    cacheOverflowSize="2"
                    maxConcurrentDatasourceRequests="1"
                    datasource={this.dataSource}
                    pagination={true}
                    onSortChanged={this.onSortChanged}
                    // enableFilter
                    // onFilterChanged={this.handleFilterChanged}

                    rowSelection="multiple"
                    onSelectionChanged={this.onSelectionChanged}
                    suppressRowClickSelection={true}
                    headerHeight="52"
                    rowHeight="48"
                />
            </div>
        );
    }
}

TitleResultTable.propTypes = {
    titleTabPage: PropTypes.object,
    titleTabPageSort: PropTypes.array,
    titleTabPageSelection: PropTypes.object,
    titleTabPageLoading: PropTypes.bool,
    resultPageUpdate: PropTypes.func,
    resultPageSort: PropTypes.func,
    resultPageSelect: PropTypes.func,
    columnsOrder: PropTypes.array,
    columnsSize: PropTypes.object,
    resultPageUpdateColumnsOrder: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleResultTable);
