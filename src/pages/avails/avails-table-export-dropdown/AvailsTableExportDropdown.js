import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, OverlayPanel, Tooltip} from '@portal/portal-components';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {exportService} from '../../legacy/containers/avail/service/ExportService';
import * as selectors from '../right-matching/rightMatchingSelectors';
import {
    IN_PROGRESS,
    PRE_PLAN_TAB,
    PREPLAN_REPORT,
    RIGHTS_TAB,
    SELECTED_FOR_PLANNING_REPORT,
    SELECTED_FOR_PLANNING_TAB,
    STATUS_TAB,
} from '../rights-repository/constants';
import {TOOLTIP_MSG_MAX_ROWS, TOOLTIP_MSG_NO_RESULT, TOOLTIP_MSG_NO_RIGHTS} from './constants';
import './AvailsTableExportDropdown.scss';

const MAX_ROWS = 50000;

const AvailsTableExportDropdown = ({
    activeTab,
    selectedRowsCount,
    totalRecordsCount,
    rightsFilter,
    gridApi,
    columnApi,
    mapping,
    username,
    isSelected,
}) => {
    const [mappingColumnNames, setMappingColumnNames] = useState();
    const [tooltipContent, setTooltipContent] = useState();
    const [isDisabled, setIsDisabled] = useState(false);
    const op = useRef(null);

    useEffect(() => {
        if (mapping) {
            setMappingColumnNames(
                mapping.filter(({dataType}) => dataType).map(({javaVariableName}) => javaVariableName)
            );
        }
    }, [mapping]);

    useEffect(() => {
        let disable = false;
        const isPrePlanDisabled = activeTab === PRE_PLAN_TAB && !totalRecordsCount;
        const planningHasNoData = activeTab === SELECTED_FOR_PLANNING_TAB && !totalRecordsCount;
        const isRightsRepo = [RIGHTS_TAB].includes(activeTab);

        if (STATUS_TAB === activeTab || isPrePlanDisabled || planningHasNoData) {
            disable = true;
        } else if (isRightsRepo && isSelected && selectedRowsCount === 0) {
            setTooltipContent(TOOLTIP_MSG_NO_RIGHTS);
            disable = true;
        } else if (isRightsRepo && !isSelected && totalRecordsCount === 0) {
            setTooltipContent(TOOLTIP_MSG_NO_RESULT);
            disable = true;
        } else if (isRightsRepo && !isSelected && totalRecordsCount > MAX_ROWS) {
            setTooltipContent(TOOLTIP_MSG_MAX_ROWS);
            disable = true;
        }

        setIsDisabled(disable);
    }, [activeTab, selectedRowsCount, totalRecordsCount, isSelected]);

    const getSelectedRightIds = gridApi => {
        const ids = [];
        gridApi?.forEachNodeAfterFilter(node => {
            const {data = {}} = node;
            ids.push(data.id);
        });
        return ids;
    };

    const onAllColumnsExportClick = () => {
        switch (activeTab) {
            case RIGHTS_TAB: {
                if (isSelected) {
                    const allDisplayedColumns = getAllDisplayedColumns(columnApi);
                    exportService
                        .exportAvails(getSelectedRightIds(gridApi), allDisplayedColumns)
                        .then(response => downloadFile(response));
                    break;
                }
                const allDisplayedColumns = getAllDisplayedColumns(columnApi);
                const {external, column} = rightsFilter;
                exportService
                    .bulkExportAvails({...external, ...column}, allDisplayedColumns)
                    .then(response => downloadFile(response));
                break;
            }
            case PRE_PLAN_TAB: {
                downloadTableReport(true, gridApi, columnApi, PREPLAN_REPORT);
                break;
            }
            case SELECTED_FOR_PLANNING_TAB: {
                downloadTableReport(true, gridApi, columnApi, SELECTED_FOR_PLANNING_REPORT);
                break;
            }
            default:
            // no-op
        }
    };

    const onVisibleColumnsExportClick = () => {
        switch (activeTab) {
            case RIGHTS_TAB: {
                const visibleColumns = getDownloadableColumns(columnApi?.getAllDisplayedColumns());
                if (isSelected) {
                    const visibleColumns = getDownloadableColumns(columnApi?.getAllDisplayedColumns());
                    exportService
                        .exportAvails(getSelectedRightIds(gridApi), visibleColumns)
                        .then(response => downloadFile(response));
                    break;
                }

                const {external, column} = rightsFilter;
                exportService
                    .bulkExportAvails({...external, ...column}, visibleColumns)
                    .then(response => downloadFile(response));
                break;
            }
            case PRE_PLAN_TAB: {
                downloadTableReport(false, gridApi, columnApi, PREPLAN_REPORT);
                break;
            }
            case SELECTED_FOR_PLANNING_TAB: {
                downloadTableReport(false, gridApi, columnApi, SELECTED_FOR_PLANNING_REPORT);
                break;
            }
            default:
            // no-op
        }
    };

    const getAllDisplayedColumns = columnApi => {
        const allDisplayedColumns = getDownloadableColumns(columnApi?.getAllDisplayedColumns());

        mappingColumnNames.forEach(mapCol => {
            let col = mapCol;

            if (mapCol === 'territoryDateSelected') col = 'reportingOnly.selectedAt';
            if (!allDisplayedColumns.includes(col)) allDisplayedColumns.push(col);
        });

        return allDisplayedColumns;
    };

    const downloadTableReport = (allColumns, gridApi, columnApi, fileName) => {
        const currentTime = new Date();
        gridApi.exportDataAsExcel({
            processCellCallback: params => {
                const {column} = params || {};
                const {colDef} = column || {};
                const {headerName} = colDef || {};
                const {value = []} = params || {};

                if (['Plan Territories', 'Selected'].includes(headerName)) {
                    return value.filter(item => item.selected).map(item => item.country);
                } else if (headerName === 'Withdrawn') {
                    return value.filter(item => item.withdrawn).map(item => item.country);
                } else if (headerName === 'DOP Status') {
                    return IN_PROGRESS;
                }

                if (!['HFR', 'Temporary Price Reduction', 'Exclusive'].includes(headerName)) {
                    if (value === true) return 'Yes';
                    else if (value === false) return 'No';
                }

                return value;
            },
            columnKeys: preparePrePlanExportColumns(columnApi),
            fileName: `${fileName}_${username.split('.').join('_')}_${currentTime.getFullYear()}-${
                currentTime.getMonth() + 1
            }-${currentTime.getDate()}`,
            allColumns,
        });
    };

    const getDownloadableColumns = (columns = []) => {
        const headerFields = new Set(); // no duplicates
        columns.map(({colDef: {field, colId} = {}}) => {
            //
            if (mappingColumnNames.includes(field)) {
                if (colId === 'selected' || colId === 'withdrawn') {
                    headerFields.add(colId);
                } else if (colId === 'territoryDateSelected') {
                    headerFields.add('reportingOnly.selectedAt');
                } else {
                    headerFields.add(field);
                }
            }
            return null;
        });
        return Array.from(headerFields);
    };

    const preparePrePlanExportColumns = api => {
        return api
            .getAllDisplayedColumns()
            .map(({colDef: {colId} = {}}) => colId)
            .filter(col => !['action', 'buttons'].includes(col));
    };

    return (
        <div className="nexus-c-right-repository-export">
            {isDisabled && <Tooltip target=".avails-export-ddl-wrapper" content={tooltipContent} position="left" />}
            <span className="avails-export-ddl-wrapper">
                <Button
                    id="btnAvailsExport"
                    icon="pi pi-chevron-down"
                    iconPos="right"
                    disabled={isDisabled}
                    className="p-button-outlined p-button-secondary"
                    label="Export"
                    onClick={e => op?.current?.toggle?.(e)}
                />
            </span>

            <OverlayPanel ref={op} id="opReport" style={{width: 'auto'}} className="export-overlay-panel">
                <div className="row">
                    <div className="col-12 text-center">
                        <Button
                            id="btnAllColumns"
                            label="All Columns"
                            className="p-button-text"
                            onClick={onAllColumnsExportClick}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <Button
                            id="btnVisibleCols"
                            label="Visible Columns"
                            className="p-button-text"
                            onClick={onVisibleColumnsExportClick}
                        />
                    </div>
                </div>
            </OverlayPanel>
        </div>
    );
};

AvailsTableExportDropdown.propTypes = {
    activeTab: PropTypes.string,
    selectedRowsCount: PropTypes.number.isRequired,
    totalRecordsCount: PropTypes.number.isRequired,
    rightsFilter: PropTypes.object,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    mapping: PropTypes.array.isRequired,
    username: PropTypes.string,
    isSelected: PropTypes.bool.isRequired,
};

AvailsTableExportDropdown.defaultProps = {
    activeTab: RIGHTS_TAB,
    rightsFilter: {},
    gridApi: {},
    columnApi: {},
    username: '',
};

const mapStateToProps = () => {
    const rightMatchingMappingSelector = selectors.createAvailsMappingSelector();

    return (state, props) => ({
        mapping: rightMatchingMappingSelector(state, props),
    });
};

export default connect(mapStateToProps)(AvailsTableExportDropdown);
