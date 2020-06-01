import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {omit, isEqual, cloneDeep} from 'lodash';
import SelectCellEditor from '../elements/cell-editor/SelectCellEditor';
import MultiSelectCellEditor from '../elements/cell-editor/MultiSelectCellEditor';
import DateCellEditor from '../elements/cell-editor/DateCellEditor';
import DateTimeCellEditor from '../elements/cell-editor/DateTimeCellEditor';
import TerritoryCellEditor from '../elements/cell-editor/TerritoryCellEditor';
import {isObject} from '../../../../util/Common';
import usePrevious from '../../../../util/hooks/usePrevious';
import {createAvailSelectValuesSelector} from '../../../../pages/legacy/containers/avail/availSelectors';
import {DATETIME_FIELDS} from '../../../../util/DateTimeUtils';
import AudioLanguageTypeCellEditor from '../elements/cell-editor/AudioLanguageTypeCellEditor';
const DEFAULT_HOC_PROPS = [
    'notEditableColumns',
    'mapping',
    'selectValues',
];
const DEFAULT_EDITABLE_DATA_TYPES = [
    'audioLanguageType',
    'boolean',
    DATETIME_FIELDS.TIMESTAMP,
    DATETIME_FIELDS.BUSINESS_DATETIME,
    DATETIME_FIELDS.REGIONAL_MIDNIGHT,
    'multiselect',
    'number',
    'string',
    'select',
    'territoryType'
];
const DEFAULT_NOT_EDITABLE_COLUMNS = ['id'];

const withEditableColumns = ({
    hocProps = DEFAULT_HOC_PROPS,
    editableDataTypes = DEFAULT_EDITABLE_DATA_TYPES,
    notEditableColumns = DEFAULT_NOT_EDITABLE_COLUMNS,
} = {}) => WrappedComponent => {
    const ComposedComponent = (props) => {
        const {columnDefs, mapping, selectValues } = props;
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
            const copiedColumnDefs = cloneDeep(columnDefs);
            const editableColumnDefs = copiedColumnDefs.map(columnDef => {
                const {field} = columnDef || {};
                const {dataType, enableEdit} = (Array.isArray(mapping) && mapping.find((({javaVariableName}) => javaVariableName === field))) || {};
                const isEditable = editableDataTypes.includes(dataType) && (excludedColumns ? !excludedColumns.includes(field) : true);
                if (enableEdit && isEditable) {
                    columnDef.editable = true; 
                    switch (dataType) {
                        case 'select':
                            columnDef.cellEditorFramework = SelectCellEditor;
                            columnDef.cellEditorParams = {
                                options: getOptions(field),
                            };
                            break;
                        case 'multiselect':
                            columnDef.cellEditorFramework = MultiSelectCellEditor;
                            columnDef.cellEditorParams = {
                                options: getOptions(field),
                            };
                            break;
                        case 'boolean':
                            columnDef.cellEditorFramework = SelectCellEditor;
                            columnDef.cellEditorParams = {
                                options: [ 
                                    {label: 'true', value: true},
                                    {label: 'false', value: false},
                                ],
                            };
                            // TODO: doesn't work try to find solution
                            // columnDef.cellEditorFramework = CheckboxCellEditor;
                            break;
                        case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                            columnDef.cellEditorFramework = DateCellEditor;
                            // Keep Ag-Grid away from Enter key event due to AtlasKit's & Ag-Grid's
                            // mutual incompatibility where Ag-Grid kept intercepting Enter key and not passing
                            // it down to AtlasKit who requires it to set the actual value. Check PORT-1393
                            columnDef.suppressKeyboardEvent = params => params.event.key === 'Enter';
                            break;
                        case DATETIME_FIELDS.TIMESTAMP:
                        case DATETIME_FIELDS.BUSINESS_DATETIME:
                            columnDef.cellEditorFramework = DateTimeCellEditor;
                            // Check the comment above for 'date' field and PORT-1393
                            columnDef.suppressKeyboardEvent = params => params.event.key === 'Enter';
                            break;
                        case 'territoryType':
                            columnDef.cellEditorFramework = TerritoryCellEditor;
                            columnDef.cellEditorParams = {
                                options: (isObject(selectValues) && selectValues[field]) || []
                            };
                            break;
                        case 'audioLanguageType':
                            columnDef.cellEditorFramework = AudioLanguageTypeCellEditor;
                            columnDef.cellEditorParams = {
                                options: {
                                    languages: (isObject(selectValues) && selectValues['languageAudioTypes.language']) || [],
                                    audioTypes: (isObject(selectValues) && selectValues['languageAudioTypes.audioType']) || [],
                                },
                            };
                            break;
                    }
                }

                return columnDef;
            });

            return editableColumnDefs;
        };

        const getOptions = (field) => {
            const options = (isObject(selectValues) && selectValues[field]) || [];
            const parsedOptions = options.filter(Boolean).map(item => {
                if (isObject(item)) {
                    const {value, id, countryCode} = item;
                    return {
                        label: value || countryCode,
                        value: value || countryCode,
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
        return (state, props) => {
            let selectValues = props.selectValues || availSelectValuesSelector(state, props);
            return {
            selectValues,
            };
        };
    };

    return connect(createMapStateToProps)(ComposedComponent); // eslint-disable-line
};

export default withEditableColumns;

