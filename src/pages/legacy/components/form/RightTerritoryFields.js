import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import Button from '@atlaskit/button';
import {ErrorMessage, Field} from '@atlaskit/form';
import {DatePicker} from '@atlaskit/datetime-picker';
import {useIntl} from 'react-intl';
import {getDateFormatBasedOnLocale, ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import Textfield from '@atlaskit/textfield';
import {getValidDate} from '@vubiquity-nexus/portal-utils/lib/utils';
import './RightTerritoryFields.scss';
import {Dropdown} from '@portal/portal-components';

const RightTerritoryFields = ({
    isEdit,
    isFromCreatePage,
    existingTerritoryList,
    territoryIndex,
    options,
    isBonusRight,
}) => {
    const currentTerritory = Array.isArray(existingTerritoryList) && existingTerritoryList[territoryIndex];
    const errors = (currentTerritory && currentTerritory.errors) || [];
    const {
        dateSelected = '',
        selected = false,
        dateWithdrawn = '',
    } = typeof territoryIndex === 'number' && territoryIndex >= 0 ? existingTerritoryList[territoryIndex] : {};
    const [showErrorDateWithdrawn, setShowErrorDateWithdrawn] = useState(false);

    const [showClearButton, setShowClearButton] = useState(false);
    const dateRef = useRef();

    const getError = (field, value, errorList = errors) => {
        const error = errorList.find(({subField}) => subField === field);
        if (error && (!value || value.label === error.message)) {
            return error;
        }
    };

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl;

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
        if (val === 'clear') {
            restOnChange('');
        } else {
            const today = new Date();
            const updatedDate = getValidDate(val) !== getValidDate(today) ? '' : val;
            setShowErrorDateWithdrawn(updatedDate === '');
            if (updatedDate === '') {
                return false;
            } else {
                setShowClearButton(true);
                restOnChange(updatedDate);
            }
        }
    };

    const clearDateWithdrawn = () => {
        if (dateRef.current) {
            setShowClearButton(false);
            dateRef.current.props.onChange('clear');
        }
    };

    const statusOptions = [
        {label: 'Pending', value: 'Pending'},
        {label: 'Pending Manual', value: 'PendingManual'},
        {label: 'Matched Once', value: 'MatchedOnce'},
    ];

    return (
        <>
            <Field
                label="COUNTRY"
                isRequired
                isDisabled={isEdit && (currentTerritory['selected'] || isBonusRight)}
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
                        <Dropdown
                            id={`select-${id}`}
                            {...rest}
                            value={rest.value.value}
                            columnClass="col-12"
                            filter={true}
                            placeholder="Choose Country"
                            options={removeExistingOptions()}
                            onChange={e => {
                                const value = removeExistingOptions().find(x => x.value === e.value);
                                rest.onChange(value);
                            }}
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
                )}
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
                isDisabled={isEdit && isBonusRight}
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
                        <Dropdown
                            id={`select-${id}`}
                            {...rest}
                            value={rest.value.value}
                            columnClass="col-12"
                            placeholder="Choose Status"
                            options={statusOptions}
                            onChange={e => {
                                const value = statusOptions.find(x => x.value === e.value);
                                rest.onChange(value);
                            }}
                        />

                        {error === 'EMPTY' && <ErrorMessage>This field cannot be empty!</ErrorMessage>}
                    </>
                )}
            </Field>
            <Field
                label="VU CONTRACT ID"
                name="vuContractId"
                isDisabled={isEdit && isBonusRight}
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
                        ref={dateRef}
                        name="dateWithdrawn"
                        locale={locale}
                        placeholder={dateFormat}
                        id="dateWithdrawn"
                        value={value ? value : dateWithdrawn ? dateWithdrawn : ''}
                        onChange={val => onChangeDateWithdrawn(val, rest.onChange)}
                        isReturningTime={false}
                        isDisabled={isFromCreatePage || (isEdit && isBonusRight)}
                    />
                )}
            </Field>
            {showClearButton && (
                <Button
                    appearance="subtle-link"
                    onClick={clearDateWithdrawn}
                    className={classnames('nexus-c-right-territory-fields__close-button', {
                        'nexus-c-right-territory-fields__close-button--date-selected': isEdit && dateSelected,
                    })}
                >
                    <EditorErrorIcon />
                </Button>
            )}
            {showErrorDateWithdrawn && <ErrorMessage> Only the current date can be selected </ErrorMessage>}
            <Field
                label="COMMENTS"
                name="comment"
                isDisabled={isEdit && isBonusRight}
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
    isFromCreatePage: PropTypes.bool,
    existingTerritoryList: PropTypes.array,
    territoryIndex: PropTypes.number,
    options: PropTypes.array,
    isBonusRight: PropTypes.bool,
};

RightTerritoryFields.defaultProps = {
    isEdit: false,
    isFromCreatePage: false,
    existingTerritoryList: [],
    territoryIndex: null,
    options: [],
    isBonusRight: false,
};

export default RightTerritoryFields;
