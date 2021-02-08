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
import {VIEWS, FIELDS_WITHOUT_LABEL} from '../../constants';
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
    setFieldValue,
    useCurrentDate,
    getCurrentValues,
    isReturningTime,
    config,
    isEditable,
    isGridLayout,
    isVerticalLayout,
    searchPerson,
    generateMsvIds,
    setDisableSubmit,
    initialData,
    linkConfig,
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
        setDisableSubmit(false);
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
                    />
                );
            case 'multiselect':
                if (
                    fieldProps.value &&
                    fieldProps.value.length &&
                    fieldProps.value[fieldProps.value.length - 1].value === undefined
                ) {
                    multiselectFieldProps.value = fieldProps.value.map(val => ({label: val, value: val}));
                }
                return (
                    <NexusSelect
                        fieldProps={multiselectFieldProps}
                        type={type}
                        optionsConfig={optionsConfig}
                        selectValues={selectValues}
                        path={path}
                        isRequired={isRequired}
                        isMultiselect={true}
                        addedProps={addedProps}
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
            case 'datetime':
                return <DateTimeWithOptional {...fieldProps} {...dateProps} />;
            case 'castCrew':
                return (
                    <CastCrew
                        {...fieldProps}
                        persons={fieldProps.value ? fieldProps.value : []}
                        isEdit={true}
                        isVerticalLayout={isVerticalLayout}
                        searchPerson={searchPerson}
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

    const getValue = fieldProps => {
        if (Array.isArray(fieldProps.value)) {
            if (fieldProps.value.length) {
                return fieldProps.value.map(x => x && getFieldValue(x)).join(', ');
            }
            return <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>;
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
                                    isGridLayout
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
};

export default NexusField;
