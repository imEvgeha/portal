import React from 'react';
import PropTypes from 'prop-types';
import {getSortModel, setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {DEFAULT_SORT_ORDER, GRID_EVENTS} from '../constants';

const withSorting = (initialSort = null) => WrappedComponent => {
    const ComposedComponent = props => {
        const onColumnVisible = ({column = {}}) => {
            const {colId, columnApi} = column || {};
            const sortModel = columnApi && getSortModel(columnApi) ? getSortModel(columnApi) : [];
            // Index of removed column in sortModel array. If it's not found it will be -1
            const index = sortModel.findIndex(({colId: sortColId}) => sortColId === colId);

            // If removed column was sorted, remove it from the sortModel and update it
            if (index !== -1) {
                setSorting(null, columnApi);
            }
        };

        const onGridEvent = (params = {}) => {
            const {columnApi, type} = params || {};
            const {onGridEvent} = props;

            // When table is loaded, set default sortModel
            if ((type === GRID_EVENTS.FILTER_CHANGED || type === GRID_EVENTS.READY) && initialSort) {
                const sortModel = columnApi && getSortModel(columnApi) ? getSortModel(columnApi) : [];
                if (sortModel.length === 0) {
                    setSorting(initialSort, columnApi);
                } else {
                    setSorting(sortModel[0], columnApi);
                }
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
