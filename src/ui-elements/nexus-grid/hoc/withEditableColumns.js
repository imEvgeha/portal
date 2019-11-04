import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEqual from 'lodash.isequal';
import SelectCellEditor from '../elements/cell-editor/SelectCellEditor';
import MultiSelectCellEditor from '../elements/cell-editor/MultiSelectCellEditor';
import {isObject} from '../../../util/Common';
import {createAvailSelectValuesSelector} from '../../../containers/avail/availSelectors';
import {createAvailsMappingSelector} from '../../../avails/right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../../../avails/right-matching/rightMatchingActions'; // this should be generic action not specifix one
import usePrevious from '../../../util/hooks/usePrevious';

const DEFAULT_EDITABLE_DATA_TYPES = ['string', 'number','boolean', 'select', 'multiselect'];

const withEditableColumns = (WrappedComponent, editableDataTypes = DEFAULT_EDITABLE_DATA_TYPES) => {
    const ComposedComponent = props => {
        const {columnDefs, mapping, selectValues, createRightMatchingColumnDefs} = props;
        const previousSelectValues = usePrevious(selectValues);
        const previousColumnDefs = usePrevious(columnDefs);
        const [editableColumnDefs, setEditableColumnDefs] = useState((columnDefs && columnDefs.length) ? updateColumnDefs(columnDefs) : []);
        useEffect(() => {
            if (!columnDefs || columnDefs.length === 0) {
                createRightMatchingColumnDefs(mapping);
            }
        }, [mapping, columnDefs]);

        useEffect(() => {
            if (!isEqual(previousSelectValues, selectValues) || !isEqual(previousColumnDefs, columnDefs)) {
               setEditableColumnDefs(updateColumnDefs(columnDefs)); 
            }
        }, [columnDefs, selectValues]);

        function updateColumnDefs(columnDefs) {
            const getOptions = data => {
                const result = Array.isArray(data) && data.filter(Boolean).map(({value, id}) => {
                    return {
                        label: value,
                        value,
                        key: id,
                    };
                });
                return result;
            };
            const editableColumnDefs = columnDefs.map(columnDef => {
                let copiedColumnDef = {...columnDef};
                const {dataType, enableEdit} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === copiedColumnDef.field))) || {};
                const isEditable = editableDataTypes.includes(dataType);
                if (enableEdit && isEditable) {
                    copiedColumnDef.editable = true; 
                    if (dataType === 'select') {
                        const options = (isObject(selectValues) && Array.isArray(selectValues[copiedColumnDef.field]) && selectValues[copiedColumnDef.field]) || [];
                        copiedColumnDef.cellEditorFramework = SelectCellEditor;
                        copiedColumnDef.cellEditorParams = {
                            options: getOptions(options),
                        };
                    } else if (dataType === 'multiselect') {
                        const options = (isObject(selectValues) && Array.isArray(selectValues[copiedColumnDef.field]) && selectValues[copiedColumnDef.field]) || [];
                        copiedColumnDef.cellEditorFramework = MultiSelectCellEditor;
                        copiedColumnDef.cellEditorParams = {
                            options: getOptions(options),
                        };
                    } else if (dataType === 'boolean') {
                        const options = [{label: 'Yes', value: true}, {label: 'No', value: false}];
                        copiedColumnDef.cellEditorFramework = SelectCellEditor;
                        copiedColumnDef.cellEditorParams = {
                            options,
                        };
                        // TODO: doesn't work try to find solution
                        // columnDef.cellEditorFramework = CheckboxCellEditor;
                    }
                }

                return copiedColumnDef;
            });

            return editableColumnDefs;
        }

        return (
            <WrappedComponent 
                {...props}
                columnDefs={editableColumnDefs}
            />
        );
    };

    const createMapStateToProps = () => {
        const availsMappingSelector = createAvailsMappingSelector();
        const availSelectValuesSelector = createAvailSelectValuesSelector();
        return (state, props) => ({
            mapping: availsMappingSelector(state, props),
            selectValues: availSelectValuesSelector(state, props),
        });
    };

    const mapDispatchToProps = (dispatch) => ({
        createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload))
    });

    return connect(createMapStateToProps, mapDispatchToProps)(ComposedComponent); // eslint-disable-line
};

export default withEditableColumns;
