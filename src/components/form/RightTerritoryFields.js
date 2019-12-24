import React from 'react';
import {ErrorMessage, Field} from '@atlaskit/form';
import Select from '@atlaskit/select/Select';
import {convertBooleanToString} from '../../containers/avail/util/format';
import {DatePicker} from '@atlaskit/datetime-picker';
import {CreatableSelect} from '@atlaskit/select';

export default function RightTerritoryFields({isEdit, existingTerritoryList, territoryIndex, options}) {

    const currentTerritory = Array.isArray(existingTerritoryList) && existingTerritoryList[territoryIndex];
    const errors = (currentTerritory && currentTerritory.errors) || [];
    
    const getError = (field, value, errorList = errors) => {
        const error = errorList.find(({subField}) => subField === field);
        if (error && (!value || value.label === error.message)) {
            return error;
        }
    };

    const removeExistingOptions = () => {
        return existingTerritoryList ? options.filter(x => !existingTerritoryList.find(y => y.country === x.label)) : options;
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
        return existingTerritoryList && existingTerritoryList[territoryIndex] && existingTerritoryList[territoryIndex][data] && existingTerritoryList[territoryIndex][data] !== null;
    };
    
    return (
        <React.Fragment>
            <Field
                label="COUNTRY"
                isRequired
                name="country"
                validate={validate}
                defaultValue={
                    isEdit
                        ? {
                            label: getError('country') ? getError('country').message : (returnValidData('country') && currentTerritory['country']),
                            value: returnValidData('country') && currentTerritory['country']
                        } : ''
                }
            >
                {({ fieldProps: { id, ...rest }, error, meta: { valid } }) => (
                    <React.Fragment>
                        <Select
                            id={`select-${id}`}
                            {...rest}
                            validationState={getValidationState(error, valid)}
                            styles={{
                                control: (base) => {
                                    return getError('country', rest.value) ? {...base, borderColor: '#F4F5F6', backgroundColor: 'rgb(242, 222, 222)'} : {...base, borderColor: '#F4F5F7'};
                                },
                                singleValue: base => getError('country', rest.value) ? {...base, color: 'rgb(169, 68, 66)'} : base,
                            }}
                            isSearchable={true}
                            placeholder="Choose Country"
                            options={removeExistingOptions()}
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </React.Fragment>
                )}

            </Field>
            <Field label="SELECTED" name="selected" defaultValue={isEdit ? { label: returnValidData('selected') ? convertBooleanToString(existingTerritoryList[territoryIndex]['selected']) : 'No', value: returnValidData('selected') ? existingTerritoryList[territoryIndex]['selected'] : false } : { label: 'No', value: false }}>
                {({ fieldProps: { id, ...rest } }) => (
                    <Select
                        id={`select-${id}`}
                        {...rest}
                        isSearchable={false}
                        placeholder="Add selected"
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },]}
                    />
                )}
            </Field>

            <Field label="DATE SELECTED" name="dateSelected" defaultValue={isEdit ? returnValidData('dateSelected') && existingTerritoryList[territoryIndex]['dateSelected'] ? existingTerritoryList[territoryIndex]['dateSelected'] : '' : ''}>
                {({ fieldProps }) => (
                    <DatePicker id={'datepicker'} placeholder="DD/MM/YYYY" {...fieldProps} dateFormat={'DD/MM/YYYY'} />
                )}
            </Field>

            <Field
                label="RIGHTS CONTRACT STATUS"
                isRequired
                validate={validate}
                name="rightContractStatus"
                defaultValue={
                    isEdit
                        ? {
                            label: getError('rightContractStatus') ? getError('rightContractStatus').message : returnValidData('rightContractStatus') && currentTerritory['rightContractStatus'],
                            value: returnValidData('rightContractStatus') && currentTerritory['rightContractStatus'] }
                        : ''
                }
            >
                {({ fieldProps: { id, ...rest }, error, meta: { valid } }) => (
                    <React.Fragment>
                        <Select
                            id={`select-${id}`}
                            {...rest}
                            isSearchable={false}
                            styles={{
                                control: (base) => {
                                    const defaultStyle = {
                                        ...base,
                                        borderColor: '#F4F5F6',
                                        fontSize: '15px',
                                    };
                                    const controlStyle = getError('rightContractStatus', rest.value) ? {...defaultStyle, backgroundColor: 'rgb(242, 222, 222)'} : defaultStyle;
                                    return controlStyle;
                                },
                                singleValue: base => {
                                    const style = getError('rightContractStatus', rest.value) ? {...base, color: 'rgb(169, 68, 66)'} : base;
                                    return style;
                                },
                            }}
                            validationState={getValidationState(error, valid)}
                            placeholder="Choose Status"
                            options={[
                                { label: 'Pending', value: 'Pending' },
                                { label: 'Pending Manual', value: 'PendingManual' },
                                { label: 'Matched Once', value: 'MatchedOnce' }
                            ]}
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </React.Fragment>
                )}
            </Field>
            <Field label="VU CONTRACT ID" name="vuContractId" defaultValue={isEdit ? returnValidData('vuContractId') && existingTerritoryList[territoryIndex]['vuContractId'].length > 0 && existingTerritoryList[territoryIndex]['vuContractId'].map(e => { return { value: e, label: e }; }) : ''}>
                {({ fieldProps: { id, ...rest } }) => (
                    <CreatableSelect
                        id={`creatable-select-${id}`}
                        isClearable
                        isMulti={true}
                        placeholder="Add Contract ID"
                        {...rest}
                    />
                )}

            </Field>
        </React.Fragment>
    );
}