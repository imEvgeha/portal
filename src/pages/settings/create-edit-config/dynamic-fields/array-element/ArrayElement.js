import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';
import {Panel} from 'primereact/panel';
import {arrayElementButtons} from '../ArrayButtons';
import {constructFieldPerType} from '../FieldsPerType';
import './ArrayElement.scss';

const ArrayElement = ({elementsSchema, form, values}) => {
    const isGroup = useRef(false);
    const constructFormFieldsState = () => {
        // Needed when adding new as no values still exist.
        const newConfig = [0];

        if (elementsSchema?.misc?.fields?.length > 1) {
            const group = (values?.length ? values : newConfig).map((val, index) =>
                elementsSchema?.misc?.fields.map(f => ({
                    ...f,
                    name: `${elementsSchema.name}.${index}.${f.id}`,
                }))
            );

            isGroup.current = true;
            return group;
        }

        return (Array.isArray(values) && values.length ? values : newConfig).map(
            (val, index) =>
                elementsSchema?.misc?.fields.map(f => {
                    return {...f, name: `${elementsSchema.name}.${index}`};
                })[0]
        );
    };

    const getInitHeader = () => {
        const labelPath = elementsSchema?.misc?.idAttribute;

        let tmpHeaders = {};
        if (Array.isArray(values)) {
            values &&
                values.forEach(
                    (e, i) =>
                        (tmpHeaders = {
                            ...tmpHeaders,
                            [`${elementsSchema.id}.${i}.${labelPath}`]: values?.[i]?.[labelPath],
                        })
                );
        } else {
            tmpHeaders = {[`${elementsSchema.id}.0.${labelPath}`]: values?.[labelPath]};
        }
        return tmpHeaders;
    };

    const [formFields, setFormFields] = useState(constructFormFieldsState());
    const data = useRef({});
    const fieldsRef = useRef(elementsSchema?.misc?.fields.map((f, i) => `${elementsSchema.name}.${i}`));
    const [headers, setHeaders] = useState(getInitHeader());

    const reconstructFormFields = useCallback(
        debounce(() => {
            const newFields = formFields.map((f, index) =>
                Array.isArray(f)
                    ? [...f]
                    : {
                          ...f,
                          ...(f.name && {name: `${elementsSchema.name}.${index}`}),
                      }
            );
            setFormFields(newFields);
        }, 300),
        [elementsSchema]
    );

    useEffect(() => {
        const subscription = form.watch((value, {name}) => {
            if (fieldsRef.current.includes(name)) {
                data.current = {...data.current, [name]: value[name]};
            }
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    useEffect(() => {
        reconstructFormFields();
    }, [elementsSchema]);

    const addField = () => {
        const newFields = [...formFields];
        const fieldName = `${elementsSchema.name}.${newFields.length}`;
        newFields.push({
            ...(newFields?.[0] || {}),
            type: newFields?.[0]?.type,
            name: fieldName,
        });

        fieldsRef.current = newFields.map(f => f.name);
        setFormFields(newFields);
    };

    const addGroup = () => {
        const newFields = [...formFields];
        const formFieldsTmp = [...formFields[0]];

        newFields.push(mapElementEntry(formFieldsTmp, formFields.length));

        fieldsRef.current = newFields.map(f => f.name);
        setFormFields(newFields);
    };

    const mapElementEntry = (group, index) =>
        group.map((f, i) => {
            const nameAttributes = f.name.split('.');
            const tmp = [];
            let indexFound = false;
            nameAttributes.reverse();
            for (let e of nameAttributes) {
                if (!indexFound && Number.isInteger(+e)) {
                    e = index ?? i;
                    indexFound = true;
                }
                tmp.push(e);
            }
            tmp.reverse();
            const name = tmp.join('.');

            return {...f, name};
        });

    const onRemove = (index, isGroup) => {
        let newFormFields = [...formFields];

        if (isGroup) {
            const headerKey = newFormFields[index].find(x => x.id === elementsSchema.misc.idAttribute).name;
            adjustHeaders(headerKey, index);
        }

        newFormFields.splice(index, 1);
        let formPath = isGroup ? formFields[index]?.[0].name.split('.')[0] : formFields[index]?.name?.split('.')[0];

        if (!isGroup) {
            const pathParts = formFields[index]?.name?.split('.');
            pathParts.splice(pathParts.length - 1, 1);
            formPath = pathParts.join('.');
        }

        const formValues = form?.getValues(formPath);

        Array.isArray(formValues) && formValues.splice(index, 1);
        form.setValue(formPath, formValues, {shouldDirty: true});
        fieldsRef.current = newFormFields.map(f => f.name);

        newFormFields = isGroup
            ? newFormFields.map((group, index) => mapElementEntry(group, index))
            : mapElementEntry(newFormFields, undefined);

        setFormFields(newFormFields);
    };

    const adjustHeaders = (headerKey, index) => {
        const tmpHeaders = {...headers};
        delete tmpHeaders?.[headerKey];

        let newHeaders = {};
        Object.keys(tmpHeaders).forEach(key => {
            const headerParts = key.split('.');
            const headerIndex = +headerParts[1];
            if (headerIndex >= index) {
                newHeaders = {
                    ...newHeaders,
                    [`${headerParts[0]}.${headerIndex - 1}.${headerParts[2]}`]: tmpHeaders[key],
                };
            } else {
                newHeaders = {...newHeaders, [key]: tmpHeaders[key]};
            }
        });
        setHeaders(newHeaders);
    };

    const template = (options, index) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        const labelPath = elementsSchema?.misc?.idAttribute;
        const header = (labelPath && headers?.[`${elementsSchema.id}.${index}.${labelPath}`]) || '';
        return (
            <div className="nexus-c-panel-header p-panel-header" onClick={options.onTogglerClick}>
                <div className="row">
                    <div className="col-12">
                        <i onClick={options.onTogglerClick} className={`${toggleIcon} nexus-c-panel__icon`} />
                        <span className="mx-2">{header}</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderGroupElements = group => group.map(fieldSchema => constructElement(fieldSchema));

    const renderGroups = () => {
        return formFields.map((group, index) => {
            return (
                <div className="row align-items-center my-2" key={`nexus-c-field-group${index}`}>
                    <div className="col-10">
                        <Panel
                            header="Header"
                            headerTemplate={options => template(options, index)}
                            toggleable
                            collapsed={true}
                        >
                            {renderGroupElements(group)}
                        </Panel>
                    </div>
                    {arrayElementButtons(index, formFields.length, addGroup, () => onRemove(index, true), false)}
                </div>
            );
        });
    };

    const onChange = field => {
        const labelPath = elementsSchema?.misc?.idAttribute;
        if (field?.name?.includes(labelPath) && isGroup.current) {
            const newHeaders = {...headers, [field?.name]: form?.getValues(field?.name)};
            setHeaders(newHeaders);
        }
    };

    const constructElement = fieldSchema =>
        constructFieldPerType(
            fieldSchema,
            form,
            form?.getValues(fieldSchema.name) || values?.[fieldSchema?.name] || '',
            'mb-2',
            onChange
        );

    const renderElement = fieldsIn => {
        return fieldsIn.map((fieldSchema, index) => {
            return (
                <div className="row align-items-center my-2" key={`nexus-c-field-${index}`}>
                    <div className="col-10">{constructElement(fieldSchema)}</div>
                    {arrayElementButtons(index, formFields.length, addField, () => onRemove(index, false), true)}
                </div>
            );
        });
    };

    return isGroup.current ? renderGroups() : renderElement(formFields);
};

ArrayElement.propTypes = {
    elementsSchema: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
};

ArrayElement.defaultProps = {
    values: undefined,
};

export default ArrayElement;