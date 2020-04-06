import React from 'react';
import {DEFAULT_SORT, DEFAULT_SORT_ORDER, GRID_EVENTS} from '../constants';

const withSorting = () => WrappedComponent => {
    return (props) => {
        const onColumnVisible = ({column = {}}) => {
            const {gridApi, colId} = column || {};
            const sortModel = gridApi.getSortModel ? gridApi.getSortModel() : [];
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
            if (type === GRID_EVENTS.READY) {
                const {getSortModel, setSortModel} = api || {};

                // TODO: Issue when applying initial sort, getSortModel and setSortModel are
                //       valid methods from gridApi, but when called they throw an error which breaks
                //       the whole table.
                const sortModel = getSortModel ? getSortModel() : [];
                setSortModel && setSortModel([
                    ...sortModel,
                    DEFAULT_SORT,
                ]);
            }

            onGridEvent && onGridEvent(params);
        };

        return (
            <WrappedComponent
                {...props}
                defaultColDef={{
                    ...props.defaultColDef,
                    sortable: true,
                }}
                sortingOrder={DEFAULT_SORT_ORDER}
                onColumnVisible={onColumnVisible}
                // onGridReady={onGridEvent}
            />
        );
    };
};

export default withSorting;