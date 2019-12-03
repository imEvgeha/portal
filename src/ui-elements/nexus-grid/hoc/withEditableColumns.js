import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEqual from 'lodash.isequal';
import SelectCellEditor from '../elements/cell-editor/SelectCellEditor';
import MultiSelectCellEditor from '../elements/cell-editor/MultiSelectCellEditor';
import DateCellEditor from '../elements/cell-editor/DateCellEditor';
import DateTimeCellEditor from '../elements/cell-editor/DateTimeCellEditor';
import {isObject} from '../../../util/Common';
import {createAvailSelectValuesSelector} from '../../../containers/avail/availSelectors';
import {createAvailsMappingSelector} from '../../../avails/right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../../../avails/right-matching/rightMatchingActions'; // this should be generic action not specifix one
import usePrevious from '../../../util/hooks/usePrevious';

const DEFAULT_EDITABLE_DATA_TYPES = ['string', 'number','boolean', 'select', 'multiselect', 'date', 'datetime', 'localdate'];

const withEditableColumns = ({editableDataTypes = DEFAULT_EDITABLE_DATA_TYPES} = {}) => WrappedComponent => {
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
                const result = Array.isArray(data) && data.filter(Boolean).map(item => {
                    if (isObject(item)) {
                        const {value, id} = item;
                        return {
                            label: value,
                            value,
                            key: id,
                        };
                    }
                    return {
                        label: item,
                        value: item,
                        key: item,
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
                    let options;
                    switch (dataType) {
                        case 'select':
                            options = (isObject(selectValues) && Array.isArray(selectValues[copiedColumnDef.field]) && selectValues[copiedColumnDef.field]) || [];
                            copiedColumnDef.cellEditorFramework = SelectCellEditor;
                            copiedColumnDef.cellEditorParams = {
                                options: getOptions(options),
                            };
                            break;
                        case 'multiselect':
                            options = (isObject(selectValues) && Array.isArray(selectValues[copiedColumnDef.field]) && selectValues[copiedColumnDef.field]) || [];
                            copiedColumnDef.cellEditorFramework = MultiSelectCellEditor;
                            copiedColumnDef.cellEditorParams = {
                                options: getOptions(options),
                            };
                            break;
                        case 'boolean':
                            options = [{label: 'Yes', value: true}, {label: 'No', value: false}];
                            copiedColumnDef.cellEditorFramework = SelectCellEditor;
                            copiedColumnDef.cellEditorParams = {
                                options,
                            };
                            // TODO: doesn't work try to find solution
                            // columnDef.cellEditorFramework = CheckboxCellEditor;
                            break;
                        case 'date':
                            copiedColumnDef.cellEditorFramework = DateCellEditor;
                            break;
                        case 'datetime':
                        case 'localdate':
                            copiedColumnDef.cellEditorFramework = DateTimeCellEditor;
                            break;
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
