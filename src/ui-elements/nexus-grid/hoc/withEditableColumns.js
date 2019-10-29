import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import SelectCellEditor from '../elements/cell-editor/SelectCellEditor';
import MultiSelectCellEditor from '../elements/cell-editor/MultiSelectCellEditor';
import {isObject} from '../../../util/Common';
import {createAvailSelectValuesSelector} from '../../../containers/avail/availSelectors';
import {createAvailsMappingSelector} from '../../../avails/right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../../../avails/right-matching/rightMatchingActions'; // this should be generic action not specifix one

const DEFAULT_EDITABLE_DATA_TYPES = ['string', 'number','boolean', 'select', 'multiselect'];

const withEditableColumns = (WrappedComponent, editableDataTypes = DEFAULT_EDITABLE_DATA_TYPES) => {
    const ComposedComponent = props => {
        const {columnDefs, mapping, selectValues, createRightMatchingColumnDefs} = props;
        useEffect(() => {
            if (!columnDefs || columnDefs.length === 0) {
                createRightMatchingColumnDefs(mapping);
            }
        }, [mapping, columnDefs]);

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
        const updateColumnDefs = columnDefs => {
            const editableColumnDefs = columnDefs.map(columnDef => {
                const {dataType, enableEdit} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === columnDef.field))) || {};
                const isEditable = editableDataTypes.includes(dataType);
                if (enableEdit && isEditable) {
                    columnDef.editable = true; 
                    if (dataType === 'select') {
                        const options = (isObject(selectValues) && Array.isArray(selectValues[columnDef.field]) && selectValues[columnDef.field]) || [];
                        columnDef.cellEditorFramework = SelectCellEditor;
                        columnDef.cellEditorParams = {
                            options: getOptions(options),
                        };
                    } else if (dataType === 'multiselect') {
                        const options = (isObject(selectValues) && Array.isArray(selectValues[columnDef.field]) && selectValues[columnDef.field]) || [];
                        columnDef.cellEditorFramework = MultiSelectCellEditor;
                        columnDef.cellEditorParams = {
                            options: getOptions(options),
                        };
                    } else if (dataType === 'boolean') {
                        const options = [{label: 'Yes', value: true}, {label: 'No', value: false}];
                        columnDef.cellEditorFramework = SelectCellEditor;
                        columnDef.cellEditorParams = {
                            options,
                        };
                        // TODO: doesn't work try to find solution
                        // columnDef.cellEditorFramework = CheckboxCellEditor;
                    }
                }

                return columnDef;
            });

            return editableColumnDefs;
        };

        const editableColumnDefs = columnDefs.length ? updateColumnDefs(columnDefs) : columnDefs;

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
