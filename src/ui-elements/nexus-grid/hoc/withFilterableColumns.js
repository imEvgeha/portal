import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEqual from 'lodash.isequal';
import {createAvailsMappingSelector} from '../../../avails/right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../../../avails/right-matching/rightMatchingActions'; // this should be generic action not specifix one
import usePrevious from '../../../util/hooks/usePrevious';
import {switchCase} from '../../../util/Common';

const FILTERABLE_DATA_TYPES = ['string', 'number','boolean', 'select', 'multiselect'];

const DEFAULT_FILTER_OPTIONS = ['equals'];

const FILTER_TYPE = {
    string: 'agTextColumnFilter',
    number: 'agNumberColumnFilter',
};

const withFilterableColumns = filterableColumns => WrappedComponent => {
    const ComposedComponent = props => {
        const {columnDefs, mapping, createRightMatchingColumnDefs} = props;
        const previousColumnDefs = usePrevious(columnDefs);
        const [filterableColumnDefs, setFilterableColumnDefs] = useState((columnDefs && columnDefs.length) ? updateColumnDefs(columnDefs) : []);
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

        function updateColumnDefs(columnDefs) {
            const filterableColumnDefs = columnDefs.map(columnDef => {
                let copiedColumnDef = {...columnDef};
                const {dataType} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === copiedColumnDef.field))) || {};
                const isFilterable = FILTERABLE_DATA_TYPES.includes(dataType) && 
                    (filterableColumns ? filterableColumns.includes(copiedColumnDef.field) : true);
                if (isFilterable) {
                    copiedColumnDef.filterParams = {
                        filterOptions: DEFAULT_FILTER_OPTIONS,
                    };
                    copiedColumnDef.filter = switchCase(FILTER_TYPE)('agTextColumnFilter')(dataType);
                }

                return copiedColumnDef;
            });

            return filterableColumnDefs;
        }

        return (
            <WrappedComponent 
                {...props}
                columnDefs={filterableColumnDefs}
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

