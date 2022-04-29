import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {cloneDeep, get} from 'lodash';
import Button from '@atlaskit/button';
import {Form} from 'react-forms-processor';
import {validateAllFields} from 'react-forms-processor/dist/utilities/validation';
import {renderer as akRenderer} from 'react-forms-processor-atlaskit';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter} from 'reactstrap';
import RepeatingFormField from './custom-types/Repeats';
import RepeatingField from './custom-types/RepeatsPrimitives';
import NexusDateTimePicker from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-and-time-elements/nexus-date-time-picker/NexusDateTimePicker';
import {isObject} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getConfigApiValues} from '../../common/CommonConfigService';
import {cache} from './EndpointContainer';
import DynamicObjectType from './custom-types/DynamicObjectType';
import ObjectType from './custom-types/ObjectType';
import ObjectKey from './custom-types/ObjectKey';
import DelayedOptions from './custom-types/DelayedOptions';
import {Field as AkField} from '@atlaskit/form';
import {Restricted} from '@portal/portal-auth/permissions';

const CreateEditConfigForm = ({value, onRemoveItem, onCancel, schema, onSubmit, displayName, label}) => {
    const [val, setVal] = useState(value);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const renderer = (field, onChange, onFieldFocus, onFieldBlur) => {
        const {defaultValue, id, label, type, value, dynamic = false, misc = {}} = field;
        if (field.hasOwnProperty('disable')) {
            field.disabled = field.disable;
        }

        const fields = misc.fields || [];
        const singleField = fields.length === 1;
        let Comp;

        const addButtonLabel = misc.addButtonLabel;
        const unidentifiedLabel = misc.unidentifiedLabel;
        const noItemsMessage = misc.noItemsMessage;
        const idAttribute = misc.idAttribute;

        const currentValue = get(value, field.name, value) || get(val, field.id, defaultValue);

        if (currentValue) {
            field.defaultValue = currentValue;
            field.value = currentValue;
        } else {
            delete field.defaultValue;
            field.value = undefined;
        }
        switch (type) {
            case 'array':
                Comp = dynamic === true ? ObjectKey : singleField ? RepeatingField : RepeatingFormField;
                return (
                    <Comp
                        key={id}
                        addButtonLabel={addButtonLabel}
                        label={label}
                        onChange={value => {
                            const val =
                                singleField && Array.isArray(value)
                                    ? value.map(v => (isObject(v) ? v[idAttribute] : v))
                                    : value;
                            onChange(id, val);
                        }}
                        fields={fields}
                        unidentifiedLabel={unidentifiedLabel}
                        noItemsMessage={noItemsMessage}
                        idAttribute={idAttribute}
                        field={field}
                        defaultValue={currentValue}
                    />
                );
            case 'object':
                Comp = dynamic === true ? DynamicObjectType : ObjectType;

                return (
                    <Comp
                        key={id}
                        addButtonLabel={addButtonLabel}
                        defaultValue={value || defaultValue || []}
                        label={label}
                        onChange={value => {
                            onChange(id, value);
                        }}
                        field={field}
                        fields={fields}
                        unidentifiedLabel={unidentifiedLabel}
                        noItemsMessage={noItemsMessage}
                        idAttribute={idAttribute}
                    />
                );
            case 'timestamp':
                return (
                    <AkField label={label + ' (UTC)'} name={id} key={id}>
                        {() => (
                            <Form>
                                <NexusDateTimePicker
                                    id={id}
                                    value={value || defaultValue || ''}
                                    onChange={value => {
                                        onChange(id, value);
                                    }}
                                    isViewModeDisabled={true}
                                    hideIcon={field.disabled}
                                    isReadOnly={field.disabled}
                                    isDisabled={field.disabled}
                                    isTimestamp={true}
                                />
                            </Form>
                        )}
                    </AkField>
                );
            case 'select':
            case 'multiselect':
                return (
                    <DelayedOptions
                        key={id}
                        field={field}
                        onChange={onChange}
                        onFieldFocus={onFieldFocus}
                        onFieldBlur={onFieldBlur}
                    />
                );
            default:
                return akRenderer(field, onChange, onFieldFocus, onFieldBlur);
        }
    };

    const convertDataToOption = (dataSource, schema) => {
        let label, value;
        const {displayValueDelimiter = ' / '} = schema;
        if (Array.isArray(schema.label) && schema.label.length > 1) {
            label = schema.label.map(fieldName => dataSource[fieldName]).join(displayValueDelimiter);
        } else {
            label = dataSource[schema.label || schema.value];
        }
        if (Array.isArray(schema.value) && schema.value.length > 1) {
            value = schema.value.reduce(function (result, item) {
                result[item] = dataSource[item];
                return result;
            }, {});
        } else {
            value = dataSource[schema.value];
        }
        return {label, value};
    };

    const processOptions = (rawOptions, field) => {
        const items = rawOptions.map(rec => convertDataToOption(rec, field.source));
        return [{items}];
    };

    const getLicensees = (field, context) => {
        //needs to be moved to API side to make this generic
        const servicingRegion = get(context, 'value.servicingRegionName', '');

        if (!servicingRegion) {
            return;
        }
        if (get(cache[field.source.url], servicingRegion, '')) {
            //licensees cache is per servicing region
            if (cache[field.source.url][servicingRegion] instanceof Promise) {
                return cache[field.source.url][servicingRegion].then(() => {});
            }
            return processOptions(cache[field.source.url][servicingRegion], field);
        }
        const promiseLicensees = getConfigApiValues(
            field.source.url,
            0,
            1000,
            '',
            'servicingRegion',
            servicingRegion
        ).then(response => {
            cache[field.source.url] = {
                ...cache[field.source.url],
                [servicingRegion]: response.data,
            };
            return processOptions(response.data, field);
        });
        cache[field.source.url] = {
            ...cache[field.source.url],
            [servicingRegion]: promiseLicensees,
        };
        return promiseLicensees;
    };

    const optionsHandler = (fieldId, fields, context) => {
        const field = fields.find(({id}) => id === fieldId);
        if (field) {
            if ((field.type === 'select' || field.type === 'multiselect') && field.source) {
                if (field.name === 'licensees') {
                    //licensees needs to be filtered by selected servicing region name
                    return getLicensees(field, context);
                } else if (cache[field.source.url] === undefined) {
                    const promise = getConfigApiValues(field.source.url, 0, 1000).then(response => {
                        cache[field.source.url] = response.data;
                        return processOptions(response.data, field);
                    });
                    cache[field.source.url] = promise;
                    return promise;
                } else if (cache[field.source.url]) {
                    if (cache[field.source.url] instanceof Promise) {
                        return cache[field.source.url].then(() => {});
                    }
                    return processOptions(cache[field.source.url], field);
                } else {
                    console.error('Cannot load dropdown values from: ', field.source.url);
                }
            } else {
                if (field.type === 'array' || field.type === 'object') {
                    field.misc.fields.forEach(subfield => optionsHandler(subfield.id, field.misc.fields, context));
                }
            }
        }
        return null;
    };

    const handleDeleteItem = item => {
        onRemoveItem(item);
        onCancel();
    };

    const toggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const validationHandler = field => {
        //if regular array of objects
        if (field.type === 'array' && field.misc.fields.length > 1 && !field.dynamic) {
            //get the array
            const currentValue = get(val, field.name, []) || get(val, field.id, []);
            let isValid = true;
            let index = 0;
            //for each element of the array
            while (isValid && index < currentValue.length) {
                //create a virtual form (list of fields with schema props and values)
                let toValidate = cloneDeep(field.misc);
                toValidate.showValidationBeforeTouched = true;
                //populate all fields with current values
                for (let j = 0; j < toValidate.fields.length; j++) {
                    toValidate.fields[j].visible = true;
                    const fieldValue = currentValue[index][toValidate.fields[j].id];
                    if (fieldValue || fieldValue === 0 || fieldValue === false) {
                        toValidate.fields[j].value = fieldValue;
                    }
                }
                //validate the virtual form
                //if valid check the next object in array
                //until one invalid found or all checked
                isValid = !validateAllFields(toValidate).find(({isValid}) => !isValid);
                index++;
            }
            return isValid ? '' : 'Invalid';
        }
    };

    return (
        <Modal isOpen={!!value} toggle={onCancel} style={{paddingLeft: '30px', maxWidth: '650px'}}>
            <ModalBody>
                <p>
                    <b style={{color: '#999', fontSize: '11px', textTransform: 'uppercase'}}>{displayName}</b>
                </p>
                <p style={{marginTop: '-4px'}}>
                    <b>{value && label ? label : <i style={{fontSize: '20px', color: '#666'}}>New {displayName}</i>}</b>
                </p>
                <Restricted
                    roles={{
                        operation: 'AND',
                        values: ['configuration_admin'],
                    }}
                >
                    {Object.entries(value).length !== 0 && (
                        <div style={{position: 'absolute', top: '20px', right: '20px', cursor: 'pointer'}}>
                            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                <DropdownToggle color="light">
                                    <b>...</b>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => handleDeleteItem(value)}>Delete</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    )}
                </Restricted>
                <Form
                    renderer={(field, onChange, onFieldFocus, onFieldBlur) =>
                        renderer(field, onChange, onFieldFocus, onFieldBlur)
                    }
                    defaultFields={schema}
                    optionsHandler={optionsHandler}
                    onChange={setVal}
                    defaultValue={val}
                    validationHandler={validationHandler}
                >
                    <ModalFooter>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button appearance="primary" onClick={() => onSubmit(val)}>
                            OK
                        </Button>
                    </ModalFooter>
                </Form>
            </ModalBody>
        </Modal>
    );
};

CreateEditConfigForm.propTypes = {
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onSubmit: PropTypes.func.isRequired,
    displayName: PropTypes.string,
    label: PropTypes.string,
};

CreateEditConfigForm.defaultProps = {
    displayName: '',
    label: '',
};

export default CreateEditConfigForm;
