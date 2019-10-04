import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './NexusGrid.scss';

const NexusGrid = ({
    columnDefs,
    rowData,
    getGridApi,
    // headerHeight,
    // rowHeight,
    setRowData,
    ...restProps,
}) => {
    const gridApiRef = useRef();
    const onGridReady = params => {
        gridApiRef.current = params;
        const {api, columnApi} = gridApiRef.current;
        // api.sizeColumnsToFit();

        if (typeof getGridApi === 'function') {
            getGridApi(api, columnApi);
        }
        if (typeof setRowData === 'function') {
            setRowData(api);
            return;
        }
        api.setRowData(rowData);
    };
    const onGridSizeChanged = () => {
        // const {api = {}} = gridApiRef.current;
        // api.sizeColumnsToFit();
    };

    return (
        <div className='nexus-c-nexus-grid ag-theme-balham'>
            <AgGridReact
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                onGridSizeChanged={onGridSizeChanged}
                {...restProps}
            >
            </AgGridReact> 
        </div> 
    );
};

NexusGrid.propTypes = {
    columnDefs: PropTypes.array,
    rowData: PropTypes.array,
    getGridApi: PropTypes.func,
    // headerHeight: PropTypes.number,
    // rowHeight: PropTypes.number,
    setRowData: PropTypes.func,
};

NexusGrid.defaultProps = {
    columnDefs: [],
    rowData: [],
    getGridApi: null,
    // headerHeight: 52,
    // rowHeight: 48,
    setRowData: null,
};

export default NexusGrid;
