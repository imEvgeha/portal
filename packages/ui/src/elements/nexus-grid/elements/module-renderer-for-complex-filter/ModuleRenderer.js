import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {MultiSelect} from 'primereact/multiselect';
import ControllerWrapper from '../../../../../lib/elements/nexus-react-hook-form/ControllerWrapper';

const ModuleRenderer = ({item, formDetails}) => {
    const {errors, control, register} = formDetails;
    const options = item?.options?.[0].items;
    const labelName = item.label.toLowerCase();

    const ItemTypesSeparator = () => {
        switch (item.type) {
            case 'multiselect':
                return (
                    <ControllerWrapper
                        title={item.label}
                        inputName={item.id}
                        errors={errors[item.id]}
                        required={item.required}
                        control={control}
                        register={register}
                        additionalValidation={{
                            minLength: {
                                value: 1,
                                message: `Min length is 1!`,
                            },
                        }}
                    >
                        <MultiSelect
                            id={item.id}
                            options={options}
                            maxSelectedLabels={3}
                            placeholder={`Select a ${labelName}`}
                            appendTo="self"
                        />
                    </ControllerWrapper>
                );

            case 'select':
                return (
                    <ControllerWrapper
                        title={item.label}
                        inputName={item.id}
                        errors={errors[item.id]}
                        required={item.required}
                        control={control}
                        register={register}
                    >
                        <Dropdown
                            id={item.id}
                            options={options}
                            placeholder={`Select a ${labelName}`}
                            appendTo="self"
                        />
                    </ControllerWrapper>
                );

            case 'text':
                return (
                    <ControllerWrapper
                        title={item.label}
                        inputName={item.id}
                        errors={errors[item.id]}
                        required={item.required}
                        control={control}
                        register={register}
                    >
                        <InputText id={item.id} placeholder={`Enter a ${labelName}`} autoFocus />
                    </ControllerWrapper>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-field">
            <ItemTypesSeparator />
        </div>
    );
};

ModuleRenderer.propTypes = {
    item: PropTypes.object.isRequired,
    formDetails: PropTypes.object.isRequired,
};

export default ModuleRenderer;
