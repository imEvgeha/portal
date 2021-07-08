import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {Field as AKField, CheckboxField} from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import NexusTextArea from '@vubiquity-nexus/portal-ui/lib/elements/nexus-textarea/NexusTextArea';
import {get} from 'lodash';
import {compose} from 'redux';
import ErrorBoundary from '../../../nexus-error-boundary/ErrorBoundary';
import NexusSelect from '../../../nexus-select/NexusSelect';
import {VIEWS, FIELDS_WITHOUT_LABEL, LOCALIZED_VALUE_NOT_DEFINED} from '../../constants';
import withOptionalCheckbox from '../../hoc/withOptionalCheckbox';
import {
    checkFieldDependencies,
    getFieldValue,
    getValidationFunction,
    renderLabel,
    renderError,
    createUrl,
} from '../../utils';
import CastCrew from './components/CastCrew/CastCrew';
import DateTime from './components/DateTime/DateTime';
import Licensors from './components/Licensors/Licensors';
import MsvIds from './components/MsvIds/MsvIds';
import './NexusField.scss';

const DateTimeWithOptional = compose(withOptionalCheckbox())(DateTime);

const NexusTextAreaWithOptional = compose(withOptionalCheckbox())(NexusTextArea);

const CheckboxWithOptional = compose(withOptionalCheckbox())(Checkbox);

const TextFieldWithOptional = compose(withOptionalCheckbox())(TextField);

