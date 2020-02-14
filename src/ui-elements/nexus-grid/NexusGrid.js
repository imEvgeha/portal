import React from 'react';
import PropTypes from 'prop-types';
import {AgGridReact} from 'ag-grid-react';
import {LicenseManager} from 'ag-grid-enterprise';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './NexusGrid.scss';
import getContextMenuItems from '../../ui-elements/nexus-grid/elements/cell-renderer/getContextMenuItems';

// TODO: it should be inside env file when we create it
const AG_GRID_LICENSE_KEY = 'QBS_Software_Ltd_on_behalf_of_Vubiquity_Management_Limited_MultiApp_4Devs25_October_2020__MTYwMzU4MDQwMDAwMA==3193ab7c187172f4a2aac1064f3d8074';
LicenseManager.setLicenseKey(AG_GRID_LICENSE_KEY);

const NexusGrid = ({
    columnDefs,
    rowData,
    // headerHeight,
    // rowHeight,
    handleSelectionChange,
    onGridEvent,
    isGridHidden,
    onFilterChanged,
    ...restProps
}) => {

    const handleGridEvent = data => {
        if (typeof onGridEvent === 'function') {
            onGridEvent(data);
        }

        // temporary condition
        if (typeof handleSelectionChange === 'function' && data.type === 'selectionChanged') {
            const {api,columnApi} = data;
            handleSelectionChange(api, columnApi);
        }

        if (typeof onFilterChanged === 'function' && data.type === 'filterChanged') {
            onFilterChanged();
        }
    };

    const onGridSizeChanged = () => {
        // TODO: add onGridEvent callback instead
        // api.sizeColumnsToFit();
    };

    const isAutoHeight = ({domLayout}) => !!(domLayout && domLayout === 'autoHeight');

    return (
        <div className={`
            ag-theme-balham ${isGridHidden ? 'd-none' : ''}
            nexus-c-nexus-grid
            nexus-c-nexus-grid--overflow
            ${isAutoHeight(restProps) ? 'nexus-c-nexus-grid--auto-height' : ''}
        `}>
            <AgGridReact
                columnDefs={columnDefs}
                getContextMenuItems={getContextMenuItems}
                rowData={rowData}
                onGridReady={handleGridEvent}
                onGridSizeChanged={onGridSizeChanged}
                onSelectionChanged={handleGridEvent}
                onCellValueChanged={handleGridEvent}
                onFirstDataRendered={handleGridEvent}
                onRowDataChanged={handleGridEvent}
                onFilterChanged={handleGridEvent}
                {...restProps}
            >
            </AgGridReact> 
        </div> 
    );
};

NexusGrid.propTypes = {
    columnDefs: PropTypes.array,
    rowData: PropTypes.array,
    handleSelectionChange: PropTypes.func,
    onGridEvent: PropTypes.func,
    // headerHeight: PropTypes.number,
    // rowHeight: PropTypes.number,
    setRowData: PropTypes.func,
    isGridHidden: PropTypes.bool,
};

NexusGrid.defaultProps = {
    columnDefs: [],
    rowData: [],
    handleSelectionChange: null,
    onGridEvent: null,
    // headerHeight: 52,
    // rowHeight: 48,
    setRowData: null,
    isGridHidden: false,
};

export default NexusGrid;

