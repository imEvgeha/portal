import React, {useEffect, useState} from 'react';
import {store} from '../../../index';
import {setGridColumnsSize} from '../../../stores/actions';
import {createColumnsSizeSelector} from '../../../stores/selectors/columnsSize/columnsSizelSelectors';
import {connect} from 'react-redux';

const AG_GRID_DEF_COL_DEF = {
    resizable: true
};

const withColumnsResizing = (colDef= AG_GRID_DEF_COL_DEF) => WrappedComponent =>{
    const ComposedComponent = (props) => {
        const {columnDefs, id, existingColumnsSize} = props;
        const [columnsSize, setColumnsSize] = useState({});

        const handleColumnResized  = e => {
            if(e.finished){
                const updatedColumnsSize = {...columnsSize, [e.column.colDef.colId] : e.column.actualWidth};
                setColumnsSize(updatedColumnsSize);
                id && store.dispatch(setGridColumnsSize(id, updatedColumnsSize));
            }
        };

        return (
            <WrappedComponent
                {...props}
                defaultColDef={colDef}
                onColumnResized={handleColumnResized}
            />
        );
    };

    const createMapStateToProps = () => {
        const columnsSizeSelector = createColumnsSizeSelector();
        return (state, props) => ({
            existingColumnsSize: columnsSizeSelector(state, props),
        });
    };

    return connect(createMapStateToProps)(ComposedComponent); // eslint-disable-line
};

export default withColumnsResizing;

