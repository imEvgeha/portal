import React from 'react';
import PropTypes from 'prop-types';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import {debounce} from 'lodash';
import './NexusGrid.scss';
import LoadingCellRenderer from './elements/cell-renderer/LoadingCellRenderer';
import getContextMenuItems from './elements/cell-renderer/getContextMenuItems';

const SELECTION_DELAY = 5;

const NexusGrid = ({
    columnDefs,
    rowData,
    // headerHeight,
    // rowHeight,
    onGridEvent,
    isGridHidden,
    frameworkComponents,
    ...restProps
}) => {

    const handleGridEvent = data => {
        if (typeof onGridEvent === 'function') {
            onGridEvent(data);
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
        `}
        >
            <AgGridReact
                columnDefs={columnDefs}
                getContextMenuItems={getContextMenuItems}
                rowData={rowData}
                onGridReady={handleGridEvent}
                onGridSizeChanged={onGridSizeChanged}
                onSelectionChanged={debounce(handleGridEvent, SELECTION_DELAY)}
                onCellValueChanged={handleGridEvent}
                onFirstDataRendered={handleGridEvent}
                onRowDataChanged={handleGridEvent}
                onFilterChanged={handleGridEvent}
                {...restProps}
                frameworkComponents={{
                    ...frameworkComponents,
                    loadingCellRenderer: LoadingCellRenderer
                }}
            /> 
        </div> 
    );
};

NexusGrid.propTypes = {
    columnDefs: PropTypes.array,
    rowData: PropTypes.array,
    onGridEvent: PropTypes.func,
    // headerHeight: PropTypes.number,
    // rowHeight: PropTypes.number,
    setRowData: PropTypes.func,
    isGridHidden: PropTypes.bool,
};

NexusGrid.defaultProps = {
    columnDefs: [],
    rowData: [],
    onGridEvent: null,
    // headerHeight: 52,
    // rowHeight: 48,
    setRowData: null,
    isGridHidden: false,
};

export default NexusGrid;

