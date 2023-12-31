import React from 'react';
import {isEmpty} from 'lodash';
import {Calendar} from 'primereact/calendar';
import {Checkbox} from 'primereact/checkbox';
import {InputText} from 'primereact/inputtext';
import {Controller} from 'react-hook-form';
import FieldError from '../../nexus-field-error/FieldError';
import FieldLabel from '../../nexus-field-label/FieldLabel';
import ArrayElement from './array-element/ArrayElement';
import DynamicDropdown from './dynamic-dropdown/DynamicDropdown';
import DynamicElement from './dynamic-element/DynamicElement';

export const constructFieldPerType = args => {
    const {elementSchema, form, value, className, customOnChange, cb, cache, dataApi, index, values} = args;
    watchFormControls(elementSchema, form);
    const isControllerVisible = elementSchema.visible !== false;
    if (isControllerVisible === false) {
        return null;
    }
    // merging required when logic by using .required instead
    // the following logic fixes https://deljira/browse/VBQT-4780
    if (elementSchema.requiredWhen) {
        form.getFieldState(elementSchema.name).error && form.clearErrors(elementSchema.name);
        elementSchema.required = getWhenConditionValue(
            elementSchema.requiredWhen,
            getParentPathName(elementSchema),
            form,
            values
        );
    }
    // check if elementSchema is visible
    if (
        elementSchema.visibleWhen &&
        !getWhenConditionValue(elementSchema.visibleWhen, getParentPathName(elementSchema), form, values)
    ) {
        resetVisibleWhenField(value, form, elementSchema);
        return null;
    }

    return (
        <div
            className={className || (elementSchema.type === 'array' ? 'col-sm-12' : 'col-sm-6 mb-1')}
            key={`${elementSchema.id || elementSchema.name}_col${index}`}
        >
            <Controller
                name={elementSchema.name}
                key={`${elementSchema.id}_controller`}
                control={form.control}
                defaultValue={value || elementSchema.defaultValue}
                rules={{...createRules(elementSchema)}}
                render={({field, fieldState}) => {
                    const onFormElementChanged = e => {
                        field && field.onChange(e);
                        customOnChange && customOnChange(field);
                    };
                    const argsField = {elementSchema, form, value, cb, cache, dataApi};
                    return createDynamicFormField(field, fieldState, argsField, onFormElementChanged);
                }}
            />
        </div>
    );
};
const getElement = args => {
    const {elementSchema, field, value, form, onChange, cb, cache, dataApi} = args;
    switch (elementSchema.type) {
        case 'text': {
            const newField = {...field, ...(field.value === null && {value: undefined})};
            return (
                <InputText
                    key={elementSchema.id}
                    id={elementSchema.id}
                    name={elementSchema.name}
                    {...newField}
                    onKeyPress={e => {
                        e.key === 'Enter' && e.preventDefault();
                    }}
                    tooltip={elementSchema.description}
                    onChange={onChange}
                    placeholder={elementSchema.description}
                    disabled={elementSchema.disable}
                />
            );
        }
        case 'timestamp': {
            let tmpDate;
            let val;
            if (field.value) {
                tmpDate = new Date(field.value);
                val = new Date(tmpDate.toLocaleString('en-US', {timeZone: 'UTC'}));
            }
            return (
                <Calendar
                    id={elementSchema.id}
                    key={elementSchema.id}
                    {...field}
                    onChange={onChange}
                    placeholder={elementSchema.description}
                    disabled={elementSchema.disable}
                    value={val}
                    tooltip={elementSchema.description}
                    hourFormat="12"
                    showTime
                    showSeconds
                    showIcon
                    icon="po po-calendar"
                    appendTo={document.body}
                />
            );
        }
        case 'array':
            return elementSchema.dynamic ? (
                <DynamicElement
                    elementsSchema={elementSchema}
                    form={form}
                    values={value}
                    onKeysChanged={cb}
                    cache={cache}
                    dataApi={dataApi}
                />
            ) : (
                <ArrayElement
                    elementsSchema={elementSchema}
                    form={form}
                    values={value}
                    cache={cache}
                    dataApi={dataApi}
                />
            );
        case 'multiselect':
        case 'select': {
            return (
                <DynamicDropdown
                    formField={field}
                    elementSchema={elementSchema}
                    change={onChange}
                    form={form}
                    cache={cache}
                    dataApi={dataApi}
                />
            );
        }
        case 'checkbox': {
            return (
                <div className="p-checkbox-wrapper">
                    <div className="row align-items-center">
                        <div className="col-sm-4">
                            <FieldLabel
                                htmlFor={elementSchema.name}
                                label={elementSchema.label}
                                isRequired={!!elementSchema.required}
                            />
                        </div>
                        <div className="col-sm-8">
                            <Checkbox
                                {...field}
                                inputId={`${elementSchema.name}_input`}
                                name={elementSchema.name}
                                key={elementSchema.id}
                                id={elementSchema.id}
                                disabled={elementSchema.disable}
                                tooltip={elementSchema.description}
                                onChange={onChange}
                                checked={field.value}
                            />
                        </div>
                    </div>
                </div>
            );
        }
        default:
            break;
    }
};
export const createRules = elementSchema => {
    let rulesObj = {};
    elementSchema.validWhen &&
        Object.entries(elementSchema.validWhen).forEach(rule => {
            let newRule = {};
            switch (rule[0]) {
                case 'matchesRegEx':
                    newRule = {
                        pattern: {
                            value: rule?.[1]?.pattern && new RegExp(rule[1].pattern),
                            message: rule[1].message,
                        },
                    };
                    rulesObj = {...rulesObj, ...newRule};
                    break;
                case 'lengthIsGreaterThan':
                    newRule = {
                        minLength: {
                            value: rule[1].length,
                            message: rule[1].message,
                        },
                    };
                    rulesObj = {...rulesObj, ...newRule};
                    break;
                default:
                    break;
            }
        });
    if (elementSchema.required) {
        const minLength = rulesObj?.minLength;
        rulesObj = {
            ...rulesObj,
            required: minLength?.value === 0 ? minLength.message : 'Value is required',
        };
    }
    return rulesObj;
};
const createDynamicFormField = (field, fieldState, argsField, onFormElementChanged) => {
    const {elementSchema, form, value, cb, cache, dataApi} = argsField;
    const shouldShowLabel = !['checkbox', 'array'].includes(elementSchema.type) && !!elementSchema.label;
    return (
        <div className="row align-items-center">
            {shouldShowLabel && (
                <div className="col-sm-4">
                    <FieldLabel
                        htmlFor={elementSchema.id}
                        label={elementSchema.label}
                        additionalLabel={elementSchema.type === 'timestamp' ? ' (UTC)' : ''}
                        isRequired={!!elementSchema.required}
                    />
                </div>
            )}
            <div className={shouldShowLabel ? 'col-sm-8' : 'col-sm-12'}>
                <div className={!isEmpty(fieldState?.error) ? 'p-field p-field-error' : 'p-field'}>
                    {getElement({
                        elementSchema,
                        field,
                        value,
                        form,
                        onChange: onFormElementChanged,
                        cb,
                        cache,
                        dataApi,
                    })}
                    {elementSchema.type !== 'array' && <FieldError error={fieldState.error} />}
                </div>
            </div>
        </div>
    );
};
/**
 * useWatch hook is used for reRendering react form when "watched" controls change state
 * @param {*} elementSchema
 * @param form
 */
