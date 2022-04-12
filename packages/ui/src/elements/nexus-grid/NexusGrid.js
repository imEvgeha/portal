import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import './NexusGrid.scss';
import ConcatenatedTitleCellRenderer from './elements/cell-renderer/ConcatenatedTitleCellRenderer';
import IconCellRenderer from './elements/cell-renderer/IconCellRenderer';
import LoadingCellRenderer from './elements/cell-renderer/LoadingCellRenderer';
import SelectedAtCellRenderer from './elements/cell-renderer/SelectedAtCellRenderer';
import WithdrawnAtCellRenderer from './elements/cell-renderer/WithdrawnAtCellRenderer';
import WordsCellRenderer from './elements/cell-renderer/WordsCellRenderer';
import getContextMenuItems from './elements/cell-renderer/getContextMenuItems';

const NexusGrid = ({
    columnDefs,
    rowData,
    onGridEvent,
    isGridHidden,
    frameworkComponents,
    dragStopped,
    onGridReady,
    link,
    id,
    isRowSelectable,
    ...restProps
}) => {
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleGridEvent = data => {
        if (typeof onGridEvent === 'function' && isMounted.current) {
            onGridEvent(data);
        }
    };

    const onGridSizeChanged = () => {
        // TODO: add onGridEvent callback instead
        // api.sizeColumnsToFit();
    };

    const isAutoHeight = ({domLayout}) => !!(domLayout && domLayout === 'autoHeight');

    return (
        <div
            id={id}
            className={`
            ag-theme-balham ${isGridHidden ? 'd-none' : ''}
            nexus-c-nexus-grid
            nexus-c-nexus-grid--overflow
            ${isAutoHeight(restProps) ? 'nexus-c-nexus-grid--auto-height' : ''}
        `}
        >
            <AgGridReact
                columnDefs={columnDefs}
                getContextMenuItems={params => getContextMenuItems(params, link)}
                rowData={rowData}
                suppressPropertyNamesCheck
                animateRows={true}
                onGridReady={onGridReady || handleGridEvent}
                onGridSizeChanged={onGridSizeChanged}
                onSelectionChanged={handleGridEvent}
                onCellValueChanged={handleGridEvent}
                onFirstDataRendered={handleGridEvent}
                onRowDataChanged={handleGridEvent}
                onFilterChanged={handleGridEvent}
                allowDragFromColumnsToolPanel
                columnTypes={{
                    dateColumn: {},
                }}
                {...restProps}
                frameworkComponents={{
                    ...frameworkComponents,
                    loadingCellRenderer: LoadingCellRenderer,
                    concatenatedTitleCellRenderer: ConcatenatedTitleCellRenderer,
                    iconCellRenderer: IconCellRenderer,
                    selectedAtCellRenderer: SelectedAtCellRenderer,
                    wordsCellRenderer: WordsCellRenderer,
                    withdrawnAtCellRenderer: WithdrawnAtCellRenderer,
                }}
                onDragStopped={dragStopped}
                isRowSelectable={isRowSelectable}
            />
        </div>
    );
};

NexusGrid.propTypes = {
    columnDefs: PropTypes.array,
    rowData: PropTypes.array,
    onGridEvent: PropTypes.func,
    setRowData: PropTypes.func,
    isGridHidden: PropTypes.bool,
    frameworkComponents: PropTypes.object,
    dragStopped: PropTypes.func,
    onGridReady: PropTypes.func,
    link: PropTypes.string,
    id: PropTypes.string,
    isRowSelectable: PropTypes.func,
};

NexusGrid.defaultProps = {
    columnDefs: [],
    rowData: [],
    onGridEvent: null,
    setRowData: null,
    isGridHidden: false,
    frameworkComponents: {},
    dragStopped: null,
    onGridReady: null,
    link: null,
    id: '',
    isRowSelectable: null,
};

export default NexusGrid;
