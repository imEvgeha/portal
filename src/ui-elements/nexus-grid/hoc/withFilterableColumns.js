import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import {createAvailsMappingSelector} from '../../../avails/right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../../../avails/right-matching/rightMatchingActions'; // this should be generic action not specifix one
import usePrevious from '../../../util/hooks/usePrevious';
import {switchCase} from '../../../util/Common';
import {GRID_EVENTS} from '../constants';

const FILTERABLE_DATA_TYPES = ['string', 'number','boolean', 'select', 'multiselect'];

const DEFAULT_FILTER_PARAMS = {
    filterOptions: ['equals'],
    suppressAndOrCondition: true,
    debounceMs: 1000,
};

const FILTER_TYPE = {
    string: 'agTextColumnFilter',
    number: 'agNumberColumnFilter',
    select: 'agSetColumnFilter',
    multiSelect: 'agSetColumnFilter',
};


const withFilterableColumns = (filterableColumns, initialFilter = {}) => WrappedComponent => {
    const ComposedComponent = props => {
        const {columnDefs, mapping, createRightMatchingColumnDefs} = props;
        const previousColumnDefs = usePrevious(columnDefs);
        const [filterableColumnDefs, setFilterableColumnDefs] = useState((columnDefs && columnDefs.length) ? updateColumnDefs(columnDefs) : []);
        const [gridApi, setGridApi] = useState();
        useEffect(() => {
            if (!columnDefs || columnDefs.length === 0) {
                createRightMatchingColumnDefs(mapping);
            }
        }, [mapping, columnDefs]);

        useEffect(() => {
            if (!isEqual(previousColumnDefs, columnDefs)) {
               setFilterableColumnDefs(updateColumnDefs(columnDefs)); 
            }
        }, [columnDefs]);

        // apply initail filter
        useEffect(() => {
            if (gridApi && !isEmpty(initialFilter) && mapping.length) {
                Object.keys(initialFilter).forEach(key => {
                    const {dataType} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === key))) || {};
                    if (dataType === 'select' || dataType === 'multiSelect') {
                        const filterValues = initialFilter[key].split(',').map(el => el.trim()); 
                        applySetFilter(gridApi.getFilterInstance(key), filterValues);
                    }
                });
            } 
        }, [gridApi, mapping]);

        function updateColumnDefs(columnDefs) {
            const filterableColumnDefs = columnDefs.map(columnDef => {
                let copiedColumnDef = {...columnDef};
                const {dataType, options} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === copiedColumnDef.field))) || {};
                const isFilterable = FILTERABLE_DATA_TYPES.includes(dataType) && 
                    (filterableColumns ? filterableColumns.includes(copiedColumnDef.field) : true);
                if (isFilterable) {
                    const FILTER_PARAMS = {
                        string: DEFAULT_FILTER_PARAMS,
                        number: DEFAULT_FILTER_PARAMS,
                        select: {...DEFAULT_FILTER_PARAMS, values: options},
                        multiSelect: {...DEFAULT_FILTER_PARAMS, values: options},
                    };
                    copiedColumnDef.filter = switchCase(FILTER_TYPE)('agTextColumnFilter')(dataType);
                    copiedColumnDef.filterParams = switchCase(FILTER_PARAMS)(DEFAULT_FILTER_PARAMS)(dataType);
                }

                return copiedColumnDef;
            });

            return filterableColumnDefs;
        }

        const onGridEvent = ({type, api}) => {
            if (type === GRID_EVENTS.FIRST_DATA_RENDERED) {
                setGridApi(api);
            }
        };

        const applySetFilter = (field, values = []) => {
            // clear filter 
            field.selectNothing();
            // select values
            values.forEach(value => field.selectValue(value));
            // APPLY THE MODEL
            field.applyModel();
        };

        return (
            <WrappedComponent 
                {...props}
                columnDefs={filterableColumnDefs}
                floatingFilter={true}
                onGridEvent={onGridEvent}
            />
        );
    };

    const createMapStateToProps = () => {
        const availsMappingSelector = createAvailsMappingSelector();
        return (state, props) => ({
            mapping: availsMappingSelector(state, props),
        });
    };

    const mapDispatchToProps = (dispatch) => ({
        createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload))
    });

    return connect(createMapStateToProps, mapDispatchToProps)(ComposedComponent); // eslint-disable-line
};

export default withFilterableColumns;

