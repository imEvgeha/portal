import React from 'react';
import PropTypes from 'prop-types';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './NexusGrid.scss';

const NexusGrid = ({
    columnDefs,
    rowData,
    // headerHeight,
    // rowHeight,
    handleGridReady,
    handleSelectionChange,
    onGridEvent,
    ...restProps,
}) => {
    const onGridReady = params => {
        // TODO: add onGridEvent callback instead
        const {api, columnApi} = params;
        if (typeof handleGridReady === 'function') {
            handleGridReady(api, columnApi);
        }
    };

    const onGridSizeChanged = () => {
        // TODO: add onGridEvent callback instead
        // api.sizeColumnsToFit();
    };

    const onSelectionChanged = ({api, columnApi}) => {
        // TODO: add onGridEvent callback instead
        if (typeof handleSelectionChange === 'function') {
            handleSelectionChange(api, columnApi);
        }
    };

    const onCellValueChanged = (data)  => {
        if (typeof onGridEvent === 'function') {
            onGridEvent(data);
        }
    };

    return (
        <div className='nexus-c-nexus-grid ag-theme-balham'>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                onGridReady={onGridReady}
                onGridSizeChanged={onGridSizeChanged}
                onSelectionChanged={onSelectionChanged}
                onCellValueChanged={onCellValueChanged}
                {...restProps}
            >
            </AgGridReact> 
        </div> 
    );
};

NexusGrid.propTypes = {
    columnDefs: PropTypes.array,
    rowData: PropTypes.array,
    handleGridReady: PropTypes.func,
    handleSelectionChange: PropTypes.func,
    handleGridEvent: PropTypes.func,
    // headerHeight: PropTypes.number,
    // rowHeight: PropTypes.number,
    setRowData: PropTypes.func,
};

NexusGrid.defaultProps = {
    columnDefs: [],
    rowData: [],
    handleGridReady: null,
    handleSelectionChange: null,
    handleGridEvent: null,
    // headerHeight: 52,
    // rowHeight: 48,
    setRowData: null,
};

export default NexusGrid;
