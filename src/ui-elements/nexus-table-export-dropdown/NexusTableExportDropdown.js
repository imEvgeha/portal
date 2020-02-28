import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import './NexusTableExportDropdown.scss';
import {exportService} from '../../containers/avail/service/ExportService';
import {downloadFile} from '../../util/Common';
import * as selectors from '../../avails/right-matching/rightMatchingSelectors';
import NexusTooltip from '../nexus-tooltip/NexusTooltip';

function NexusTableExportDropdown({isSelectedOptionActive, selectedRows, totalRows, rightsFilter, rightColumnApi, selectedRightColumnApi, selectedRightGridApi, mapping}) {

    const [mappingColumnNames, setMappingColumnNames] = useState();
    const [tooltipContent, setTooltipContent] = useState();
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if(mapping) {
            setMappingColumnNames(mapping.map(({javaVariableName}) => javaVariableName));
        }
    }, [mapping]);

    useEffect(() => {
        let disable = false;
        if(isSelectedOptionActive) {
            if (selectedRows.length === 0) {
                setTooltipContent('Select at least one right to export');
                disable = true;
            }
        } else {
            if (totalRows === 0) {
                setTooltipContent('There is no result to export');
                disable = true;
            } else if (totalRows > 50000) {
                setTooltipContent('You have more that 50000 avails, please change filters');
                disable = true;
            }
        }
        setIsDisabled(disable);
    }, [isSelectedOptionActive, selectedRows, totalRows]);

    const getSelectedRightIds = () => {
        const ids = [];
        selectedRightGridApi.forEachNodeAfterFilter((node) => {
            const {data = {}} = node;
            ids.push(data.id);
        });
        return ids;
    };

    const onAllColumnsExportClick = () => {
        if(isSelectedOptionActive) {
            const allDisplayedColumns = getAllDisplayedColumns(selectedRightColumnApi);
            exportService.exportAvails(getSelectedRightIds(), allDisplayedColumns)
                .then(response => downloadFile(response.data));
        } else {
            const allDisplayedColumns = getAllDisplayedColumns(rightColumnApi);
            const {external, column} = rightsFilter;
            exportService.bulkExportAvails({...external, ...column}, allDisplayedColumns)
                .then(response => downloadFile(response.data));
        }
    };

    const onVisibleColumnsExportClick = () => {
        if(isSelectedOptionActive) {
            const visibleColumns = getDownloadableColumns(selectedRightColumnApi.getAllDisplayedColumns());
            exportService.exportAvails(getSelectedRightIds(), visibleColumns)
                .then(response => downloadFile(response.data));
        } else {
            const visibleColumns = getDownloadableColumns(rightColumnApi.getAllDisplayedColumns());
            const {external, column} = rightsFilter;
            exportService.bulkExportAvails({...external, ...column}, visibleColumns)
                .then(response => downloadFile(response.data));
        }
    };

    const getAllDisplayedColumns = (columnApi) => {
        let allDisplayedColumns = getDownloadableColumns(columnApi.getAllDisplayedColumns());
        mappingColumnNames.forEach(mapCol => {
            if(!allDisplayedColumns.includes(mapCol)) {
                allDisplayedColumns.push(mapCol);
            }
        });

        return allDisplayedColumns;
    };

    const getDownloadableColumns = (columns = []) => {
        return columns.map(({colDef: {field} = {}}) => field).filter(col => mappingColumnNames.includes(col));
    };

    const renderDropdown = () => (
        <DropdownMenu
            className="nexus-c-button"
            trigger="Export"
            triggerType="button"
            triggerButtonProps={{isDisabled: isDisabled}}
        >
            <DropdownItemGroup>
                <DropdownItem onClick={onAllColumnsExportClick}>All Columns</DropdownItem>
                <DropdownItem onClick={onVisibleColumnsExportClick}>Visible Columns</DropdownItem>
            </DropdownItemGroup>
        </DropdownMenu>
    );

    return (
        <div className='nexus-c-right-repository-export'>
            {isDisabled ? (
                <NexusTooltip
                    content={tooltipContent}
                    children={renderDropdown()}
                />
            ) : renderDropdown()}
        </div>
    );
}

NexusTableExportDropdown.propsTypes = {
    isSelectedOptionActive: PropTypes.bool,
    selectedRows: PropTypes.array.isRequired,
    totalRows: PropTypes.number.isRequired,
    rightsFilter: PropTypes.object.isRequired,
    rightColumnApi: PropTypes.object.isRequired,
    selectedRightGridApi: PropTypes.object.isRequired,
    selectedRightColumnApi: PropTypes.object.isRequired,
    mapping: PropTypes.object.isRequired
};

NexusTableExportDropdown.defaultProps = {
    isSelectedOptionActive: false
};

const mapStateToProps = () => {
    const rightMatchingMappingSelector = selectors.createAvailsMappingSelector();

    return (state, props) => ({
        mapping: rightMatchingMappingSelector(state, props),
    });
};

export default connect(mapStateToProps)(NexusTableExportDropdown);
