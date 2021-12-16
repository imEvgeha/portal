import React from 'react';
import PropTypes from 'prop-types';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {constructFieldPerType} from '../FieldsPerType';

const DynamicArrayElement = ({elementsSchema, form, values}) => {
    const {register, control, handleSubmit, reset, watch} = useForm({
        defaultValues: {
            test: [{firstName: 'Bill', lastName: 'Luo'}],
        },
    });
    const {fields, append, prepend, remove, swap, move, insert, replace} = useFieldArray({
        control,
        name: elementsSchema.name,
    });
    const renderDynamicArray = () => {
        console.log(elementsSchema);

        return elementsSchema?.fields?.map(fieldSchema => {
            return constructFieldPerType(fieldSchema, form, values?.[fieldSchema?.name] || '', 'mb-2');
        });
    };

    console.log(fields);
    console.log(form.control);

    return (
        <div>
            {fields.map((item, index) => {
                return (
                    <li key={item.id}>
                        <Controller
                            render={({field}) => <input {...field} />}
                            name={`test.${index}.lastName`}
                            control={control}
                        />
                        <button type="button" onClick={() => append({entry: ''})}>
                            append
                        </button>
                    </li>
                );
            })}{' '}
        </div>
    );
};

DynamicArrayElement.propTypes = {
    elementsSchema: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
};

DynamicArrayElement.defaultProps = {};

export default DynamicArrayElement;
