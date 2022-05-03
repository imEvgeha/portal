import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {MultiSelect} from 'primereact/multiselect';
import FieldLabel from '../../../../../lib/elements/nexus-field-label/FieldLabel';

const ModuleRenderer = ({item, selectedData, onChangeSelectedData}) => {
    const value = selectedData?.[item.id] || null;
    const options = item?.options?.[0].items;
    const labelName = item.label.toLowerCase();

    const onChange = e => {
        onChangeSelectedData({...selectedData, [item.id]: e.value});
    };

    const debouncedOnChange = useCallback(
        debounce((newValue, selectedData) => {
            onChangeSelectedData({...selectedData, [item.id]: newValue.value});
        }, 1000),
        []
    );

    const ItemTypesSeparator = () => {
        switch (item.type) {
            case 'multiselect':
                return (
                    <MultiSelect
                        id={item.id}
                        value={value}
                        options={options}
                        onChange={onChange}
                        placeholder={`Select a ${labelName}`}
                        appendTo="self"
                    />
                );

            case 'select':
                return (
                    <Dropdown
                        value={value}
                        options={options}
                        onChange={onChange}
                        placeholder={`Select a ${labelName}`}
                        appendTo="self"
                    />
                );

            case 'text':
                return (
                    <InputText
                        onChange={e => debouncedOnChange(e.target, selectedData)}
                        placeholder={`Enter a ${labelName}`}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-field">
            <FieldLabel
                htmlFor={item.id}
                label={item.label}
                isRequired={item.required}
                className="nexus-c-custom-complex-filter__label"
            />
            <ItemTypesSeparator />
        </div>
    );
};

ModuleRenderer.propTypes = {
    item: PropTypes.object.isRequired,
    selectedData: PropTypes.array,
    onChangeSelectedData: PropTypes.func.isRequired,
};

ModuleRenderer.defaultProps = {
    selectedData: [],
};

export default ModuleRenderer;