const watchFormControls = (elementSchema, form) => {
    // the following array is used for avoiding adding duplicates on form.watch() is part of fixing https://deljira/browse/VBQT-4780
    // for example we have fields on main schema which use visibleWhen and requiredWhen logic without the array we add them twice to form.watch() and this might cause infinite rerender
    const arrWatchedControls = [];
    const parentPathName = getParentPathName(elementSchema);
    elementSchema?.visibleWhen?.forEach(element => {
        const fieldNamePath = getVisibleWhenField(parentPathName, element);
        if (fieldNamePath && !arrWatchedControls.includes(fieldNamePath)) {
            arrWatchedControls.push(fieldNamePath);
            form.watch(fieldNamePath);
        }
    });
    elementSchema?.requiredWhen?.forEach(element => {
        const fieldNamePath = getVisibleWhenField(parentPathName, element);
        if (fieldNamePath && !arrWatchedControls.includes(fieldNamePath)) {
            arrWatchedControls.push(fieldNamePath);
            form.watch(fieldNamePath);
        }
    });
};
const getVisibleWhenField = (parentPathName, element) => {
    return parentPathName ? `${parentPathName}.${element.field}` : element.field;
};
const getParentPathName = elementSchema => {
    return elementSchema?.name.substr(0, elementSchema.name.lastIndexOf('.'));
};
const getWhenConditionValue = (elementSchemaCondition, parentPathName, form, formValues) => {
    let whenCondition = true;
    elementSchemaCondition.forEach(element => {
        const fieldNamePath = getVisibleWhenField(parentPathName, element);
        const fieldValue =
            form.getValues(fieldNamePath) !== undefined ? form.getValues(fieldNamePath) : formValues?.[fieldNamePath];
        if ('is' in element) {
            whenCondition = whenCondition && !!element.is.includes(fieldValue);
        }
    });
    return whenCondition;
};
const resetVisibleWhenField = (value, form, elementSchema) => {
    value !== '' && form.setValue(elementSchema.name, null, {shouldValidate: !!elementSchema.required}); // shouldValidate: !!elementSchema.required is fixing https://deljira/browse/VBQT-4780
    form.getFieldState(elementSchema.name).error &&
        form.clearErrors(elementSchema.name) &&
        form.unregister(elementSchema.name);
};
