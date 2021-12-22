import React from 'react';
import {Button} from 'primereact/button';
import {Calendar} from 'primereact/calendar';
import {InputText} from 'primereact/inputtext';
import {Controller} from 'react-hook-form';
import DynamicArrayElement from './dynamic-array-element/DynamicArrayElement';
import DynamicDropdown from './dynamic-dropdown/DynamicDropdown';
import FieldError from './field-error/FieldError';
import FieldLabel from './field-label/FieldLabel';

export const constructFieldPerType = (elementSchema, form, value, className, buttonConfig) => {
    return (
        <div
            className={className || (elementSchema.type === 'array' ? 'col-sm-12' : 'col-sm-6 mb-1')}
            key={`${elementSchema.id || elementSchema.name}_col`}
        >
            <Controller
                name={elementSchema.name}
                key={`${elementSchema.id}_controller`}
                control={form.control}
                defaultValue={value}
                rules={{...createRules(!!elementSchema.required, elementSchema.validWhen)}}
                render={({field, fieldState}) => {
                    return (
                        <div className="row align-items-center">
                            <div className={buttonConfig ? 'col-sm-11' : 'col-sm-12'}>
                                <div className="p-field">
                                    <FieldLabel
                                        htmlFor={elementSchema.id}
                                        label={elementSchema.label}
                                        isRequired={!!elementSchema.required}
                                    />
                                    {getElement(elementSchema, field, value, form)}
                                    {elementSchema.type !== 'array' && <FieldError error={fieldState.error} />}
                                </div>
                            </div>
                            <div className="col-sm-1">
                                {!!buttonConfig && (
                                    <div className="col-sm-1">
                                        <Button
                                            className="p-button-text"
                                            icon="pi pi-plus"
                                            onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                buttonConfig.action(elementSchema);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

const getElement = (elementSchema, field, value, form) => {
    let singleField;
    let Comp;
    switch (elementSchema.type) {
        case 'text': {
            return (
                <InputText
                    key={elementSchema.id}
                    id={elementSchema.id}
                    name={elementSchema.name}
                    {...field}
                    onKeyPress={e => {
                        e.key === 'Enter' && e.preventDefault();
                    }}
                    placeholder={elementSchema.description}
                    disabled={elementSchema.disable}
                />
            );
        }
        case 'timestamp': {
            const date = new Date(value);
            return (
                <Calendar
                    id={elementSchema.id}
                    key={elementSchema.id}
                    {...field}
                    // value={date}
                    placeholder={elementSchema.description}
                    disabled={elementSchema.disable}
                    showTime
                    showSeconds
                    showIcon
                />
            );
        }
        case 'array':
            return <DynamicArrayElement elementsSchema={elementSchema} form={form} values={value} />;
        case 'multiselect':
        case 'select': {
            return <DynamicDropdown formField={field} elementSchema={elementSchema} />;
        }
        default:
            break;
    }
};

export const createRules = (required, rulesSchema) => {
    let rulesObj = {};
    rulesSchema &&
        Object.entries(rulesSchema).forEach(rule => {
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

    if (required) {
        const minLength = rulesObj?.minLength;
        rulesObj = {...rulesObj, required: minLength?.value === 0 ? minLength.message : 'Value is required'};
    }

    return rulesObj;
};
