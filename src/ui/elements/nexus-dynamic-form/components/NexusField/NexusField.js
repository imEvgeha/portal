import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {Field as AKField, CheckboxField} from '@atlaskit/form';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import {get, cloneDeep} from 'lodash';
import {compose} from "redux";
import ErrorBoundary from '../../../../../pages/fallback/ErrorBoundary';
import NexusTextArea from '../../../nexus-textarea/NexusTextArea';
import {VIEWS, HIGHLIGHTED_FIELDS} from '../../constants';
import withOptional from "../../hoc/withOptional";
import {
    checkFieldDependencies,
    getFieldValue,
    getValidationFunction,
    formatOptions,
    renderLabel,
    renderError,
} from '../../utils';
import DateTime from './components/DateTime/DateTime';
import './NexusField.scss';

const DateTimeWithOptional = compose(
    withOptional(),
)(DateTime);

const NexusTextAreaWithOptional = compose(
    withOptional(),
)(NexusTextArea);

const CheckboxWithOptional = compose(
    withOptional(),
)(Checkbox);

const SelectWithOptional = compose(
    withOptional(),
)(Select);

const TextFieldWithOptional = compose(
    withOptional(),
)(TextField);

const NexusField = ({
    selectValues,
    path,
    type,
    view,
    tooltip,
    formData,
    isReadOnly,
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
    ...props
}) => {
    const [fetchedOptions, setFetchedOptions] = useState([]);

    useEffect(() => {
        if ((type === 'select' || type === 'multiselect') && optionsConfig.options === undefined) {
            if (Object.keys(selectValues).length) {
                let options = cloneDeep(selectValues[path]);
                options = formatOptions(options, optionsConfig);
                setFetchedOptions(options);
            }
        }
    }, [selectValues]);

    const checkDependencies = type => {
        return checkFieldDependencies(type, view, dependencies, formData);
    };

    const addedProps = {
        isOptional,
        setFieldValue,
        path,
        view,
    };

    const dateProps = {
        labels,
        type,
        dateType,
        isReadOnly,
        ...addedProps,
    };

    const renderFieldEditMode = fieldProps => {
        const {options} = optionsConfig;
        const selectFieldProps = {...fieldProps};
        const multiselectFieldProps = {...fieldProps};
        switch (type) {
            case 'string':
            case 'stringInArray':
                return <TextFieldWithOptional {...fieldProps} placeholder={`Enter ${label}`} {...addedProps} />;
            case 'textarea':
                return <NexusTextAreaWithOptional {...fieldProps} placeholder={`Enter ${label}`} {...addedProps} />;
            case 'number':
                return <TextFieldWithOptional {...fieldProps} type="Number" placeholder={`Enter ${label}`} {...addedProps}  />;
            case 'boolean':
                return (
                    <CheckboxField
                        isDisabled={isReadOnly || checkDependencies('readOnly')}
                        name={fieldProps.name}
                        label={fieldProps.label}
                        defaultIsChecked={fieldProps.value}
                    >
                        {({fieldProps}) => <CheckboxWithOptional {...addedProps} {...fieldProps} />}
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
                    <SelectWithOptional
                        {...selectFieldProps}
                        options={options !== undefined ? options : fetchedOptions}
                        defaultValue={fieldProps.value ? {value: fieldProps.value, label: fieldProps.value} : undefined}
                        {...addedProps}
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
                    <SelectWithOptional
                        {...multiselectFieldProps}
                        options={options !== undefined ? options : fetchedOptions}
                        isMulti
                        defaultValue={
                            fieldProps.value
                                ? fieldProps.value.map(val => {
                                      return {label: val, value: val};
                                  })
                                : undefined
                        }
                        {...addedProps}
                    />
                );
            case 'dateRange':
            case 'datetime':

                return <DateTimeWithOptional {...dateProps} {...fieldProps} />;
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
                return <Checkbox isDisabled defaultChecked={fieldProps.value} />;
            case 'dateRange':
            case 'datetime':
                if (fieldProps.value) {
                    return <DateTime {...dateProps} {...fieldProps} isReadOnly />;
                }
                return <div className="nexus-c-field__placeholder">{`Enter ${label}...`}</div>;
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
                    HIGHLIGHTED_FIELDS.includes(path) ? ' nexus-c-field--highlighted' : ''
                }`}
            >
                <AKField
                    isDisabled={isReadOnly || checkDependencies('readOnly')}
                    isRequired={checkDependencies('required') || isRequired}
                    validate={value => getValidationFunction(value, validation, {type, isRequired: required})}
                    {...props}
                >
                    {({fieldProps, error}) => (
                        <>
                            {renderLabel(label, !!(checkDependencies('required') || isRequired), tooltip)}
                            <div className="nexus-c-field__value-section">
                                <div className="nexus-c-field__value">
                                    {view === VIEWS.EDIT || view === VIEWS.CREATE
                                        ? renderFieldEditMode(fieldProps)
                                        : renderFieldViewMode(fieldProps)}
                                </div>
                                {renderError(error)}
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
};

NexusField.defaultProps = {
    view: VIEWS.VIEW,
    tooltip: null,
    formData: {},
    dependencies: [],
    isReadOnly: false,
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
};

export default NexusField;
