import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {constructFieldPerType} from '../FieldsPerType';

const DynamicArrayElement = ({elementsSchema, form, values}) => {
    const [formFields, setFormFields] = useState(
        elementsSchema?.misc?.fields.map((f, i) => ({...f, name: `${elementsSchema.name}.${i}`}))
    );
    const data = useRef({});
    const fields = useRef(elementsSchema?.misc?.fields.map((f, i) => `${elementsSchema.name}.${i}`));

    React.useEffect(() => {
        const subscription = form.watch((value, {name, type}) => {
            if (fields.current.includes(name)) {
                data.current = {...data.current, [name]: value[name]};
                // form.setValue(elementsSchema.name, Object.values(data.current));
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const addField = () => {
        const newFields = [...formFields];
        const fieldName = `${elementsSchema.name}.${newFields.length}`;
        newFields.push({
            type: elementsSchema.misc.fields[0].type,
            name: fieldName,
        });

        fields.current = newFields.map(f => f.name);
        setFormFields(newFields);
    };

    const renderDynamicArray = () => {
        return formFields.map(fieldSchema => {
            return constructFieldPerType(fieldSchema, form, values?.[fieldSchema?.name] || '', 'mb-2', {
                action: addField,
            });
        });
    };

    return renderDynamicArray();
};

DynamicArrayElement.propTypes = {
    elementsSchema: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
};

DynamicArrayElement.defaultProps = {};

export default DynamicArrayElement;
