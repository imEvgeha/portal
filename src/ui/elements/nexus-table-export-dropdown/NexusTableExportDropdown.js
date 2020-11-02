import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import {connect} from 'react-redux';
import './NexusTableExportDropdown.scss';
import * as selectors from '../../../pages/avails/right-matching/rightMatchingSelectors';
import {
    RIGHTS_SELECTED_TAB,
    RIGHTS_TAB,
    PRE_PLAN_TAB,
    SELECTED_FOR_PLANNING_TAB,
    PREPLAN_REPORT,
    SELECTED_FOR_PLANNING_REPORT,
    IN_PROGRESS,
} from '../../../pages/avails/rights-repository/constants';
import {exportService} from '../../../pages/legacy/containers/avail/service/ExportService';
import {downloadFile} from '../../../util/Common';
import NexusTooltip from '../nexus-tooltip/NexusTooltip';
import {TOOLTIP_MSG_NO_RIGHTS, TOOLTIP_MSG_NO_RESULT, TOOLTIP_MSG_MAX_ROWS} from './constants';

const MAX_ROWS = 50000;

const NexusTableExportDropdown = ({
    activeTab,
    selectedRows,
    totalRows,
    rightsFilter,
    rightColumnApi,
    selectedRightColumnApi,
    selectedRightGridApi,
    prePlanColumnApi,
    prePlanGridApi,
    selectedForPlanningColumnApi,
    selectedForPlanningGridApi,
    prePlanRightsCount,
    planningRightsCount,
    mapping,
    username,
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
        if (activeTab === RIGHTS_SELECTED_TAB) {
            if (selectedRows.length === 0) {
                setTooltipContent(TOOLTIP_MSG_NO_RIGHTS);
                disable = true;
            }
        } else if ([RIGHTS_TAB, RIGHTS_SELECTED_TAB].includes(activeTab) && totalRows === 0) {
            setTooltipContent(TOOLTIP_MSG_NO_RESULT);
            disable = true;
        } else if ([RIGHTS_TAB, RIGHTS_SELECTED_TAB].includes(activeTab) && totalRows > MAX_ROWS) {
            setTooltipContent(TOOLTIP_MSG_MAX_ROWS);
            disable = true;
        } else if (activeTab === PRE_PLAN_TAB && prePlanRightsCount === 0) {
            disable = true;
        } else if (activeTab === SELECTED_FOR_PLANNING_TAB && planningRightsCount === 0) {
            disable = true;
        }
        setIsDisabled(disable);
    }, [activeTab, selectedRows, totalRows, prePlanRightsCount]);

    const getSelectedRightIds = gridApi => {
        const ids = [];
        gridApi.forEachNodeAfterFilter(node => {
            const {data = {}} = node;
            ids.push(data.id);
        });
        return ids;
    };

    const onAllColumnsExportClick = () => {
        switch (activeTab) {
            case RIGHTS_SELECTED_TAB: {
                const allDisplayedColumns = getAllDisplayedColumns(selectedRightColumnApi);
                exportService
                    .exportAvails(getSelectedRightIds(selectedRightGridApi), allDisplayedColumns)
                    .then(response => downloadFile(response));
                break;
            }
            case RIGHTS_TAB: {
                const allDisplayedColumns = getAllDisplayedColumns(rightColumnApi);
                const {external, column} = rightsFilter;
                exportService
                    .bulkExportAvails({...external, ...column}, allDisplayedColumns)
                    .then(response => downloadFile(response));
                break;
            }
            case PRE_PLAN_TAB: {
                dowloadTableReport(true, prePlanGridApi, prePlanColumnApi, PREPLAN_REPORT);
                break;
            }
            case SELECTED_FOR_PLANNING_TAB: {
                dowloadTableReport(
                    true,
                    selectedForPlanningGridApi,
                    selectedForPlanningColumnApi,
                    SELECTED_FOR_PLANNING_REPORT
                );
                break;
            }
            default:
            // no-op
        }
    };

    const onVisibleColumnsExportClick = () => {
        switch (activeTab) {
            case RIGHTS_SELECTED_TAB: {
                const visibleColumns = getDownloadableColumns(selectedRightColumnApi.getAllDisplayedColumns());
                exportService
                    .exportAvails(getSelectedRightIds(selectedRightGridApi), visibleColumns)
                    .then(response => downloadFile(response));
                break;
            }
            case RIGHTS_TAB: {
                const visibleColumns = getDownloadableColumns(rightColumnApi.getAllDisplayedColumns());
                const {external, column} = rightsFilter;
                exportService
                    .bulkExportAvails({...external, ...column}, visibleColumns)
                    .then(response => downloadFile(response));
                break;
            }
            case PRE_PLAN_TAB: {
                dowloadTableReport(false, prePlanGridApi, prePlanColumnApi, PREPLAN_REPORT);
                break;
            }
            case SELECTED_FOR_PLANNING_TAB: {
                dowloadTableReport(
                    false,
                    selectedForPlanningGridApi,
                    selectedForPlanningColumnApi,
                    SELECTED_FOR_PLANNING_REPORT
                );
                break;
            }
            default:
            // no-op
        }
    };

    const getAllDisplayedColumns = columnApi => {
        const allDisplayedColumns = getDownloadableColumns(columnApi.getAllDisplayedColumns());
        mappingColumnNames.forEach(mapCol => {
            if (!allDisplayedColumns.includes(mapCol)) {
                allDisplayedColumns.push(mapCol);
            }
        });

        return allDisplayedColumns;
    };

    const dowloadTableReport = (allColumns, gridApi, columnApi, fileName) => {
        const currentTime = new Date();
        gridApi.exportDataAsExcel({
            processCellCallback: params => {
                const {column} = params || {};
                const {colDef} = column || {};
                const {headerName} = colDef || {};
                const {value = []} = params || {};
                if (['Plan Territories', 'Selected'].includes(headerName)) {
                    return value.filter(item => item.selected).map(item => item.country);
                }
                if (headerName === 'Withdrawn') {
                    return value.filter(item => item.withdrawn).map(item => item.country);
                }
                if (headerName === 'DOP Status') {
                    return IN_PROGRESS;
                }
                return value;
            },
            fileName: `${fileName}_${username}_${currentTime.getFullYear()}-${
                currentTime.getMonth() + 1
            }-${currentTime.getDate()}`,
            columnKeys: preparePrePlanExportColumns(columnApi),
            allColumns,
        });
    };

    const getDownloadableColumns = (columns = []) => {
        const headerFields = new Set(); // no duplicates
        columns.map(({colDef: {field} = {}}) => {
            if (mappingColumnNames.includes(field)) {
                headerFields.add(field);
            }
            return null;
        });
        return Array.from(headerFields);
    };

    const preparePrePlanExportColumns = api => {
        const columns = api
            .getAllDisplayedColumns()
            .map(({colDef: {field} = {}}) => field)
            .filter(col => !['action', 'buttons'].includes(col));
        return columns;
    };

    const renderDropdown = () => {
        return (
            <DropdownMenu
                className="nexus-c-button"
                trigger={[PRE_PLAN_TAB, SELECTED_FOR_PLANNING_TAB].includes(activeTab) ? 'Download Report' : 'Export'}
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

NexusTableExportDropdown.propTypes = {
    activeTab: PropTypes.string,
    selectedRows: PropTypes.array.isRequired,
    totalRows: PropTypes.number.isRequired,
    rightsFilter: PropTypes.object.isRequired,
    rightColumnApi: PropTypes.object.isRequired,
    selectedRightGridApi: PropTypes.object.isRequired,
    selectedRightColumnApi: PropTypes.object.isRequired,
    prePlanColumnApi: PropTypes.object,
    prePlanGridApi: PropTypes.object,
    selectedForPlanningColumnApi: PropTypes.object,
    selectedForPlanningGridApi: PropTypes.object,
    mapping: PropTypes.array.isRequired,
    prePlanRightsCount: PropTypes.number,
    planningRightsCount: PropTypes.number,
    username: PropTypes.string,
};

NexusTableExportDropdown.defaultProps = {
    activeTab: RIGHTS_TAB,
    prePlanColumnApi: {},
    prePlanGridApi: {},
    selectedForPlanningColumnApi: {},
    selectedForPlanningGridApi: {},
    prePlanRightsCount: 0,
    planningRightsCount: 0,
    username: '',
};

const mapStateToProps = () => {
    const rightMatchingMappingSelector = selectors.createAvailsMappingSelector();

    return (state, props) => ({
        mapping: rightMatchingMappingSelector(state, props),
    });
};

export default connect(mapStateToProps)(NexusTableExportDropdown);
