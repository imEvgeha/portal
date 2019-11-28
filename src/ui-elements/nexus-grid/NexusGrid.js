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
    handleSelectionChange,
    onGridEvent,
    ...restProps,
}) => {
    const onGridReady = params => {
        if (typeof onGridEvent === 'function') {
            onGridEvent(params);
        }
    };

    const onGridSizeChanged = () => {
        // TODO: add onGridEvent callback instead
        // api.sizeColumnsToFit();
    };

    const onSelectionChanged = (data) => {
        const {api, columnApi} = data;
        // TODO: add onGridEvent callback instead
        if (typeof handleSelectionChange === 'function') {
            handleSelectionChange(api, columnApi);
        }
        if (typeof onGridEvent === 'function') {
            onGridEvent(data);
        }
    };

    const onCellValueChanged = (data)  => {
        if (typeof onGridEvent === 'function') {
            onGridEvent(data);
        }
    };

    const isAutoHeight = ({domLayout}) => !!(domLayout && domLayout === 'autoHeight');

    return (
        <div className={
            `nexus-c-nexus-grid 
            ag-theme-balham 
            nexus-c-nexus-grid--overflow
            ${isAutoHeight(restProps) ? 'nexus-c-nexus-grid--auto-height' : ''}
        `}>
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
    handleSelectionChange: PropTypes.func,
    onGridEvent: PropTypes.func,
    // headerHeight: PropTypes.number,
    // rowHeight: PropTypes.number,
    setRowData: PropTypes.func,
};

NexusGrid.defaultProps = {
    columnDefs: [],
    rowData: [],
    handleSelectionChange: null,
    onGridEvent: null,
    // headerHeight: 52,
    // rowHeight: 48,
    setRowData: null,
};

export default NexusGrid;

