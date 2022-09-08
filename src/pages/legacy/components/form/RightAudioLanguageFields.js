import React from 'react';
import PropTypes from 'prop-types';
import {ErrorMessage, Field} from '@atlaskit/form';
import {get} from 'lodash';
import {Dropdown} from '@portal/portal-components';

const RightAudioLanguageFields = ({
    isEdit,
    existingAudioLanguageList,
    audioLanguageIndex,
    languageOptions,
    audioTypesOptions,
}) => {
    const currentAudioLanguage =
        Array.isArray(existingAudioLanguageList) && existingAudioLanguageList[audioLanguageIndex];
    if (currentAudioLanguage) {
        languageOptions.forEach(option => {
            if (option.value === currentAudioLanguage.language) {
                currentAudioLanguage.label = option.label;
            }
        });
    }
    const errors = (currentAudioLanguage && currentAudioLanguage.errors) || [];

    const getError = (field, value, errorList = errors) => {
        const error = errorList.find(({subField}) => subField === field);
        if (error && (!value || value.label === error.message)) {
            return error;
        }
    };

    const getLanguageOptions = () => {
        return existingAudioLanguageList
            ? languageOptions.filter(x => !existingAudioLanguageList.find(y => y.language === x.value))
            : languageOptions;
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

    const returnValidData = data => {
        return get(existingAudioLanguageList, [audioLanguageIndex, data]) !== null;
    };

    return (
        <>
            <Field
                label="Language"
                isRequired
                name="language"
                validate={validate}
                defaultValue={
                    isEdit
                        ? {
                              label: getError('language')
                                  ? getError('language').message
                                  : returnValidData('language') && currentAudioLanguage['label'],
                              value: returnValidData('language') && currentAudioLanguage['label'],
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
                            placeholder="Choose Language"
                            options={getLanguageOptions()}
                            columnClass="col-12"
                            filter={true}
                            onChange={e => {
                                const value = getLanguageOptions().find(x => x.value === e.value);
                                rest.onChange(value);
                            }}
                        />

                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
            <Field
                label="Audio Type"
                name="audioType"
                defaultValue={
                    isEdit
                        ? {
                              label: getError('audioType')
                                  ? getError('audioType').message
                                  : returnValidData('audioType') && currentAudioLanguage['audioType'],
                              value: returnValidData('audioType') && currentAudioLanguage['audioType'],
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
                            placeholder="Choose Audio Type"
                            options={audioTypesOptions}
                            columnClass="col-12"
                            filter={true}
                            onChange={e => {
                                const value = audioTypesOptions.find(x => x.value === e.value);
                                rest.onChange(value);
                            }}
                        />
                    </>
                )}
            </Field>
        </>
    );
};

RightAudioLanguageFields.propTypes = {
    isEdit: PropTypes.bool,
    existingAudioLanguageList: PropTypes.array,
    audioLanguageIndex: PropTypes.number,
    languageOptions: PropTypes.array,
    audioTypesOptions: PropTypes.array,
};

RightAudioLanguageFields.defaultProps = {
    isEdit: false,
    existingAudioLanguageList: [],
    audioLanguageIndex: null,
    languageOptions: [],
    audioTypesOptions: [],
};

export default RightAudioLanguageFields;
