/* eslint-disable react/destructuring-assignment */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {isObject} from '@vubiquity-nexus/portal-utils/lib/Common';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import {isEqual, omit} from 'lodash';
import {connect} from 'react-redux';
import AudioLanguageTypeCellEditor from '../elements/cell-editor/AudioLanguageTypeCellEditor';
import DateCellEditor from '../elements/cell-editor/DateCellEditor';
import DateTimeCellEditor from '../elements/cell-editor/DateTimeCellEditor';
import DropdownCellEditor from '../elements/cell-editor/DropdownCellEditor';
import MultiSelectCellEditor from '../elements/cell-editor/MultiSelectCellEditor';
import PriceTypeCellEditor from '../elements/cell-editor/PriceTypeCellEditor';
import SelectCellEditor from '../elements/cell-editor/SelectCellEditor';
import TerritoryCellEditor from '../elements/cell-editor/TerritoryCellEditor';
import {createAvailSelectValuesSelector} from '../nexusGridSelectors';
import usePrevious from './hooks/usePrevious';

const DEFAULT_HOC_PROPS = ['notEditableColumns', 'mapping', 'selectValues'];
const DEFAULT_EDITABLE_DATA_TYPES = [
    'priceType',
    'audioLanguageType',
    'boolean',
    'multiselect',
    'dropdown',
    'number',
    'string',
    'select',
    'territoryType',
    DATETIME_FIELDS.TIMESTAMP,
    DATETIME_FIELDS.BUSINESS_DATETIME,
    DATETIME_FIELDS.REGIONAL_MIDNIGHT,
];
const DEFAULT_NOT_EDITABLE_COLUMNS = ['id'];

const withEditableColumns =
    ({
        hocProps = DEFAULT_HOC_PROPS,
        editableDataTypes = DEFAULT_EDITABLE_DATA_TYPES,
        notEditableColumns = DEFAULT_NOT_EDITABLE_COLUMNS,
    } = {}) =>
    WrappedComponent => {
        const ComposedComponent = props => {
            const {columnDefs, mapping, selectValues, id} = props || {};
            const previousSelectValues = usePrevious(selectValues);
            const previousColumnDefs = usePrevious(columnDefs);
            const [editableColumnDefs, setEditableColumnDefs] = useState(columnDefs);
            const excludedColumns = props.notEditableColumns || notEditableColumns;
            const isItPrePlanTab = ['prePlanRightsRepo', 'selectedPrePlanRightsRepo'].includes(id);

            useEffect(() => {
                if (!isEqual(previousSelectValues, selectValues) || !isEqual(previousColumnDefs, columnDefs)) {
                    const updatedColumnDefs = updateColumnDefs(columnDefs);
                    setEditableColumnDefs(updatedColumnDefs);
                }
            }, [columnDefs, selectValues]);

            const updateColumnDefs = columnDefs => {
                const copiedColumnDefs = columnDefs;
                const editableColumnDefs = copiedColumnDefs.map(columnDef => {
                    const {field, optionsKey, disabledOptionsKey} = columnDef || {};
                    const {dataType, enableEdit} =
                        (Array.isArray(mapping) && mapping.find(({javaVariableName}) => javaVariableName === field)) ||
                        {};
                    const isEditable =
                        editableDataTypes.includes(dataType) &&
                        (excludedColumns ? !excludedColumns.includes(field) : true);
                    if (enableEdit && isEditable) {
                        columnDef.editable = true;
                        switch (dataType) {
                            case 'select':
                                columnDef.cellEditorFramework = SelectCellEditor;
                                columnDef.cellEditorParams = {
                                    options: getOptions(field),
                                };
                                break;
                            case 'dropdown':
                                columnDef.cellEditorFramework = DropdownCellEditor;
                                columnDef.cellEditorParams = {
                                    optionsKey,
                                    disabledOptionsKey,
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
                                columnDef.suppressHeaderKeyboardEvent = params => params.event.key === 'Enter';
                                break;
                            case DATETIME_FIELDS.TIMESTAMP:
                            case DATETIME_FIELDS.BUSINESS_DATETIME:
                                columnDef.cellEditorFramework = DateTimeCellEditor;
                                // Check the comment above for 'date' field and PORT-1393
                                columnDef.suppressHeaderKeyboardEvent = params => params.event.key === 'Enter';
                                break;
                            case 'priceType':
                                columnDef.cellEditorFramework = PriceTypeCellEditor;
                                columnDef.cellEditorParams = {
                                    options: {
                                        priceTypes: (isObject(selectValues) && selectValues['pricing.priceType']) || [],
                                        currencies:
                                            (isObject(selectValues) && selectValues['pricing.priceCurrency']) || [],
                                    },
                                };
                                break;
                            case 'territoryType':
                                columnDef.cellEditorFramework = TerritoryCellEditor;
                                columnDef.cellEditorParams = {
                                    options: (isObject(selectValues) && selectValues[field]) || [],
                                };
                                break;
                            case 'audioLanguageType':
                                columnDef.cellEditorFramework = AudioLanguageTypeCellEditor;
                                columnDef.cellEditorParams = {
                                    options: {
                                        languages:
                                            (isObject(selectValues) && selectValues['languageAudioTypes.language']) ||
                                            [],
                                        audioTypes:
                                            (isObject(selectValues) && selectValues['languageAudioTypes.audioType']) ||
                                            [],
                                    },
                                };
                                break;
                            default:
                                break;
                        }
                    }

                    return columnDef;
                });

                return editableColumnDefs;
            };

            const getOptions = field => {
                const options = (isObject(selectValues) && selectValues[field]) || [];
                return options.filter(Boolean).map(item => {
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
            };

            const propsWithoutHocProps = omit(props, hocProps);

            return (
                <WrappedComponent
                    {...propsWithoutHocProps}
                    stopEditingWhenGridLosesFocus={true}
                    singleClickEdit={true}
                    columnDefs={isItPrePlanTab ? updateColumnDefs(columnDefs) : editableColumnDefs}
                />
            );
        };

        const createMapStateToProps = () => {
            const availSelectValuesSelector = createAvailSelectValuesSelector();
            return (state, props) => {
                const selectValues = props.selectValues || availSelectValuesSelector(state, props);
                return {
                    selectValues,
                };
            };
        };

        ComposedComponent.propTypes = {
            columnDefs: PropTypes.array.isRequired,
            mapping: PropTypes.array.isRequired,
            selectValues: PropTypes.object,
            notEditableColumns: PropTypes.array,
        };

        ComposedComponent.defaultProps = {
            selectValues: {},
            notEditableColumns: [],
        };

        return connect(createMapStateToProps)(ComposedComponent);
    };

export default withEditableColumns;
