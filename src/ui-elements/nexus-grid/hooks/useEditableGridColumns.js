import React, {useEffect} from 'react';
import SelectCellEditor from '../elements/cell-editor/SelectCellEditor';
import Select from '@atlaskit/select';
import CellEditor from '../elements/cell-editor/CellEditor';

const DEFAULT_EDITABLE_DATA_TYPES = ['string', 'number','boolean', 'select'];

const useEditableGridColumns = (columnDefs, createColumnDefs, mapping = [], selectValues = {}, onChange, editableDataTypes = DEFAULT_EDITABLE_DATA_TYPES) => {
    useEffect(() => {
        if (!columnDefs && mapping) {
            createColumnDefs(mapping);
        }
    }, [columnDefs.length, mapping]);


    const editableColumnDefs = columnDefs.map(columnDef => {
        const {dataType, enableEdit} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === columnDef.field))) || {};
        const isEditable = editableDataTypes.includes(dataType);
        if (enableEdit && isEditable) {
            columnDef.editable = true; 
            if (dataType === 'select') {
                const options = selectValues && Array.isArray(selectValues[columnDef.field]) && selectValues[columnDef.field];
                columnDef.cellEditorFramework = SelectCellEditor;
                columnDef.cellEditorParams = {
                    options: options.map(({value, id}) => {
                        return {
                            label: value,
                            value,
                            key: id,
                        };
                    })
                };
            }
        }

       return columnDef;
    });

    return editableColumnDefs;
};

export default useEditableGridColumns;

