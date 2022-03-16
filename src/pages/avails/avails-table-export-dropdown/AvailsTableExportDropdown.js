import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {exportService} from '../../legacy/containers/avail/service/ExportService';
import * as selectors from '../right-matching/rightMatchingSelectors';
import {
    RIGHTS_TAB,
    PRE_PLAN_TAB,
    SELECTED_FOR_PLANNING_TAB,
    PREPLAN_REPORT,
    SELECTED_FOR_PLANNING_REPORT,
    STATUS_TAB,
    IN_PROGRESS,
} from '../rights-repository/constants';
import {TOOLTIP_MSG_NO_RIGHTS, TOOLTIP_MSG_NO_RESULT, TOOLTIP_MSG_MAX_ROWS} from './constants';
import './AvailsTableExportDropdown.scss';

const MAX_ROWS = 50000;

const AvailsTableExportDropdown = ({
    activeTab,
    selectedRows,
    totalRows,
    rightsFilter,
    gridApi,
    columnApi,
    prePlanRightsCount,
    mapping,
    username,
    isSelected,
}) => {
    const [mappingColumnNames, setMappingColumnNames] = useState();
    const [tooltipContent, setTooltipContent] = useState();
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (mapping) {
            setMappingColumnNames(
                mapping.filter(({dataType}) => dataType).map(({javaVariableName}) => javaVariableName)
            );
        }
    }, [mapping]);

    useEffect(() => {
        let disable = false;
        const prePlanHasNoData = activeTab === PRE_PLAN_TAB && prePlanRightsCount === 0;
        const planningHasNoData = activeTab === SELECTED_FOR_PLANNING_TAB && !selectedRows.length;
        const isRightsRepo = [RIGHTS_TAB].includes(activeTab);

        if (STATUS_TAB === activeTab || prePlanHasNoData || planningHasNoData) {
            disable = true;
        } else if (isRightsRepo && isSelected && selectedRows.length === 0) {
            setTooltipContent(TOOLTIP_MSG_NO_RIGHTS);
            disable = true;
        } else if (isRightsRepo && !isSelected && totalRows === 0) {
            setTooltipContent(TOOLTIP_MSG_NO_RESULT);
            disable = true;
        } else if (isRightsRepo && !isSelected && totalRows > MAX_ROWS) {
            setTooltipContent(TOOLTIP_MSG_MAX_ROWS);
            disable = true;
        }

        setIsDisabled(disable);
    }, [activeTab, selectedRows, totalRows, prePlanRightsCount]);

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

    const renderDropdown = () => {
        return (
            <DropdownMenu
                className="nexus-c-button"
                trigger="Export"
                triggerType="button"
                triggerButtonProps={{isDisabled}}
            >
                <DropdownItemGroup>
                    <DropdownItem onClick={onAllColumnsExportClick}>All Columns</DropdownItem>
                    <DropdownItem onClick={onVisibleColumnsExportClick}>Visible Columns</DropdownItem>
                </DropdownItemGroup>
            </DropdownMenu>
        );
    };

    return (
        <div className="nexus-c-right-repository-export">
            {isDisabled ? <NexusTooltip content={tooltipContent}>{renderDropdown()}</NexusTooltip> : renderDropdown()}
        </div>
    );
};

AvailsTableExportDropdown.propTypes = {
    activeTab: PropTypes.string,
    selectedRows: PropTypes.array.isRequired,
    totalRows: PropTypes.number.isRequired,
    rightsFilter: PropTypes.object,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    mapping: PropTypes.array.isRequired,
    prePlanRightsCount: PropTypes.number,
    username: PropTypes.string,
    isSelected: PropTypes.bool.isRequired,
};

AvailsTableExportDropdown.defaultProps = {
    activeTab: RIGHTS_TAB,
    rightsFilter: {},
    gridApi: {},
    columnApi: {},
    prePlanRightsCount: 0,
    username: '',
};

const mapStateToProps = () => {
    const rightMatchingMappingSelector = selectors.createAvailsMappingSelector();

    return (state, props) => ({
        mapping: rightMatchingMappingSelector(state, props),
    });
};

export default connect(mapStateToProps)(AvailsTableExportDropdown);
