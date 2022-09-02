import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {ErrorMessage, Field} from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import {Dropdown} from '@portal/portal-components';

const RightPriceFields = ({isEdit, existingPriceList, priceIndex, priceTypeOptions, priceCurrencyOptions}) => {
    const currentPrice = Array.isArray(existingPriceList) && existingPriceList[priceIndex];

    if (currentPrice) {
        priceTypeOptions.forEach(option => {
            if (option.value === priceTypeOptions.priceType) {
                currentPrice.label = option.label;
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

    const returnValidData = data => {
        return get(existingPriceList, [priceIndex, data]) !== null;
    };

    const shouldCurrencyBeDisabled = value => {
        return !value || value === 'Tier';
    };

    const [isCurrencyDisabled, setIsCurrencyDisabled] = useState(
        shouldCurrencyBeDisabled(returnValidData('priceType') && get(currentPrice, 'priceType'))
    );

    const [priceTypeValue, setPriceTypeValue] = useState(
        isEdit
            ? {
                  label: getError('priceType')
                      ? getError('priceType').message
                      : returnValidData('priceType') && currentPrice['label'],
                  value: returnValidData('priceType') && currentPrice['label'],
              }
            : ''
    );

    const removeExistingOptions = () => {
        return existingPriceList
            ? priceTypeOptions.filter(x => !existingPriceList.find(y => y.priceType === x.value))
            : priceTypeOptions;
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

    const validate = value => {
        if (!value) {
            return 'EMPTY';
        }
        return undefined;
    };

    return (
        <>
            <Field label="Price Type" isRequired name="priceType" validate={validate} defaultValue={priceTypeValue}>
                {({fieldProps: {id, ...rest}, error, meta: {valid}}) => (
                    <>
                        <Dropdown
                            id={`select-${id}`}
                            {...rest}
                            value={rest.value.value}
                            columnClass="col-12"
                            filter={true}
                            placeholder="Choose Type"
                            options={removeExistingOptions()}
                            onChange={e => {
                                const value = removeExistingOptions().find(x => x.value === e.value);
                                setIsCurrencyDisabled(shouldCurrencyBeDisabled(value.value));
                                setPriceTypeValue(value);
                                rest.onChange(value);
                            }}
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
            <Field name="priceValue" label="Price Value" isRequired>
                {({fieldProps: {id, ...rest}, error, meta: {valid}}) => (
                    <>
                        <Textfield
                            id={`text-${id}`}
                            {...rest}
                            defaultValue={
                                isEdit && returnValidData('priceValue') ? get(currentPrice, 'priceValue') : ''
                            }
                            placeholder="Value"
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
            <Field
                label="Price Currency"
                name="priceCurrency"
                isDisabled={isCurrencyDisabled}
                defaultValue={
                    isEdit
                        ? {
                              label: getError('priceCurrency')
                                  ? getError('priceCurrency').message
                                  : returnValidData('priceCurrency') && currentPrice['priceCurrency'],
                              value: returnValidData('priceCurrency') && currentPrice['priceCurrency'],
                          }
                        : ''
                }
            >
                {({fieldProps: {id, ...rest}, error, meta: {valid}}) => (
                    <>
                        <Dropdown
                            id={`select-${id}`}
                            {...rest}
                            value={rest.value.value}
                            columnClass="col-12"
                            filter={true}
                            placeholder="Choose Currency"
                            options={priceCurrencyOptions}
                            onChange={e => {
                                const value = priceCurrencyOptions.find(x => x.value === e.value);
                                rest.onChange(value);
                            }}
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
    priceCurrencyOptions: PropTypes.array,
};

RightPriceFields.defaultProps = {
    isEdit: false,
    existingPriceList: [],
    priceIndex: null,
    priceTypeOptions: [],
    priceCurrencyOptions: [],
};

export default RightPriceFields;
