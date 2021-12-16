import React from 'react';
import {Calendar} from 'primereact/calendar';
import {InputText} from 'primereact/inputtext';
import {Controller} from 'react-hook-form';
import DynamicArrayElement from './dynamic-array-element/DynamicArrayElement';
import DynamicDropdown from './dynamic-dropdown/DynamicDropdown';

export const constructFieldPerType = (elementSchema, form, value, className) => {
    return (
        <div className={className || 'col-sm-6 mb-2'} key={`${elementSchema.id}_col`}>
            <div className="p-field">
                <label htmlFor={elementSchema.id}>{elementSchema.label}</label>
                <Controller
                    name={elementSchema.name}
                    key={`${elementSchema.id}_controller`}
                    control={form.control}
                    defaultValue={value}
                    rules={{...createRules(!!elementSchema.required, elementSchema.validWhen)}}
                    render={({field, fieldState}) => <div>{getElement(elementSchema, field, value, form)}</div>}
                />
            </div>
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
                    // value={value}
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
            return <DynamicArrayElement elementsSchema={elementSchema.misc} form={form} values={value} />;
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
            let newRule = {required};
            switch (rule[0]) {
                case 'matchesRegEx':
                    newRule = {
                        pattern: {
                            value: rule[1].pattern,
                            message: rule[1].message,
                        },
                    };
                    rulesObj = {...rulesObj, ...newRule};
                    break;
                case 'lengthIsGreaterThan':
                    newRule = {
                        min: {
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

    return rulesObj;
};
