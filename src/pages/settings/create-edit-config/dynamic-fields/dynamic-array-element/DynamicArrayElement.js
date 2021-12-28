import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'primereact/button';
import {Panel} from 'primereact/panel';
import {constructFieldPerType} from '../FieldsPerType';
import './DynamicArrayElement.scss';

const DynamicArrayElement = ({elementsSchema, form, values}) => {
    const isGroup = useRef(false);
    const constructFormFieldsState = () => {
        if (elementsSchema?.misc?.fields?.length > 1) {
            const group = elementsSchema?.misc?.fields.map((f, i) => ({
                ...f,
                name: `${elementsSchema.name}.${0}.${f.id}`,
            }));
            isGroup.current = true;
            return [group];
        }
        return elementsSchema?.misc?.fields.map((f, i) => ({...f, name: `${elementsSchema.name}.${i}`}));
    };

    const getInitHeader = () => {
        const labelPath = elementsSchema?.misc?.idAttribute;

        let tmpHeaders = {};
        if (Array.isArray(values)) {
            values?.forEach(
                (e, i) =>
                    (tmpHeaders = {...tmpHeaders, [`${elementsSchema.id}.${i}.${labelPath}`]: values?.[i]?.[labelPath]})
            );
        } else {
            tmpHeaders = {[`${elementsSchema.id}.0.${labelPath}`]: values?.[labelPath]};
        }
        return tmpHeaders;
    };

    const [formFields, setFormFields] = useState(constructFormFieldsState());
    const data = useRef({});
    const fields = useRef(elementsSchema?.misc?.fields.map((f, i) => `${elementsSchema.name}.${i}`));
    const [headers, setHeaders] = useState(getInitHeader());

    React.useEffect(() => {
        const subscription = form.watch((value, {name, type}) => {
            if (fields.current.includes(name)) {
                data.current = {...data.current, [name]: value[name]};
            }
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    const addField = fieldSchema => {
        const newFields = [...formFields];
        const fieldName = `${elementsSchema.name}.${newFields.length}`;
        newFields.push({
            type: fieldSchema.type,
            name: fieldName,
        });

        fields.current = newFields.map(f => f.name);
        setFormFields(newFields);
    };

    const addGroup = () => {
        const newFields = [...formFields];
        const formFieldsTmp = [...formFields[0]];

        newFields.push(
            formFieldsTmp.map(f => {
                const nameAttributes = f.name.split('.');
                const name = `${nameAttributes[0]}.${formFields.length}.${nameAttributes[2]}`;
                return {...f, name};
            })
        );

        fields.current = newFields.map(f => f.name);
        setFormFields(newFields);
    };

    const removeGroup = index => {
        let newFormFields = [...formFields];
        const headerKey = newFormFields[index].find(x => x.id === elementsSchema.misc.idAttribute).name;
        newFormFields.splice(index, 1);

        console.log(headerKey);

        const formPath = formFields[index]?.[0].name.split('.')[0];
        const formValues = form.getValues(formPath);
        formValues.splice(index, 1);
        form.setValue(formPath, formValues);

        fields.current = newFormFields.map(f => f.name);

        newFormFields = newFormFields.map((group, index) => {
            return group.map(f => {
                const nameAttributes = f.name.split('.');
                const name = `${nameAttributes[0]}.${index}.${nameAttributes[2]}`;
                return {...f, name};
            });
        });

        adjustHeaders(headerKey, index);
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

        console.log(newHeaders);
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

    const renderGroups = () => {
        const newGroups = formFields.map((group, index) => {
            return (
                <div className="row align-items-center my-2" key={`nexus-c-field-group${index}`}>
                    <div className="col-10">
                        <Panel
                            header="Header"
                            headerTemplate={options => template(options, index)}
                            toggleable
                            collapsed={true}
                        >
                            {renderDynamicArray(group)}
                        </Panel>
                    </div>
                    <div className="col-2 text-center">
                        {formFields.length > 1 && (
                            <Button
                                className="p-button-text"
                                icon="pi pi-trash"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeGroup(index);
                                }}
                            />
                        )}
                        {index === formFields.length - 1 && (
                            <Button
                                className="p-button-text"
                                icon="pi pi-plus"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addGroup(elementsSchema);
                                }}
                            />
                        )}
                    </div>
                </div>
            );
        });

        return newGroups;
    };

    const onChange = field => {
        const labelPath = elementsSchema?.misc?.idAttribute;
        if (field?.name?.includes(labelPath) && isGroup.current) {
            const newHeaders = {...headers, [field?.name]: form.getValues(field?.name)};
            setHeaders(newHeaders);
        }
    };

    const renderDynamicArray = (fieldsIn, addButton = false) => {
        const newFields = fieldsIn.map(fieldSchema => {
            return constructFieldPerType(
                fieldSchema,
                form,
                values?.[fieldSchema?.name] || undefined,
                'mb-2',
                addButton && {
                    action: addField,
                },
                onChange
            );
        });

        return newFields;
    };

    return isGroup.current ? renderGroups() : renderDynamicArray(formFields, true);
};

DynamicArrayElement.propTypes = {
    elementsSchema: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
};

DynamicArrayElement.defaultProps = {};

export default DynamicArrayElement;
