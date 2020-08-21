import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {ErrorMessage, Field} from '@atlaskit/form';
import {DatePicker} from '@atlaskit/datetime-picker';
import {useIntl} from 'react-intl';
import Select from '@atlaskit/select/Select';
import {getDateFormatBasedOnLocale, ISODateToView} from '../../../../util/date-time/DateTimeUtils';
import Textfield from '@atlaskit/textfield';
import {getValidDate} from '../../../../util/utils';

const RightTerritoryFields = ({isEdit, existingTerritoryList, territoryIndex, options}) => {
    const currentTerritory = Array.isArray(existingTerritoryList) && existingTerritoryList[territoryIndex];
    const errors = (currentTerritory && currentTerritory.errors) || [];
    const {dateSelected = '', selected = false, dateWithdrawn = ''} =
        (typeof territoryIndex === 'number' && territoryIndex >= 0) ? existingTerritoryList[territoryIndex] : {};
    const [showErrorDateWithdrawn, setShowErrorDateWithdrawn] = useState(false);
    const getError = (field, value, errorList = errors) => {
        const error = errorList.find(({subField}) => subField === field);
        if (error && (!value || value.label === error.message)) {
            return error;
        }
    };

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl || {};

    // Create date placeholder based on locale
    const dateFormat = `${getDateFormatBasedOnLocale(locale)}`;

    const removeExistingOptions = () => {
        return existingTerritoryList
            ? options.filter(x => !existingTerritoryList.find(y => y.country === x.value))
            : options;
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
        return (
            existingTerritoryList &&
            existingTerritoryList[territoryIndex] &&
            existingTerritoryList[territoryIndex][data] &&
            existingTerritoryList[territoryIndex][data] !== null
        );
    };

    const onChangeDateWithdrawn = (val, restOnChange) => {
        const today = new Date();
        const updatedDate =  getValidDate(val) !== getValidDate(today) ?  '' :  val;
        setShowErrorDateWithdrawn(updatedDate === '')
        if(updatedDate === ''){
            return false;
        } else {
            restOnChange(updatedDate);
        }
    };

    return (
        <>
            <Field
                label="COUNTRY"
                isRequired
                isDisabled={isEdit && currentTerritory['selected']}
                name="country"
                validate={validate}
                defaultValue={
                    isEdit
                        ? {
                              label: getError('country')
                                  ? getError('country').message
                                  : returnValidData('country') && currentTerritory['country'],
                              value: returnValidData('country') && currentTerritory['country'],
                          }
                        : ''
                }
            >
                {({fieldProps: {id, ...rest}, error, meta: {valid}}) => (
                    <>
                        <Select
                            id={`select-${id}`}
                            {...rest}
                            validationState={getValidationState(error, valid)}
                            styles={{
                                control: base => {
                                    return getError('country', rest.value)
                                        ? {...base, borderColor: '#F4F5F6', backgroundColor: 'rgb(242, 222, 222)'}
                                        : {...base, borderColor: '#F4F5F7'};
                                },
                                singleValue: base =>
                                    getError('country', rest.value) ? {...base, color: 'rgb(169, 68, 66)'} : base,
                            }}
                            isSearchable={true}
                            placeholder="Choose Country"
                            options={removeExistingOptions()}
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
            <Field name="selected" defaultValue="False" label="SELECTED">
                {() => (
                        <Textfield
                            name="readOnly"
                            isReadOnly={true}
                            defaultValue={selected.toString()}
                            style={{height: '40px'}}
                        />
                    )
                }
            </Field>
            {isEdit && dateSelected && (
                <Field name="date selected" defaultValue="" label="DATE SELECTED">
                    {() => (
                        <Textfield
                            name="readOnly"
                            isReadOnly={true}
                            defaultValue={ISODateToView(dateSelected, 'businessDateTime')}
                        />
                    )}
                </Field>
            )}
            <Field
                label="RIGHTS CONTRACT STATUS"
                isRequired
                validate={validate}
                name="rightContractStatus"
                defaultValue={
                    isEdit
                        ? {
                              label: getError('rightContractStatus')
                                  ? getError('rightContractStatus').message
                                  : returnValidData('rightContractStatus') && currentTerritory['rightContractStatus'],
                              value: returnValidData('rightContractStatus') && currentTerritory['rightContractStatus'],
                          }
                        : ''
                }
            >
                {({fieldProps: {id, ...rest}, error, meta: {valid}}) => (
                    <>
                        <Select
                            id={`select-${id}`}
                            {...rest}
                            isSearchable={false}
                            styles={{
                                control: base => {
                                    const defaultStyle = {
                                        ...base,
                                        borderColor: '#F4F5F6',
                                        fontSize: '15px',
                                    };
                                    const controlStyle = getError('rightContractStatus', rest.value)
                                        ? {...defaultStyle, backgroundColor: 'rgb(242, 222, 222)'}
                                        : defaultStyle;
                                    return controlStyle;
                                },
                                singleValue: base => {
                                    const style = getError('rightContractStatus', rest.value)
                                        ? {...base, color: 'rgb(169, 68, 66)'}
                                        : base;
                                    return style;
                                },
                            }}
                            validationState={getValidationState(error, valid)}
                            placeholder="Choose Status"
                            options={[
                                {label: 'Pending', value: 'Pending'},
                                {label: 'Pending Manual', value: 'PendingManual'},
                                {label: 'Matched Once', value: 'MatchedOnce'},
                            ]}
                        />
                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
            <Field
                label="VU CONTRACT ID"
                name="vuContractId"
                defaultValue={
                    isEdit && existingTerritoryList[territoryIndex]['vuContractId']
                        ? existingTerritoryList[territoryIndex]['vuContractId'].join(', ')
                        : ''
                }
            >
                {({fieldProps: {id, value, ...rest}}) => (
                    <Textfield
                        name="vuContractId"
                        isReadOnly={false}
                        defaultValue={value}
                        style={{height: '40px'}}
                        {...rest}
                    />
                )}
            </Field>
            <Field name="dateWithdrawn" defaultValue="" label="DATE WITHDRAWN">
                {({fieldProps: {id, value, ...rest}}) => (
                    <DatePicker
                        name="dateWithdrawn"
                        locale={locale}
                        placeholder={dateFormat}
                        id="dateWithdrawn"
                        value={value}
                        onChange={val => onChangeDateWithdrawn(val, rest.onChange)}
                        isReturningTime={false}
                        isDisabled={!isEdit}
                    />
                )}
            </Field>
            {showErrorDateWithdrawn && <ErrorMessage> Only the current date can be selected </ErrorMessage>}
            <Field
                label="COMMENTS"
                name="comment"
                defaultValue={
                    isEdit && existingTerritoryList[territoryIndex]['comment']
                        ? existingTerritoryList[territoryIndex]['comment']
                        : ''
                }
            >
                {({fieldProps: {id, value, ...rest}}) => (
                    <Textfield
                        name="comment"
                        isReadOnly={false}
                        defaultValue={value}
                        style={{height: '40px'}}
                        {...rest}
                    />
                )}
            </Field>
        </>
    );
};

RightTerritoryFields.propTypes = {
    isEdit: PropTypes.bool,
    existingTerritoryList: PropTypes.array,
    territoryIndex: PropTypes.number,
    options: PropTypes.array,
};

RightTerritoryFields.defaultProps = {
    isEdit: false,
    existingTerritoryList: [],
    territoryIndex: null,
    options: [],
};

export default RightTerritoryFields;
