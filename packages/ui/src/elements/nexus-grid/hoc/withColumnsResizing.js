import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {setGridColumnsSize} from '../nexusGridActions';
import {createColumnsSizeSelector} from '../nexusGridSelectors';

const AG_GRID_DEF_COL_DEF = {
    resizable: true,
};

const withColumnsResizing = ({colDef = AG_GRID_DEF_COL_DEF, defaultColDef} = {}) => WrappedComponent => {
    const ComposedComponent = props => {
        const {columnDefs, id, existingColumnsSize, updateGridColumnsSize, defaultColDef} = props;
        const existingTableColumnsSize = existingColumnsSize[id] || {};
        let columnDefsWithSizes = columnDefs;
        if (existingTableColumnsSize) {
            columnDefsWithSizes = columnDefs.map(c =>
                c.colId && existingTableColumnsSize[c.colId] ? {...c, width: existingTableColumnsSize[c.colId]} : c
            );
        }
        const [columnsSize, setColumnsSize] = useState(existingTableColumnsSize);

        const handleColumnResized = e => {
            if (e.finished && e.column) {
                const updatedColumnsSize = {...columnsSize, [e.column.colDef.colId]: e.column.actualWidth};
                setColumnsSize(updatedColumnsSize);
                id && updateGridColumnsSize(id, updatedColumnsSize);
            }
        };

        return (
            <WrappedComponent
                {...props}
                defaultColDef={{
                    ...colDef,
                    ...defaultColDef,
                }}
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

    // eslint-disable-next-line
    return connect(createMapStateToProps, mapDispatchToProps)(ComposedComponent);
};

export default withColumnsResizing;
