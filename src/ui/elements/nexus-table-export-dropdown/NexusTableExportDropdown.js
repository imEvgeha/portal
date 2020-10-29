import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import {connect} from 'react-redux';
import './NexusTableExportDropdown.scss';
import * as selectors from '../../../pages/avails/right-matching/rightMatchingSelectors';
import {RIGHTS_SELECTED_TAB, RIGHTS_TAB, PRE_PLAN_TAB} from '../../../pages/avails/rights-repository/constants';
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
    prePlanRightsCount,
    mapping,
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
        if (activeTab === RIGHTS_SELECTED_TAB) {
            const allDisplayedColumns = getAllDisplayedColumns(selectedRightColumnApi);
            exportService
                .exportAvails(getSelectedRightIds(selectedRightGridApi), allDisplayedColumns)
                .then(response => downloadFile(response));
        } else {
            const allDisplayedColumns = getAllDisplayedColumns(rightColumnApi);
            const {external, column} = rightsFilter;
            exportService
                .bulkExportAvails({...external, ...column}, allDisplayedColumns)
                .then(response => downloadFile(response));
        }
    };

    const onVisibleColumnsExportClick = () => {
        if (activeTab === RIGHTS_SELECTED_TAB) {
            const visibleColumns = getDownloadableColumns(selectedRightColumnApi.getAllDisplayedColumns());
            exportService
                .exportAvails(getSelectedRightIds(selectedRightGridApi), visibleColumns)
                .then(response => downloadFile(response));
        } else {
            const visibleColumns = getDownloadableColumns(rightColumnApi.getAllDisplayedColumns());
            const {external, column} = rightsFilter;
            exportService
                .bulkExportAvails({...external, ...column}, visibleColumns)
                .then(response => downloadFile(response));
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
    mapping: PropTypes.array.isRequired,
    prePlanRightsCount: PropTypes.number,
};

NexusTableExportDropdown.defaultProps = {
    activeTab: RIGHTS_TAB,
    prePlanColumnApi: {},
    prePlanGridApi: {},
    prePlanRightsCount: 0,
};

const mapStateToProps = () => {
    const rightMatchingMappingSelector = selectors.createAvailsMappingSelector();

    return (state, props) => ({
        mapping: rightMatchingMappingSelector(state, props),
    });
};

export default connect(mapStateToProps)(NexusTableExportDropdown);
