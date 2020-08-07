import React from 'react';
import PropTypes from 'prop-types';
import {ErrorMessage, Field} from '@atlaskit/form';
import Select from '@atlaskit/select/Select';
import {get} from 'lodash';

const RightAudioLanguageFields = ({isEdit, existingAudioLanguageList, audioLanguageIndex, languageOptions, audioTypesOptions}) => {

    const currentAudioLanguage = Array.isArray(existingAudioLanguageList) && existingAudioLanguageList[audioLanguageIndex];
    if (currentAudioLanguage) {
        languageOptions.forEach(option => {
            if (option.value === currentAudioLanguage.language) {
                currentAudioLanguage.label = option.label
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

    const removeExistingOptions = () => {
        return existingAudioLanguageList ? languageOptions.filter(x => !existingAudioLanguageList.find(y => y.language === x.value)) : languageOptions;
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
                            label: getError('language') ? getError('language').message : (returnValidData('language') && currentAudioLanguage['label']),
                            value: returnValidData('language') && currentAudioLanguage['label']
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
                                    return getError('language', rest.value) ? {...base, borderColor: '#F4F5F6', backgroundColor: 'rgb(242, 222, 222)'} : {...base, borderColor: '#F4F5F7'};
                                },
                                singleValue: base => getError('language', rest.value) ? {...base, color: 'rgb(169, 68, 66)'} : base,
                            }}
                            isSearchable={true}
                            placeholder="Choose Language"
                            options={removeExistingOptions()}
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
                            label: getError('audioType') ? getError('audioType').message : (returnValidData('audioType') && currentAudioLanguage['audioType']),
                            value: returnValidData('audioType') && currentAudioLanguage['audioType']
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
                                    return getError('audioType', rest.value) ? {...base, borderColor: '#F4F5F6', backgroundColor: 'rgb(242, 222, 222)'} : {...base, borderColor: '#F4F5F7'};
                                },
                                singleValue: base => getError('audioType', rest.value) ? {...base, color: 'rgb(169, 68, 66)'} : base,
                            }}
                            isSearchable={true}
                            placeholder="Choose Audio Type"
                            options={audioTypesOptions}
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
    audioTypesOptions : PropTypes.array
};

RightAudioLanguageFields.defaultProps = {
    isEdit: false,
    existingAudioLanguageList: [],
    audioLanguageIndex: null,
    languageOptions: [],
    audioTypesOptions : []
};

export default RightAudioLanguageFields;
