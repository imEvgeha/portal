import React from 'react';
import PropTypes from 'prop-types';

import Form, {FormFooter, Field, CheckboxField, ErrorMessage} from '@atlaskit/form';
import Button, {ButtonGroup} from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import Select, {CreatableSelect} from '@atlaskit/select';
import {DatePicker} from '@atlaskit/datetime-picker';
import moment from 'moment';
import {momentToISO} from '../../util/Common';


const RightTerritoryForm = ({
    options = [],
    existingTerritoryList = [],
    territoryIndex,
    isEdit = false,
    onClose,
    onSubmit,
}) => {
    const setProperValues = (data) => {
        const {
            country = null,
            rightContractStatus = null,
            dateSelected = '',
            selected = {},
            vuContractId = '',
        } = data || {};

        if (country && rightContractStatus) {
            // TODO: Refactor this part when refactoring /src/containers/avail/details/RightDetails.js
            // HINT: Pass the full item instead of just the index as it would allow for code clarity improvement
            const newObject = {
                country: country['value'] || (existingTerritoryList[territoryIndex]['country'] || ''),
                dateSelected: momentToISO(moment(dateSelected).utcOffset(0, true)) || (isEdit && existingTerritoryList[territoryIndex]['dateSelected'] || ''),
                selected: selected['label'] === 'Yes' ? selected['label'] ? selected['value'] : existingTerritoryList[territoryIndex]['selected'] : false,
                rightContractStatus: rightContractStatus['value'] || (isEdit && existingTerritoryList[territoryIndex]['rightContractStatus'] || ''),
                vuContractId: vuContractId && vuContractId.map(e => e.value) (isEdit && existingTerritoryList[territoryIndex]['vuContractId'] || ''),
            };
            let updatedObject = {};
            for (let objectField in newObject) {
                if (newObject[objectField]) {
                    updatedObject[objectField] = newObject[objectField];
                } else {
                    if (objectField === 'selected') {
                        updatedObject[objectField] = false;
                    } else {
                        updatedObject[objectField] = null;
                    }
                }
            }
            return updatedObject;
        }
    };

    // TODO: naming
    const onSubmit1 = data => {
        const properValues = setProperValues(data);

        if (properValues) {
            onSubmit(properValues);
            onClose();
        }
    };

    const returnValidData = data => {
        // TODO: ...
        return existingTerritoryList[territoryIndex] && existingTerritoryList[territoryIndex][data];
    };

    const removeExistingOptions = () => {
        return existingTerritoryList
            ? options.filter(option => !existingTerritoryList.find(territoryItem => territoryItem.country === option.label))
            : options;
    };

    // Probably redundant
    const validate = value => {
        if (!value) {
            return 'EMPTY';
        }
        return undefined;
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

    return (
        <Form onSubmit={data => onSubmit1(data)} >
            {({ formProps }) => (
                <form {...formProps}>
                    <Field
                        label="COUNTRY"
                        isRequired
                        name="country"
                        validate={validate}
                        defaultValue={
                            isEdit
                                ? {
                                    label: returnValidData('country') && existingTerritoryList[territoryIndex]['country'],
                                    value: returnValidData('country') && existingTerritoryList[territoryIndex]['country']
                                }
                                : ''
                        }
                    >
                        {({ fieldProps: { id, ...rest }, error, meta: { valid } }) => (
                            <React.Fragment>
                                <Select
                                    id={`select-${id}`}
                                    {...rest}
                                    validationState={getValidationState(error, valid)}
                                    isSearchable={true}
                                    placeholder="Choose Country"
                                    options={removeExistingOptions()}
                                />
                                {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                            </React.Fragment>
                        )}
                    </Field>
                    <CheckboxField
                        // label="SELECTED"
                        name="selected"
                        isDefaultChecked={isEdit
                            ? existingTerritoryList[territoryIndex]['selected']
                            : false}
                    >
                        {({ fieldProps }) => (
                            <Checkbox
                                {...fieldProps}
                                label="Selected"
                            />
                        )}
                    </CheckboxField>

                    <Field
                        label="DATE SELECTED"
                        name="dateSelected"
                        defaultValue={
                            isEdit
                                ? returnValidData('dateSelected') &&
                                existingTerritoryList[territoryIndex]['dateSelected']
                                ? existingTerritoryList[territoryIndex]['dateSelected']
                                : ''
                                : ''
                        }
                    >
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
                                    label: returnValidData('rightContractStatus') && existingTerritoryList[territoryIndex]['rightContractStatus'],
                                    value: returnValidData('rightContractStatus') && existingTerritoryList[territoryIndex]['rightContractStatus'] }
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
                                        control: (base) => ({ ...base, fontSize: '15px' })
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
                    <Field
                        label="VU CONTRACT ID"
                        name="vuContractId"
                        defaultValue={
                            isEdit
                                ? returnValidData('vuContractId') &&
                                existingTerritoryList[territoryIndex]['vuContractId'].length > 0 &&
                                existingTerritoryList[territoryIndex]['vuContractId']
                                    .map(e => { return { value: e, label: e }; })
                                : ''
                        }
                    >
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
                    <FormFooter>
                        {/* TODO: Add handler, type submit could be confusing */}
                        <ButtonGroup>
                            <Button type="submit" appearance="primary">Submit</Button>
                            <Button onClick={onClose}>Close</Button>
                        </ButtonGroup>
                    </FormFooter>
                </form>
            )}
        </Form>
    );
};

RightTerritoryForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    existingTerritoryList: PropTypes.array,
    territoryIndex: PropTypes.number,
};

RightTerritoryForm.defaultProps = {
    isEdit: false,
    existingTerritoryList: [],
    territoryIndex: -1,
};

export default RightTerritoryForm;
