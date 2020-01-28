import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {DropdownItem, DropdownItemGroup} from '@atlaskit/dropdown-menu';
import './NexusTableExportDropdown.scss';
import {exportService} from '../../containers/avail/service/ExportService';
import {downloadFile} from '../../util/Common';
import {connect} from 'react-redux';
import * as selectors from '../../avails/right-matching/rightMatchingSelectors';

function NexusTableExportDropdown({isSelectedOptionActive, selectedRows, rightsFilter, rightColumnApi, selectedRightColumnApi, mapping}) {

    const [mappingColumnNames, setMappingColumnNames] = useState();

    useEffect(() => {
        if(mapping) {
            setMappingColumnNames(mapping.map(({javaVariableName}) => javaVariableName));
        }
    }, [mapping]);

    const onAllColumnsExportClick = () => {
        if(isSelectedOptionActive) {
            const allDisplayedColumns = getAllDisplayedColumns(selectedRightColumnApi);
            exportService.exportAvails(Object.keys(selectedRows), allDisplayedColumns)
                .then(response => downloadFile(response.data));
        } else {
            const allDisplayedColumns = getAllDisplayedColumns(rightColumnApi);
            const {external} = rightsFilter;
            exportService.bulkExportAvails(external, allDisplayedColumns)
                .then(response => downloadFile(response.data));
        }
    };

    const onVisibleColumnsExportClick = () => {
        if(isSelectedOptionActive) {
            const visibleColumns = getDownloadableColumns(selectedRightColumnApi.getAllDisplayedColumns());
            exportService.exportAvails(Object.keys(selectedRows), visibleColumns)
                .then(response => downloadFile(response.data));
        } else {
            const visibleColumns = getDownloadableColumns(rightColumnApi.getAllDisplayedColumns());
            const {external} = rightsFilter;
            exportService.bulkExportAvails(external, visibleColumns)
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
        return columns.map(({colDef}) => {
            const {field} = colDef || {};
            return field;
        }).filter(col => mappingColumnNames.includes(col));
    };

    return (
        <div className='nexus-c-right-repository-export'>
            <DropdownMenu
                trigger="Export"
                triggerType="button"
            >
                <DropdownItemGroup>
                    <DropdownItem onClick={onAllColumnsExportClick}>All Columns</DropdownItem>
                    <DropdownItem onClick={onVisibleColumnsExportClick}>Visible Columns</DropdownItem>
                </DropdownItemGroup>
            </DropdownMenu>
        </div>
    );
}

NexusTableExportDropdown.propsTypes = {
    isSelectedOptionActive: PropTypes.bool,
    selectedRows: PropTypes.object.isRequired,
    rightsFilter: PropTypes.object.isRequired,
    rightColumnApi: PropTypes.object.isRequired,
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