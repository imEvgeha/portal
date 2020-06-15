import React from 'react';
import PropTypes from 'prop-types';
import {ErrorMessage, Field} from '@atlaskit/form';
import Select from '@atlaskit/select/Select';
import {get} from 'lodash';
import Textfield from '@atlaskit/textfield';

const RightPriceFields = ({isEdit, existingPriceList, priceIndex, priceTypeOptions, priceCurrencyOptions}) => {

    const currentPrice = Array.isArray(existingPriceList) && existingPriceList[priceIndex];
    if (currentPrice) {
        priceTypeOptions.forEach(option => {
            if (option.value === priceTypeOptions.priceType) {
                currentPrice.label = option.label
            }
        });
    }
    const errors = (currentPrice && currentPrice.errors) || [];

    const getError = (field, value, errorList = errors) => {
        const error = errorList.find(({subField}) => subField === field);
        if (error && (!value || value.label === error.message)) {
            return error;
        }
    };

    const removeExistingOptions = () => {
        return existingPriceList ? priceTypeOptions.filter(x => !existingPriceList.find(y => y.priceType === x.value)) : priceTypeOptions;
    };

    const getValidationState = (error, valid) => {
        if (!error && !valid) {
            return 'default';
        }
        if (valid === true) {
            return 'success';
        }
        return 'error';
    };

    const validate = (value) => {
        if (!value) {
            return 'EMPTY';
        }
        return undefined;
    };


    const returnValidData = data => {
        return get(existingPriceList, [priceIndex, data]) !== null;
    };

    return (
        <>
            <Field
                label="Price Type"
                isRequired
                name="priceType"
                validate={validate}
                defaultValue={
                    isEdit
                        ? {
                            label: getError('priceType') ? getError('priceType').message : (returnValidData('priceType') && currentPrice['label']),
                            value: returnValidData('priceType') && currentPrice['label']
                        } : ''
                }
            >
                {({ fieldProps: { id, ...rest }, error, meta: { valid } }) => (
                    <>
                        <Select
                            id={`select-${id}`}
                            {...rest}
                            validationState={getValidationState(error, valid)}
                            styles={{
                                control: (base) => {
                                    return getError('priceType', rest.value) ? {...base, borderColor: '#F4F5F6', backgroundColor: 'rgb(242, 222, 222)'} : {...base, borderColor: '#F4F5F7'};
                                },
                                singleValue: base => getError('priceType', rest.value) ? {...base, color: 'rgb(169, 68, 66)'} : base,
                            }}
                            isSearchable={true}
                            placeholder="Choose Type"
                            options={removeExistingOptions()}
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
            <Field
                name="priceValue"
                label="Price Value"
                isRequired
            >
                {({fieldProps: { id, ...rest }, error, meta: { valid }}) => (
                    <>
                        <Textfield
                            id={`text-${id}`}
                            {...rest}
                            defaultValue={
                                isEdit ? returnValidData('priceValue') && currentPrice['priceValue'] : ''
                            }
                            placeholder="Value"
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
            <Field
                label="Price Currency"
                isRequired
                name="priceCurrency"
                validate={validate}
                defaultValue={
                    isEdit
                        ? {
                            label: getError('priceCurrency') ? getError('priceCurrency').message : (returnValidData('priceCurrency') && currentPrice['priceCurrency']),
                            value: returnValidData('priceCurrency') && currentPrice['priceCurrency']
                        } : ''
                }
            >
                {({ fieldProps: { id, ...rest }, error, meta: { valid } }) => (
                    <>
                        <Select
                            id={`select-${id}`}
                            {...rest}
                            validationState={getValidationState(error, valid)}
                            styles={{
                                control: (base) => {
                                    return getError('priceCurrency', rest.value) ? {...base, borderColor: '#F4F5F6', backgroundColor: 'rgb(242, 222, 222)'} : {...base, borderColor: '#F4F5F7'};
                                },
                                singleValue: base => getError('priceCurrency', rest.value) ? {...base, color: 'rgb(169, 68, 66)'} : base,
                            }}
                            isSearchable={true}
                            placeholder="Choose Currency"
                            options={priceCurrencyOptions}
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
        </>
    );
};

RightPriceFields.propTypes = {
    isEdit: PropTypes.bool,
    existingPriceList: PropTypes.array,
    priceIndex: PropTypes.number,
    priceTypeOptions: PropTypes.array,
    priceCurrencyOptions : PropTypes.array
};

RightPriceFields.defaultProps = {
    isEdit: false,
    existingPriceList: [],
    priceIndex: null,
    priceTypeOptions: [],
    priceCurrencyOptions : []
};

export default RightPriceFields;
