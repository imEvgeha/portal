const DEFAULT_EDITABLE_DATA_TYPES = ['string', 'number'];

const useEditableGridColumns = (columnDefs, mapping = [], editableDataTypes = DEFAULT_EDITABLE_DATA_TYPES) => {
    // TODO: add this useEffect hook to call mapping if there isn't
    const editableColumnDefs = columnDefs.map(columnDef => {
        const {dataType, enableEdit} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === columnDef.field))) || {};
        const isEditable = editableDataTypes.includes(dataType);
        if (enableEdit && isEditable) {
            columnDef.editable = true; 
        }
       return columnDef;
    });

    return editableColumnDefs;
};

export default useEditableGridColumns;

