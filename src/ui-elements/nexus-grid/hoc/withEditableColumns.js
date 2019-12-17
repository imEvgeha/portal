import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import SelectCellEditor from '../elements/cell-editor/SelectCellEditor';
import MultiSelectCellEditor from '../elements/cell-editor/MultiSelectCellEditor';
import DateCellEditor from '../elements/cell-editor/DateCellEditor';
import DateTimeCellEditor from '../elements/cell-editor/DateTimeCellEditor';
import {isObject} from '../../../util/Common';
import {createAvailSelectValuesSelector} from '../../../containers/avail/availSelectors';
import usePrevious from '../../../util/hooks/usePrevious';
import TerritoryCellEditor from '../elements/cell-editor/TerritoryCellEditor';

const DEFAULT_HOC_PROPS = [
    'notEditableColumns',
    'mapping',
    'selectValues',
];
const DEFAULT_EDITABLE_DATA_TYPES = [
    'string',
    'number',
    'boolean',
    'select',
    'multiselect',
    'date',
    'datetime',
    'localdate',
    'territoryType'
];
const DEFAULT_NOT_EDITABLE_COLUMNS = ['id'];

const withEditableColumns = ({
    hocProps = DEFAULT_HOC_PROPS,
    editableDataTypes = DEFAULT_EDITABLE_DATA_TYPES,
    notEditableColumns = DEFAULT_NOT_EDITABLE_COLUMNS,
} = {}) => WrappedComponent => {
    const ComposedComponent = props => {
        const {columnDefs, mapping, selectValues} = props;
        const previousSelectValues = usePrevious(selectValues);
        const previousColumnDefs = usePrevious(columnDefs);
        const [editableColumnDefs, setEditableColumnDefs] = useState(columnDefs);
        const excludedColumns = props.notEditableColumns || notEditableColumns;

        useEffect(() => {
            if (!isEqual(previousSelectValues, selectValues) || !isEqual(previousColumnDefs, columnDefs)) {
               const updatedColumnDefs = updateColumnDefs(columnDefs);
               setEditableColumnDefs(updatedColumnDefs);
            }
        }, [columnDefs, selectValues]);

        const updateColumnDefs = columnDefs => {
            const editableColumnDefs = columnDefs.map(columnDef => {
                const copiedColumnDef = {...columnDef};
                const {field} = copiedColumnDef || {};
                const {dataType, enableEdit} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === field))) || {};
                const isEditable = editableDataTypes.includes(dataType) && (excludedColumns ? !excludedColumns.includes(field) : true);
                if (enableEdit && isEditable) {
                    copiedColumnDef.editable = true;
                    switch (dataType) {
                        case 'select':
                            copiedColumnDef.cellEditorFramework = SelectCellEditor;
                            copiedColumnDef.cellEditorParams = {
                                options: getOptions(field),
                            };
                            break;
                        case 'multiselect':
                            copiedColumnDef.cellEditorFramework = MultiSelectCellEditor;
                            copiedColumnDef.cellEditorParams = {
                                options: getOptions(field),
                            };
                            break;
                        case 'boolean':
                            copiedColumnDef.cellEditorFramework = SelectCellEditor;
                            copiedColumnDef.cellEditorParams = {
                                options: [ 
                                    {label: 'Yes', value: true},
                                    {label: 'No', value: false},
                                ],
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
                        case 'territoryType':
                            copiedColumnDef.cellEditorFramework = TerritoryCellEditor;
                            break;
                    }
                }

                return copiedColumnDef;
            });

            return editableColumnDefs;
        };

        const getOptions = (field) => {
            const options = (isObject(selectValues) && selectValues[field]) || [];
            const parsedOptions = options.filter(Boolean).map(item => {
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
            return parsedOptions;
        };

        const propsWithoutHocProps = omit(props, hocProps);

        return (
            <WrappedComponent
                {...propsWithoutHocProps}
                singleClickEdit={true}
                columnDefs={editableColumnDefs}
            />
        );
    };

    const createMapStateToProps = () => {
        const availSelectValuesSelector = createAvailSelectValuesSelector();
        return (state, props) => ({
            selectValues: availSelectValuesSelector(state, props),
        });
    };

    return connect(createMapStateToProps)(ComposedComponent); // eslint-disable-line
};

export default withEditableColumns;

