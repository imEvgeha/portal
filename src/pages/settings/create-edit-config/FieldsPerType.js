import React from 'react';
import {Calendar} from 'primereact/calendar';
import {InputText} from 'primereact/inputtext';
import {Controller} from 'react-hook-form';

export const constructFieldPerType = (elementSchema, form, value) => {
    return (
        <div className="col-sm-6 mb-2" key={`${elementSchema.id}_col`}>
            <div className="p-field">
                <label htmlFor={elementSchema.id}>{elementSchema.label}</label>
                <Controller
                    name={elementSchema.name}
                    key={`${elementSchema.id}_controller`}
                    control={form.control}
                    defaultValue={value}
                    rules={{...createRules(elementSchema.validWhen)}}
                    render={({field, fieldState}) => <div>{getElement(elementSchema, field, value)}</div>}
                />
            </div>
        </div>
    );
};

const getElement = (elementSchema, field, value) => {
    switch (elementSchema.type) {
        case 'text': {
            return (
                <InputText
                    key={elementSchema.id}
                    id={elementSchema.id}
                    name={elementSchema.name}
                    {...field}
                    value={value}
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
                    value={date}
                    placeholder={elementSchema.description}
                    disabled={elementSchema.disable}
                    showTime
                    showSeconds
                    showIcon
                />
            );
        }
        default:
            break;
    }
};

export const createRules = rulesSchema => {
    let rulesObj = {};
    rulesSchema &&
        Object.entries(rulesSchema).forEach(rule => {
            let newRule = {};
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