const NexusField = ({
    isHighlighted,
    selectValues,
    path,
    type,
    view,
    tooltip,
    isRequiredVZ,
    oneIsRequiredVZ,
    formData,
    isReadOnly,
    isReadOnlyInEdit,
    isRequired,
    dependencies,
    validationError,
    validation,
    dateType,
    labels,
    optionsConfig,
    label,
    isOptional,
    maxLength,
    setFieldValue,
    useCurrentDate,
    getCurrentValues,
    isReturningTime,
    config,
    isEditable,
    isGridLayout,
    isVerticalLayout,
    searchPerson,
    castCrewConfig,
    generateMsvIds,
    setDisableSubmit,
    initialData,
    linkConfig,
    showLocalized,
    localizationConfig,
    ...props
}) => {
    const checkDependencies = type => {
        return checkFieldDependencies(type, view, dependencies, {formData, config, isEditable, getCurrentValues});
    };

    const addedProps = {
        isOptional,
        setFieldValue,
        path,
        view,
        maxLength,
    };

    const getIsReadOnly = () => {
        return (isReadOnlyInEdit && view === VIEWS.EDIT) || isReadOnly;
    };

    const dateProps = {
        isDisabled: checkDependencies('readOnly'),
        labels,
        type,
        dateType,
        isReadOnly: getIsReadOnly() || checkDependencies('readOnly'),
        useCurrentDate,
        isReturningTime,
        ...addedProps,
    };

    const disableSaveButton = () => {
        typeof setDisableSubmit === 'function' && setDisableSubmit(false);
    };

    const renderFieldEditMode = fieldProps => {
        const selectFieldProps = {...fieldProps};
        const multiselectFieldProps = {...fieldProps};
        switch (type) {
            case 'string':
            case 'stringInArray':
            case 'link':
                return <TextFieldWithOptional {...fieldProps} placeholder={`Enter ${label}`} {...addedProps} />;
            case 'textarea':
                return <NexusTextAreaWithOptional {...fieldProps} placeholder={`Enter ${label}`} {...addedProps} />;
            case 'number':
                return (
                    <TextFieldWithOptional
                        {...fieldProps}
                        type="Number"
                        placeholder={`Enter ${label}`}
                        {...addedProps}
                    />
                );
            case 'boolean':
                return (
                    <CheckboxField
                        isDisabled={getIsReadOnly() || checkDependencies('readOnly')}
                        name={fieldProps.name}
                        label={fieldProps.label}
                        defaultIsChecked={fieldProps.value}
                    >
                        {({fieldProps}) => (
                            <CheckboxWithOptional
                                isDisabled={getIsReadOnly() || checkDependencies('readOnly')}
                                {...addedProps}
                                {...fieldProps}
                                onFocus={disableSaveButton}
                            />
                        )}
                    </CheckboxField>
                );
            case 'select':
                if (get(fieldProps, 'value.value', undefined) === undefined) {
                    selectFieldProps.value = {
                        label: fieldProps.value,
                        value: fieldProps.value,
                    };
                }
                // set label to full text string (not code). label is used in select as display text
                if (/locale/i.test(fieldProps.name)) {
                    const selectVal = getValueFromSelectValues('country', fieldProps.value);
                    selectFieldProps.value =
                        typeof selectVal === 'string'
                            ? {
                                  label: selectVal,
                                  value: fieldProps.value,
                              }
                            : selectVal;
                } else if (/language/i.test(fieldProps.name)) {
                    const selectVal = getValueFromSelectValues('language', fieldProps.value);
                    selectFieldProps.value =
                        typeof selectVal === 'string'
                            ? {
                                  label: selectVal,
                                  value: fieldProps.value,
                              }
                            : selectVal;
                }

                return (
                    <NexusSelect
                        fieldProps={selectFieldProps}
                        type={type}
                        optionsConfig={optionsConfig}
                        selectValues={selectValues}
                        path={path}
                        isRequired={isRequired}
                        isMultiselect={false}
                        addedProps={addedProps}
                        defaultValue={fieldProps.value ? {value: fieldProps.value, label: fieldProps.value} : undefined}
                        optionsFilterParameter={checkDependencies('values')}
                        isCreateMode={view === VIEWS.CREATE}
                        showLocalized={showLocalized}
                    />
                );
            case 'multiselect':
                let selectLocalizedValues = null;
                let newOptionsConfig = null;
                if (
                    fieldProps.value &&
                    fieldProps.value.length &&
                    fieldProps.value[fieldProps.value.length - 1].value === undefined
                ) {
                    multiselectFieldProps.value = fieldProps.value.map(val => ({label: val, value: val}));
                }
                const emetLanguage = get(formData,'editorial.language');
                if(showLocalized === true && emetLanguage !== 'en' && !selectLocalizedValues) {
                    selectLocalizedValues = Object.assign({}, selectValues);
                        const newValues = selectLocalizedValues[path].map(item => {
                            const localLang = item.localizations.find(local => local.language === emetLanguage);
                            const enName = item.name; // name field in genre object
                            if(localLang) {
                                item.displayName = `${localLang.language}(${enName})`
                            }
                            else {
                                if(emetLanguage)
                                    item.displayName = `(${enName})*`
                                else
                                    item.displayName = enName;
                            }
                            return item;
                        });
                        selectLocalizedValues[path] = newValues;
                        // displayName is used in dropdown for display purpose only. to send to api, use "name"
                        newOptionsConfig = { defaultLabelPath: "displayName", defaultValuePath: "name"}

                }

                return (
                    <NexusSelect
                        fieldProps={multiselectFieldProps}
                        type={type}
                        optionsConfig={showLocalized === true && emetLanguage !== 'en' ? newOptionsConfig : optionsConfig}
                        selectValues={showLocalized === true && emetLanguage !== 'en' ? selectLocalizedValues : selectValues}
                        path={path}
                        isRequired={isRequired}
                        isMultiselect={true}
                        addedProps={addedProps}
                        showLocalized={showLocalized}
                        defaultValue={
                            fieldProps.value
                                ? fieldProps.value.map(val => {
                                      return {label: val, value: val};
                                  })
                                : undefined
                        }
                    />
                );
            case 'dateRange':
                return <DateTimeWithOptional {...fieldProps} {...dateProps} />;
            case 'datetime': {
                // withdrawn date is readOnly when populated (when empty, user can populate it using checkbox)
                const hasWithDrawnDate = fieldProps?.name.includes('dateWithdrawn');
                const isWithDrawnReadOnly = hasWithDrawnDate && fieldProps?.value ? true : dateProps?.isReadOnly;

                return fieldProps.value || !dateProps.isReadOnly ? (
                    <DateTimeWithOptional
                        {...fieldProps}
                        {...dateProps}
                        isReadOnly={isWithDrawnReadOnly}
                        territoryLenght={hasWithDrawnDate && formData?.territory?.length}
                    />
                ) : (
                    ''
                );
            }
            case 'castCrew':
                return (
                    <CastCrew
                        {...fieldProps}
                        persons={fieldProps.value ? fieldProps.value : []}
                        isEdit={true}
                        isVerticalLayout={isVerticalLayout}
                        searchPerson={searchPerson}
                        castCrewConfig={castCrewConfig}
                        // isVerticalLayout is used in EMET section, hence used to distinguish b/w core and emet section
                        language={isVerticalLayout ? get(formData, 'editorial.language', 'en') : 'en'}
                        {...fieldProps}
                    />
                );
            case 'licensors':
                return (
                    <Licensors
                        {...fieldProps}
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={true}
                    />
                );
            case 'msvIds':
                return (
                    <MsvIds
                        {...fieldProps}
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={true}
                        generateMsvIds={generateMsvIds}
                    />
                );
            default:
                return;
        }
    };

    const getValueFromSelectValues = (field, value) => {
        const values = selectValues?.[field] || [];
        const option = values.find(o => o[`${field}Code`] === value);
        return option?.[`${field}Name`] || value;
    };

    const hasLocalizedValue = value => {
        if(typeof value === 'string' && value.includes('(') && value.includes(')*'))
            return false;
        return true;
    }

    const getValue = fieldProps => {
        if (Array.isArray(fieldProps.value)) {
            if (fieldProps.value.length) {
                if(showLocalized) {
                    return <div>
                        {fieldProps?.value?.map((item,index) =>{
                            if(!hasLocalizedValue(item)) {
                                return (
                                <span key={index} title={LOCALIZED_VALUE_NOT_DEFINED} className="italic">
                                    {item}{index !== fieldProps?.value?.length -1 && ", "}
                                </span>
                                )
                            }
                            return <span key={index}>{item}{index !== fieldProps?.value?.length -1 && ", "} </span>
                        })}
                    </div>
                }
                return fieldProps.value.map(x => x && getFieldValue(x)).join(', ');
            }
            return <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>;
        }
        if (/country/i.test(fieldProps.name) || /locale/i.test(fieldProps.name)) {
            // the section doesn't get refreshed (rights detail) when save, hence the below check
            const val = typeof fieldProps.value === 'object' ? fieldProps.value.value : fieldProps.value;
            return getValueFromSelectValues('country', val);
        }
        if (/language/i.test(fieldProps.name)) {
            const val = typeof fieldProps.value === 'object' ? fieldProps.value.value : fieldProps.value;
            return getValueFromSelectValues('language', val);
        }
        return getFieldValue(fieldProps.value);
    };

    const renderFieldViewMode = fieldProps => {
        if (validationError) {
            return <div>{validationError}</div>;
        }
        switch (type) {
            case 'boolean':
                return <Checkbox isDisabled isChecked={fieldProps.value} />;
            case 'dateRange':
            case 'datetime':
                if (fieldProps.value) {
                    return <DateTime {...dateProps} {...fieldProps} isReadOnly />;
                }
                return <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>;
            case 'castCrew':
                return (
                    <CastCrew
                        persons={fieldProps.value ? fieldProps.value : []}
                        isEdit={false}
                        isVerticalLayout={isVerticalLayout}
                        searchPerson={searchPerson}
                        castCrewConfig={castCrewConfig}
                        // isVerticalLayout is used in EMET section, hence used to distinguish b/w core and emet section
                        language={isVerticalLayout ? get(formData, 'editorial.language', 'en') : 'en'}
                    />
                );
            case 'licensors':
                return (
                    <Licensors
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={false}
                    />
                );
            case 'msvIds':
                return (
                    <MsvIds
                        selectValues={selectValues}
                        data={fieldProps.value ? fieldProps.value : []}
                        isEdit={false}
                    />
                );
            case 'link':
                return (
                    <>
                        <a href={createUrl(linkConfig, initialData)}>
                            {fieldProps.value ? (
                                getValue(fieldProps)
                            ) : (
                                <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>
                            )}
                        </a>
                    </>
                );
            default:
                return fieldProps.value ? (
                    <div>{getValue(fieldProps)}</div>
                ) : (
                    <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>
                );
        }
    };

    const required = !!(checkDependencies('required') || isRequired);

    return (
        <ErrorBoundary>
            <div
                className={`nexus-c-field${validationError ? ' nexus-c-field--error' : ''}${
                    isHighlighted ? ' nexus-c-field--highlighted' : ''
                }`}
            >
                <AKField
                    isDisabled={getIsReadOnly() || checkDependencies('readOnly')}
                    isRequired={checkDependencies('required') || isRequired}
                    validate={value =>
                        getValidationFunction(value, validation, {type, isRequired: required, getCurrentValues})
                    }
                    {...props}
                >
                    {({fieldProps, error}) => (
                        <>
                            {!FIELDS_WITHOUT_LABEL.includes(type) &&
                                renderLabel(
                                    label,
                                    !!(checkDependencies('required') || isRequired),
                                    tooltip,
                                    isGridLayout,
                                    isRequiredVZ,
                                    oneIsRequiredVZ
                                )}
                            <div className="nexus-c-field__value-section">
                                <div className="nexus-c-field__value">
                                    {view === VIEWS.EDIT || view === VIEWS.CREATE
                                        ? renderFieldEditMode(fieldProps)
                                        : renderFieldViewMode(fieldProps)}
                                </div>
                                {error && renderError({...fieldProps}, error)}
                            </div>
                        </>
                    )}
                </AKField>
            </div>
        </ErrorBoundary>
    );
};

