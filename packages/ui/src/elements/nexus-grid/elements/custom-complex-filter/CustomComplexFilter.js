import React, {forwardRef, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {isEmpty} from 'lodash';
import {useForm, useWatch} from 'react-hook-form';
import './CustomComplexFilter.scss';
import ModuleRenderer from '../module-renderer-for-complex-filter/ModuleRenderer';

const CustomComplexFilter = forwardRef((props, ref) => {
    const getDefaultValues = () => {
        const defaultValuesArray = props.schema.map(elem => ({label: elem.id, value: null}));
        const defaultValues = defaultValuesArray.reduce((acc, cur) => ({...acc, [cur.label]: cur.value}), {});
        return defaultValues;
    };

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: {errors, isValid, dirtyFields},
    } = useForm({
        defaultValues: getDefaultValues(),
        mode: 'onChange',
        reValidateMode: 'onTouched',
    });

    const currentValues = useWatch({control});

    const onSubmit = () => {
        props.filterChangedCallback();
    };

    // expose AG Grid Filter Lifecycle callbacks
    useImperativeHandle(ref, () => {
        const updatedValues = {};
        Object.keys(currentValues).forEach(key => {
            if (currentValues[key]) {
                updatedValues[key] = key.toLowerCase().includes('list') ? [currentValues[key]] : currentValues[key];
            }
        });

        return {
            doesFilterPass() {
                return true;
            },

            isFilterActive() {
                return !!updatedValues;
            },

            getModel() {
                if (updatedValues) {
                    return {
                        type: 'equals',
                        filter: updatedValues?.filter || updatedValues,
                    };
                }
            },
        };
    });

    const clearObjFunction = async () => {
        await reset();
        props.filterChangedCallback();
    };

    return (
        <div className="nexus-c-custom-complex-filter">
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {props.schema.map((item, index) => (
                        <ModuleRenderer
                            item={item}
                            formDetails={{errors, control, register, handleSubmit}}
                            key={index}
                        />
                    ))}
                </form>
            </div>
            <div className="nexus-c-custom-complex-filter--buttons-container">
                <Button
                    id="titleSaveBtn"
                    label="Save"
                    onClick={handleSubmit(onSubmit)}
                    loadingIcon="pi pi-spin pi-spinner"
                    className="p-button-outlined"
                    iconPos="right"
                    disabled={!isValid || isEmpty(dirtyFields)}
                />
                <Button
                    className="p-button-outlined nexus-c-custom-complex-filter--clear"
                    label="Clear"
                    onClick={clearObjFunction}
                />
            </div>
        </div>
    );
});

CustomComplexFilter.propTypes = {
    schema: PropTypes.array,
    filterChangedCallback: PropTypes.func,
};

CustomComplexFilter.defaultProps = {
    schema: [],
    filterChangedCallback: () => null,
};

export default CustomComplexFilter;
