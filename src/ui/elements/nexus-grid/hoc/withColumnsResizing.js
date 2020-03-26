import React, {useState} from 'react';
import {setGridColumnsSize} from '../../../../stores/actions';
import {createColumnsSizeSelector} from '../../../../stores/selectors/columnsSize/columnsSizelSelectors';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const AG_GRID_DEF_COL_DEF = {
    resizable: true
};

const withColumnsResizing = ({colDef= AG_GRID_DEF_COL_DEF} = {}) => WrappedComponent =>{
     const ComposedComponent = (props) => {
        const {columnDefs, id, existingColumnsSize, updateGridColumnsSize} = props;
        const existingTableColumnsSize = existingColumnsSize && id && existingColumnsSize[id] ? existingColumnsSize[id] : {};
        let columnDefsWithSizes = columnDefs;
        if(existingTableColumnsSize) {
            columnDefsWithSizes = columnDefs.map(c => c.colId && existingTableColumnsSize[c.colId] ? {...c, width: existingTableColumnsSize[c.colId]} : c);
        }
        const [columnsSize, setColumnsSize] = useState(existingTableColumnsSize);

        const handleColumnResized  = e => {
            if(e.finished){
                const updatedColumnsSize = {...columnsSize, [e.column.colDef.colId] : e.column.actualWidth};
                setColumnsSize(updatedColumnsSize);
                id && updateGridColumnsSize(id, updatedColumnsSize);
            }
        };
         return (
             <WrappedComponent
                 {...props}
                 defaultColDef={colDef}
                 onColumnResized={handleColumnResized}
                 columnDefs={columnDefsWithSizes}
             />
         );
    };

    const createMapStateToProps = () => {
        const columnsSizeSelector = createColumnsSizeSelector();
        return (state, props) => ({
            existingColumnsSize: columnsSizeSelector(state, props),
        });
    };

    const mapDispatchToProps = dispatch => ({
        updateGridColumnsSize: (id, payload) => dispatch(setGridColumnsSize(id, payload)),
    });

    ComposedComponent.propTypes = {
        ...WrappedComponent.propTypes,
        updateGridColumnsSize: PropTypes.func,
        existingColumnsSize: PropTypes.object,
    };

    ComposedComponent.defaultProps = {
        ...WrappedComponent.defaultProps,
        updateGridColumnsSize: null,
        existingColumnsSize: {},
    };

    return connect(createMapStateToProps, mapDispatchToProps)(ComposedComponent); // eslint-disable-line
};

export default withColumnsResizing;

