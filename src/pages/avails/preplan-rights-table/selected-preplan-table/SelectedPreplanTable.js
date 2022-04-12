import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import {isEmpty} from 'lodash';
import {compose} from 'redux';
import {NexusGrid} from '../../../../ui/elements';
import {
    COLUMNS_TO_REORDER,
    INSERT_FROM,
    planKeywordsColumn,
    planKeywordsMapping,
    planTerritoriesColumn,
    planTerritoriesMapping,
    territoriesColumn,
    territoriesMapping,
} from '../constants';

const SelectedPreplanGrid = compose(withColumnsResizing(), withSideBar(), withEditableColumns())(NexusGrid);

const SelectedPreplanTable = ({
    columnDefs,
    mapping,
    selectedRights,
    username,
    setSelectedPrePlanRights,
    storeGridApis,
}) => {
    const [currentUserSelectedRights, setCurrentUserSelectedRights] = useState([]);
    const [gridApi, setGridApi] = useState(undefined);

    useEffect(() => {
        if (!isEmpty(selectedRights) && username && gridApi) {
            setCurrentUserSelectedRights(Object.values(selectedRights));
        }

        if (!isEmpty(selectedRights) && username && currentUserSelectedRights && gridApi?.forEachNode) {
            gridApi.forEachNode(node => node?.setSelected(true));
        }
    }, [gridApi]);

    const editedMappings = mapping
        .filter(mapping => mapping.javaVariableName !== 'territory')
        .map(mapping => {
            if (mapping.javaVariableName === 'planKeywords') {
                return {
                    ...mapping,
                    enableEdit: true,
                };
            }
            return {
                ...mapping,
                enableEdit: false,
            };
        });

    const reorderColumns = defs => {
        const updatedColumnDefs = [...defs];
        COLUMNS_TO_REORDER.forEach((colHeader, headerIndex) => {
            const index = updatedColumnDefs.findIndex(el => el.headerName === colHeader);
            if (index >= 0) {
                updatedColumnDefs.splice(INSERT_FROM + headerIndex, 0, updatedColumnDefs[index]);
                updatedColumnDefs.splice(index, 1);
            }
        });
        return updatedColumnDefs;
    };

    const onSelectedRightsRepositoryGridEvent = ({type, api, columnApi}) => {
        const {READY, SELECTION_CHANGED, FIRST_DATA_RENDERED} = GRID_EVENTS;

        switch (type) {
            case READY:
                !gridApi && setGridApi(api);
                storeGridApis(api, columnApi);
                break;
            case FIRST_DATA_RENDERED:
                api.selectAll();
                break;
            case SELECTION_CHANGED:
                setSelectedPrePlanRights(api.getSelectedRows());
                break;
            default:
                break;
        }
    };

    return (
        <SelectedPreplanGrid
            id="selectedPrePlanRightsRepo"
            singleClickEdit
            suppressRowClickSelection={true}
            notFilterableColumns={['action', 'buttons']}
            columnDefs={reorderColumns([...columnDefs, planTerritoriesColumn, territoriesColumn, planKeywordsColumn])}
            onGridEvent={onSelectedRightsRepositoryGridEvent}
            rowSelection="multiple"
            mapping={[...editedMappings, planTerritoriesMapping, territoriesMapping, planKeywordsMapping]}
            rowData={currentUserSelectedRights}
        />
    );
};

SelectedPreplanTable.propTypes = {
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    selectedRights: PropTypes.array,
    username: PropTypes.string,
    setSelectedPrePlanRights: PropTypes.func.isRequired,
    storeGridApis: PropTypes.func.isRequired,
};

SelectedPreplanTable.defaultProps = {
    columnDefs: [],
    mapping: null,
    selectedRights: [],
    username: {},
};

export default SelectedPreplanTable;
