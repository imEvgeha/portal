import React from 'react';
import PropTypes from 'prop-types';
import {DEFAULT_SORT_ORDER, GRID_EVENTS} from '../constants';

const withSorting = (initialSort = null) => WrappedComponent => {
    const ComposedComponent = props => {
        const onColumnVisible = ({column = {}}) => {
            const {gridApi, colId} = column || {};
            const sortModel = gridApi && gridApi.getSortModel ? gridApi.getSortModel() : [];
            // Index of removed column in sortModel array. If it's not found it will be -1
            const index = sortModel.findIndex(({colId: sortColId}) => sortColId === colId);

            // If removed column was sorted, remove it from the sortModel and update it
            if (index !== -1) {
                sortModel.splice(index, 1);
                gridApi.setSortModel && gridApi.setSortModel(sortModel);
            }
        };

        const onGridEvent = (params = {}) => {
            const {api, type} = params || {};
            const {onGridEvent} = props;

            // When table is loaded, set default sortModel
            if (type === GRID_EVENTS.READY && initialSort) {
                const sortModel = api.getSortModel ? api.getSortModel() : [];
                api.setSortModel && api.setSortModel([...sortModel, initialSort]);
            }

            onGridEvent && onGridEvent(params);
        };

        const {defaultColDef = []} = props;

        return (
            <WrappedComponent
                {...props}
                defaultColDef={{
                    ...defaultColDef,
                    sortable: true,
                }}
                sortingOrder={DEFAULT_SORT_ORDER}
                onColumnVisible={onColumnVisible}
                onGridEvent={onGridEvent}
            />
        );
    };

    ComposedComponent.propTypes = {
        onGridEvent: PropTypes.func,
        defaultColDef: PropTypes.object,
    };

    ComposedComponent.defaultProps = {
        onGridEvent: () => null,
        defaultColDef: {},
    };

    return ComposedComponent;
};

export default withSorting;
