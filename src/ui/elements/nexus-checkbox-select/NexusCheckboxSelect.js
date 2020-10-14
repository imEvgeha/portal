import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import NexusCheckboxSelectOption from './elements/NexusCheckboxSelectOption';
import NexusCheckboxSelectValueContainer from './elements/NexusCheckboxSelectValueContainer';

const selectAll = {
    label: 'Select All',
    value: '*',
};

const NexusCheckboxSelect = ({onCheckboxSelectChange, options, defaultValues, placeholder}) => {
    const [values, setValues] = useState(defaultValues);
    const optionList = options.some(el => !el.isDisabled) ? [selectAll, ...options] : options;
    useEffect(() => {
        if (defaultValues.length === options.filter(el => !el.isDisabled).length) {
            const newValues = values.some(el => !el.isDisabled) ? [...values, selectAll] : values;
            setValues(newValues);
        }
    }, []);

    const onChange = (values, event) => {
        if (event.action === 'select-option') {
            if (event.option && event.option.value === selectAll.value) {
                const result = optionList.filter(el => !el.isDisabled);
                setValues(optionList.filter(el => !el.isDisabled));
                if (typeof onCheckboxSelectChange === 'function') {
                    onCheckboxSelectChange(result.filter(el => el.value !== selectAll.value));
                }
                return;
            }
            if (values.length === options.filter(el => !el.isDisabled).length) {
                setValues([...values, selectAll]);
                if (typeof onCheckboxSelectChange === 'function') {
                    onCheckboxSelectChange(values);
                }
                return;
            }
        }
        if (event.action === 'deselect-option') {
            if (event.option && event.option.value === selectAll.value) {
                setValues([]);
                if (typeof onCheckboxSelectChange === 'function') {
                    onCheckboxSelectChange([]);
                }
                return;
            }
        }
        const filteredValues = values.filter(val => val.value !== selectAll.value);
        setValues(filteredValues);
        if (typeof onCheckboxSelectChange === 'function') {
            onCheckboxSelectChange(filteredValues);
        }
    };

    return (
        <Select
            className="checkbox-select"
            classNamePrefix="select"
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isMulti
            options={optionList}
            onChange={onChange}
            value={values}
            components={{
                Option: NexusCheckboxSelectOption,
                ValueContainer: NexusCheckboxSelectValueContainer,
            }}
            placeholder={placeholder}
        />
    );
};

NexusCheckboxSelect.propTypes = {
    defaultValues: PropTypes.array,
    options: PropTypes.array,
    onCheckboxSelectChange: PropTypes.func,
    placeholder: PropTypes.string,
};

NexusCheckboxSelect.defaultProps = {
    defaultValues: [],
    options: [],
    onCheckboxSelectChange: null,
    placeholder: 'Select',
};

export default NexusCheckboxSelect;
