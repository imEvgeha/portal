import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// image import
import LoadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';

import RightsURL from '../../util/RightsURL';
import {CheckBoxHeader} from './CheckBoxHeaderInternal';

import {AgGridReact} from 'ag-grid-react';
import './RightsResultTable.scss';

import {connect} from 'react-redux';
import {
    manualRightsResultPageLoading,
    manualRightsResultPageSelect,
    manualRightsResultPageSort,
    manualRightsResultPageUpdate,
    updateManualRightsEntryColumns,
} from '../../../../stores/actions/avail/manualRightEntry';
import {rightServiceManager} from '../../service/RightServiceManager';
import {equalOrIncluded, getDeepValue} from '@vubiquity-nexus/portal-utils/lib/Common';
import getContextMenuItems from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/getContextMenuItems';
import {getSortModel, setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';

const colDef = [];
let registeredOnSelect = false;

const errorCellColor = '#f2dede';
const readyNewCellColor = '#D3D3D3';
const readyCellColor = '#a3a3a3';
const selectedColor = '#808080';
const defaultCellColor = '#ededed';

export const defaultMode = 'defaultMode';
export const selectRightMode = 'selectRightMode';

const mapStateToProps = state => {
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

const mapDispatchToProps = {
    manualRightsResultPageUpdate,
    manualRightsResultPageSort,
    manualRightsResultPageSelect,
    manualRightsResultPageLoading,
    updateManualRightsEntryColumns,
};

class RightsResultTable extends React.Component {
    table = null;

    constructor(props) {
        super(props);
        this.state = {
            originalData: this.props.tabPageSelection.selected.slice(0),
            pageSize: getConfig('avails.page.size'),
            cols: [],
            defaultColDef: {
                resizable: true,
                cellStyle: this.cellStyle,
            },
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
            getRows: this.getRows,
        };

        if (this.props.setClearAllSelected) {
            this.props.setClearAllSelected(this.clearAllSelected);
        }

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        //ugly hack to change height once advanced filter finishes its transition (appearing or dissapearing)
        let elem = document.querySelector('.vu-advanced-search-panel');
        if (elem) {
            elem.addEventListener('transitionend', this.updateWindowDimensions);
        }
        elem = document.querySelector('.vu-free-text-search');
        if (elem) {
            elem.addEventListener('transitionend', this.updateWindowDimensions);
        }
        this.refreshColumns();

        if (this.props.autoRefresh && this.refresh === null) {
            this.refresh = setInterval(this.reload, this.props.autoRefresh);
        }
        this.table.api.setDatasource(this.dataSource);
        this.props.onTableLoaded(this.table);
    }

    componentWillUnmount() {
        if (this.refresh !== null) {
            clearInterval(this.refresh);
            this.refresh = null;
        }
        window.removeEventListener('resize', this.updateWindowDimensions);
        let elem = document.querySelector('.vu-advanced-search-panel');
        if (elem) {
            elem.removeEventListener('transitionend', this.updateWindowDimensions);
        }
        elem = document.querySelector('.vu-free-text-search');
        if (elem) {
            elem.removeEventListener('transitionend', this.updateWindowDimensions);
        }
    }

    updateWindowDimensions() {
        const offsetTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        this.setState({height: window.innerHeight - offsetTop - 10});
    }

    componentDidUpdate(prevProps) {
        if (!this.table) return;

        if (this.props.availsMapping !== prevProps.availsMapping) {
            this.parseColumnsSchema();
        }
        if (
            this.props.columns !== prevProps.columns ||
            this.props.columnsOrder !== prevProps.columnsOrder ||
            this.props.availsMapping !== prevProps.availsMapping
        ) {
            const cols = this.props.columns || this.props.columnsOrder;
            this.refreshColumns();
            setTimeout(() => {
                this.table.columnApi.moveColumns(cols, 1);
            }, 1);
        }

        this.refreshSort();
        const isNewFileUploaded = prevProps.status === 'PENDING' && this.props.status !== 'PENDING';
        const isLoading = this.props.tabPageLoading !== prevProps.tabPageLoading && this.props.tabPageLoading === true;
        const isNewTab = prevProps.selectedTab !== this.props.selectedTab;
        const shouldRefetch =
            (this.props.fromServer && this.table != null && this.props.hidden !== true && (isLoading || isNewTab)) ||
            isNewFileUploaded;

        if (shouldRefetch) {
            this.table.api.setDatasource(this.dataSource);
        }

        if (prevProps.tabPageSelection !== this.props.tabPageSelection) {
            if (this.props.fromServer) {
                if (this.props.showSelectedAvails) {
                    this.refreshSelected();
                }
            } else {
                if (!this.props.showSelectedAvails) {
                    this.setState({originalData: this.props.tabPageSelection.selected.slice(0)});
                    setTimeout(() => {
                        this.refreshSelected();
                    }, 1);
                }
            }
        }

        //when we go out of 'See selected avails'
        if (
            prevProps.showSelectedAvails !== this.props.showSelectedAvails &&
            this.props.showSelectedAvails === false &&
            !this.props.fromServer
        ) {
            this.setState({originalData: this.props.tabPageSelection.selected.slice(0)});
            setTimeout(() => {
                this.table.api.selectAll();
            }, 1);
        }
        if (prevProps.hidden !== this.props.hidden && !this.props.hidden) {
            this.updateWindowDimensions();
            this.refreshSelected();
            this.table.api.redrawRows();
        }
    }

    parseColumnsSchema() {
        if (colDef.length > 0) {
            return;
        }
        if (this.props.availsMapping) {
            this.props.availsMapping.mappings
                .filter(({dataType}) => dataType)
                .map(
                    column =>
                        (colDef[column.javaVariableName] = {
                            field: column.javaVariableName,
                            headerName: column.displayName,
                            cellRendererFramework: this.loadingRenderer,
                            valueFormatter: createValueFormatter(column),
                            width:
                                this.props.columnsSize && this.props.columnsSize.hasOwnProperty(column.javaVariableName)
                                    ? this.props.columnsSize[column.javaVariableName]
                                    : 250,
                            sortable: !!column.queryParamName,
                        })
                );
        }
    }

    refreshSort() {
        if (!this.table) return;
        const sortModel = [];
        this.props.tabPageSort.map(sortCriteria => {
            const availMapping = this.props.availsMapping.mappings.find(
                ({sortParamName, queryParamName}) => sortCriteria.id === (sortParamName || queryParamName)
            );
            sortModel.push({
                colId: availMapping.javaVariableName,
                sort: sortCriteria.desc ? 'desc' : 'asc',
            });
        });

        const currentSortModel = getSortModel(this.table.columnApi);
        let toChangeSortModel = false;

        if (currentSortModel?.length !== sortModel?.length) toChangeSortModel = true;

        for (let i = 0; i < sortModel.length && !toChangeSortModel; i++) {
            if (sortModel[i].colId !== currentSortModel[i].colId) toChangeSortModel = true;
            if (sortModel[i].sortCriteria !== currentSortModel[i].sortCriteria) toChangeSortModel = true;
        }

        if (toChangeSortModel) {
            setSorting(sortModel, this.table.columnApi);
        }
    }

    onSortChanged(e) {
        const sortParams = getSortModel(e.columnApi);
        const newSort = [];
        if (sortParams.length > 0) {
            sortParams.map(criteria => {
                const availMapping = this.props.availsMapping.mappings.find(
                    ({javaVariableName}) => javaVariableName === criteria.colId
                );
                newSort.push({
                    id: availMapping.sortParamName || availMapping.queryParamName,
                    desc: criteria.sort === 'desc',
                });
            });
        }
        this.props.manualRightsResultPageSort(newSort);
    }

    onSelectionChanged() {
        if (!registeredOnSelect) {
            registeredOnSelect = true;
            setTimeout(this.onSelectionChangedProcess, 1);
        }
    }

    onScroll() {
        const allVisibleSelected = this.areAllVisibleSelected();
        const oneVisibleSelected = this.isOneVisibleSelected();
        if (
            allVisibleSelected !== this.props.tabPageSelection.selectAll ||
            oneVisibleSelected === this.props.tabPageSelection.selectNone
        ) {
            this.props.manualRightsResultPageSelect({
                selected: this.props.tabPageSelection.selected,
                selectAll: allVisibleSelected,
                selectNone: !oneVisibleSelected,
            });
        }
    }

    refreshSelected() {
        if (!this.table) return;
        this.table.api.deselectAll();
        this.table.api.forEachNode(rowNode => {
            if (
                rowNode.data &&
                this.props.tabPageSelection.selected.filter(sel => sel.id === rowNode.data.id).length > 0
            ) {
                rowNode.setSelected(true);
            }
        });
    }

    clearAllSelected() {
        if (this.table) {
            this.table.api.deselectAll();
        }
    }

    onSelectionChangedProcess() {
        registeredOnSelect = false;
        if (!this.table) return;

        if (this.props.hidden) return;

        let selected = this.table.api.getSelectedRows().slice(0);

        if (this.table.api.getDisplayedRowCount() > 0) {
            this.props.tabPageSelection.selected.map(sel => {
                if (
                    selected.filter(rec => sel.id === rec.id).length === 0 &&
                    this.table.api.getRowNode(sel.id) === null
                ) {
                    selected.push(sel);
                }
            });
        } else {
            if (this.props.tabPageSelection.selected && this.props.tabPageSelection.selected.length > 0)
                selected = selected.concat(this.props.tabPageSelection.selected);
        }

        const nodesToUpdate = selected
            .filter(x => !this.props.tabPageSelection.selected.includes(x))
            .concat(this.props.tabPageSelection.selected.filter(x => !selected.includes(x)))
            .map(i => this.table.api.getRowNode(i.id));

        this.table.api.redrawRows({rowNodes: nodesToUpdate});

        this.props.manualRightsResultPageSelect({
            selected: selected,
            selectNone: !this.isOneVisibleSelected(),
            selectAll: this.areAllVisibleSelected(),
        });
    }

    isOneVisibleSelected() {
        const visibleRange = this.table.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset =
            0.7 + (this.table?.api?.headerRootComp?.gridPanel?.scrollVisibleService?.horizontalScrollShowing ? 0.4 : 0);
        const visibleNodes = this.table.api
            .getRenderedNodes()
            .filter(
                ({rowTop, rowHeight}) =>
                    rowTop + rowHeight * topOffset > visibleRange.top &&
                    rowTop + rowHeight * bottomOffset < visibleRange.bottom
            );
        const selectedNodes = visibleNodes.filter(({selected}) => selected);
        return selectedNodes.length > 0;
    }

    areAllVisibleSelected() {
        const visibleRange = this.table.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset =
            0.7 + (this.table.api?.headerRootComp?.gridPanel?.scrollVisibleService?.horizontalScrollShowing ? 0.4 : 0);
        const visibleNodes = this.table.api
            .getRenderedNodes()
            .filter(
                ({rowTop, rowHeight}) =>
                    rowTop + rowHeight * topOffset > visibleRange.top &&
                    rowTop + rowHeight * bottomOffset < visibleRange.bottom
            );
        const selectedNodes = visibleNodes.filter(({selected}) => selected);

        return visibleNodes.length === selectedNodes.length;
    }

    editAvail(newAvail) {
        const copiedAvails = this.props.tabPage.avails.slice();
        const avail = copiedAvails.find(b => b.id === newAvail.id);
        if (avail) {
            for (const availField in newAvail) avail[availField] = newAvail[availField];
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
            total: this.props.tabPage.total,
        });
    }

    reload() {
        if (this.props.fromServer && this.table != null && this.props.autoRefresh) {
            this.table.api.setDatasource(this.dataSource);
        }
    }

    doSearch(page, pageSize, sortedParams) {
        return rightServiceManager.callPlanningSearch(this.props.searchCriteria, page, pageSize, sortedParams);
    }

    getRows(params) {
        if (this.table && this.table.api.getDisplayedRowCount() === 0 && !this.props.autoRefresh) {
            this.table.api.showLoadingOverlay();
        }
        this.doSearch(Math.floor(params.startRow / this.state.pageSize), this.state.pageSize, this.props.tabPageSort)
            .then(response => {
                if (response && response.total > 0) {
                    this.addLoadedItems(response);
                    // if on or after the last page, work out the last row.
                    let lastRow = -1;
                    if ((response.page + 1) * response.size >= response.total) {
                        lastRow = response.total;
                    }

                    if (this.table) {
                        params.successCallback(response.data, lastRow);
                        if (this.props.tabPageSelection.selected.length > 0) {
                            this.table.api.forEachNode(rowNode => {
                                if (
                                    rowNode.data &&
                                    this.props.tabPageSelection.selected.filter(sel => sel.id === rowNode.data.id)
                                        .length > 0
                                ) {
                                    rowNode.setSelected(true);
                                }
                            });
                        }

                        this.table.api.hideOverlay();
                        this.onSelectionChanged();
                    }
                } else {
                    if (this.table) {
                        this.table.api.showNoRowsOverlay();
                    }
                }
            })
            .catch(error => {
                console.error('Unexpected error');
                console.error(error);
                params.failCallback();
            });
    }

    staticDataLoaded(e) {
        e.api.selectAll();
    }

    addLoadedItems(data) {
        const items = data.data;
        if (items.length > 0) {
            this.props.manualRightsResultPageUpdate({
                pages: this.props.tabPage.pages + 1,
                avails: this.props.tabPage.avails.concat(items),
                pageSize: this.props.tabPage.pageSize + items.length,
                total: data.total,
            });
        }
    }

    onColumnReordered(e) {
        const cols = [];
        e.columnApi.getAllGridColumns().map(column => {
            if (column.colDef.headerName !== '') cols.push(column.colDef.field);
        });
        this.props.updateManualRightsEntryColumns(cols);
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
        newCols.push({
            headerName: '',
            checkboxSelection: true,
            width: 40,
            pinned: 'left',
            resizable: false,
            suppressSizeToFit: true,
            suppressMovable: true,
            lockPosition: true,
            headerComponentFramework: CheckBoxHeader,
        });
        let cols = this.props.columns || this.props.columnsOrder;
        if (!cols) {
            cols = this.props.availsMapping.mappings
                .filter(({dataType}) => dataType)
                .map(({javaVariableName}) => javaVariableName);
            this.props.updateManualRightsEntryColumns(cols);
        }
        if (cols) {
            cols.map(acc => {
                if (colDef.hasOwnProperty(acc)) {
                    newCols.push(colDef[acc]);
                }
            });
            this.setState({cols: newCols});
        }
    }

    loadingRenderer(params) {
        let error = null;
        if (params.data && params.data.validationErrors) {
            params.data.validationErrors.forEach(e => {
                if (equalOrIncluded(params.colDef.field, e.fieldName)) {
                    error = e.message;
                    if (e.sourceDetails) {
                        if (e.sourceDetails.originalValue)
                            error += ", original value:  '" + e.sourceDetails.originalValue + "'";
                        if (e.sourceDetails.fileName) {
                            error +=
                                ', in file ' +
                                e.sourceDetails.fileName +
                                ', row number ' +
                                e.sourceDetails.rowId +
                                ', column ' +
                                e.sourceDetails.originalFieldName;
                        }
                    }
                }
                return error;
            });
        }

        let val;
        if (params.data) {
            val = getDeepValue(params.data, params.colDef.field);
        }
        if (val && val === Object(val) && !Array.isArray(val)) {
            val = JSON.stringify(val);
        }
        if (Array.isArray(val) && val.length > 1) {
            val = val.join(', ');
        }
        const content = error || params.valueFormatted || val;
        if (val !== undefined) {
            if (content || content === false) {
                let highlighted = false;
                if (params.data && params.data.highlightedFields) {
                    highlighted = params.data.highlightedFields.indexOf(params.colDef.field) > -1;
                }
                return (
                    <Link to={RightsURL.getRightUrl(params.data.id, this.props.nav)}>
                        <div
                            title={error}
                            className={highlighted ? 'font-weight-bold' : ''}
                            style={{textOverflow: 'ellipsis', overflow: 'hidden', color: error ? '#a94442' : null}}
                        >
                            {String(content)}
                        </div>
                        {highlighted && (
                            <div style={{position: 'absolute', top: '0px', right: '0px', lineHeight: '1'}}>
                                <span
                                    title="Fields in bold are original values provided by the studios"
                                    style={{color: 'grey'}}
                                >
                                    <i className="far fa-question-circle" />
                                </span>
                            </div>
                        )}
                    </Link>
                );
            } else return val;
        } else {
            if (params.data) {
                return '';
            } else {
                return <img src={LoadingGif} />;
            }
        }
    }

    cellStyle = params => {
        let error = null;
        if (params.data && params.data.validationErrors) {
            params.data.validationErrors.forEach(e => {
                if (equalOrIncluded(params.colDef.field, e.fieldName)) {
                    error = e;
                }
            });
        }

        if (params.colDef.headerName !== '' && error) {
            return {backgroundColor: errorCellColor};
        } else if (this.props.mode === selectRightMode) {
            if (params.node.selected === true) {
                return {backgroundColor: selectedColor};
            } else if (params.data && params.data.status === 'ReadyNew') {
                return {backgroundColor: readyNewCellColor};
            } else if (params.data && params.data.status === 'Ready') {
                return {backgroundColor: readyCellColor};
            } else {
                return {backgroundColor: defaultCellColor};
            }
        }
    };

    render() {
        let rowsProps = {};
        if (!this.props.fromServer) {
            rowsProps = {
                rowBuffer: '0',
                rowData: this.state.originalData,
                onFirstDataRendered: this.staticDataLoaded,
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
                onSortChanged: this.onSortChanged,
            };
        }

        return (
            <div>
                <div
                    className={'ag-theme-balham ' + (this.props.hidden ? 'd-none' : '')}
                    style={{
                        height: this.state.height + 'px',
                        width: '100%',
                    }}
                >
                    <AgGridReact
                        ref={this.setTable}
                        {...rowsProps}
                        getRowNodeId={data => data.id}
                        defaultColDef={this.state.defaultColDef}
                        columnDefs={this.state.cols}
                        suppressDragLeaveHidesColumns={true}
                        onDragStopped={this.onColumnReordered}
                        onColumnResized={this.onColumnResized}
                        onBodyScroll={this.onScroll}
                        rowSelection="multiple"
                        onSelectionChanged={this.onSelectionChanged}
                        suppressRowClickSelection={true}
                        headerHeight="52"
                        rowHeight="48"
                        getContextMenuItems={getContextMenuItems}
                    />
                </div>
            </div>
        );
    }
}
RightsResultTable.propTypes = {
    autoload: PropTypes.bool,
    availsMapping: PropTypes.any,
    tabPage: PropTypes.object,
    tabPageSort: PropTypes.array,
    tabPageSelection: PropTypes.object,
    tabPageLoading: PropTypes.bool,
    manualRightsResultPageUpdate: PropTypes.func,
    manualRightsResultPageSort: PropTypes.func,
    manualRightsResultPageSelect: PropTypes.func,
    manualRightsResultPageLoading: PropTypes.func,
    columnsOrder: PropTypes.array,
    columns: PropTypes.array,
    columnsSize: PropTypes.object,
    updateManualRightsEntryColumns: PropTypes.func,
    showSelectedAvails: PropTypes.bool,
    fromServer: PropTypes.bool,
    hidden: PropTypes.bool,
    nav: PropTypes.object,
    autoRefresh: PropTypes.number,
    mode: PropTypes.string,
    selectedTab: PropTypes.string,
    searchCriteria: PropTypes.object,
    onTableLoaded: PropTypes.func,
    historyData: PropTypes.object,
    status: PropTypes.string,
};

RightsResultTable.defaultProps = {
    autoload: true,
    autoRefresh: 0,
    mode: defaultMode,
    searchCriteria: {},
};
export default connect(mapStateToProps, mapDispatchToProps)(RightsResultTable);