NexusField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    view: PropTypes.string,
    tooltip: PropTypes.string,
    formData: PropTypes.object,
    dependencies: PropTypes.array,
    isReadOnly: PropTypes.bool,
    isReadOnlyInEdit: PropTypes.bool,
    isRequired: PropTypes.bool,
    validationError: PropTypes.string,
    validation: PropTypes.array,
    optionsConfig: PropTypes.object,
    selectValues: PropTypes.object,
    path: PropTypes.any,
    dateType: PropTypes.string,
    labels: PropTypes.array,
    label: PropTypes.string,
    isOptional: PropTypes.bool,
    setFieldValue: PropTypes.func,
    // eslint-disable-next-line react/boolean-prop-naming
    useCurrentDate: PropTypes.bool,
    isHighlighted: PropTypes.bool,
    getCurrentValues: PropTypes.func.isRequired,
    isReturningTime: PropTypes.bool,
    config: PropTypes.array,
    isEditable: PropTypes.bool,
    isGridLayout: PropTypes.bool,
    isVerticalLayout: PropTypes.bool,
    searchPerson: PropTypes.func,
    generateMsvIds: PropTypes.func,
    setDisableSubmit: PropTypes.func,
    initialData: PropTypes.object,
    linkConfig: PropTypes.object,
    maxLength: PropTypes.number,
    castCrewConfig: PropTypes.object,
    isRequiredVZ: PropTypes.bool,
    oneIsRequiredVZ: PropTypes.bool,
};

NexusField.defaultProps = {
    isEditable: false,
    view: VIEWS.VIEW,
    tooltip: null,
    formData: {},
    dependencies: [],
    isReadOnly: false,
    isReadOnlyInEdit: false,
    isRequired: false,
    validationError: null,
    validation: [],
    optionsConfig: {},
    selectValues: {},
    path: null,
    dateType: '',
    labels: [],
    label: '',
    isOptional: false,
    setFieldValue: null,
    useCurrentDate: false,
    isHighlighted: false,
    isReturningTime: true,
    config: [],
    isGridLayout: false,
    isVerticalLayout: false,
    searchPerson: undefined,
    generateMsvIds: undefined,
    setDisableSubmit: undefined,
    initialData: {},
    linkConfig: {},
    castCrewConfig: {},
    maxLength: undefined,
    isRequiredVZ: false,
    oneIsRequiredVZ: false,
};

export default NexusField;
