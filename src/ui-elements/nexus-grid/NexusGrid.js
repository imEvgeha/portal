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
    headerHeight,
    rowHeight,
    ...restProps,
}) => {
    const gridApiRef = useRef();
    const onGridReady = params => {
        gridApiRef.current = params;
        const {api, columnApi} = gridApiRef.current;

        if (typeof getGridApi === 'function') {
            api.sizeColumnsToFit();
            getGridApi(api, columnApi);
        }
    };
    const onGridSizeChanged = () => {
        const {api = {}} = gridApiRef.current;
        api.sizeColumnsToFit();
    };

    return (
        <div className='nexus-c-nexus-grid ag-theme-balham'>
            <AgGridReact
                {...restProps}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                onGridSizeChanged={onGridSizeChanged}
            >
            </AgGridReact> 
        </div> 
    );
};

NexusGrid.propTypes = {
    columnDefs: PropTypes.array,
    rowData: PropTypes.array,
    getGridApi: PropTypes.func,
    headerHeight: PropTypes.number,
    rowHeight: PropTypes.number,
};

NexusGrid.defaultProps = {
    columnDefs: [],
    rowData: [],
    getGridApi: null,
    headerHeight: 52,
    rowHeight: 48,
};

export default NexusGrid;
