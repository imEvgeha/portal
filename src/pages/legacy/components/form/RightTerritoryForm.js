import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, Dropdown, InputText, Button, Calendar} from '@portal/portal-components';
import {RIGHTS_CREATE} from '../../constants/constant-variables';
import {FormProvider, useForm} from 'react-hook-form';
import {getDateFormatBasedOnLocale} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import IconCalendar from '@vubiquity-nexus/portal-assets/calendar.svg';
import {useIntl} from 'react-intl';

const RightTerritoryForm = ({
    onSubmit,
    isOpen,
    onClose,
    options,
    isFromCreatePage,
    territory,
    isEdit,
    isBonusRight,
    territoryIndex,
}) => {
    const currentTerritory = Array.isArray(territory) && territory[territoryIndex];

    const onSubmitForm = submitForm => {
        if (isValid) {
            onSubmit(submitForm);
            onClose();
            reset(initialValues);
        }
    };

    const removeExistingOptions = () => {
        return territory ? options.filter(x => !territory.find(y => y.country === x.value)) : options;
    };

    const statusOptions = [
        {label: 'Pending', value: 'Pending'},
        {label: 'Pending Manual', value: 'PendingManual'},
        {label: 'Matched Once', value: 'MatchedOnce'},
    ];

    // Get locale provided by intl
    const intl = useIntl();
    const {locale = 'en-US'} = intl;
    // Create date placeholder based on locale
    const dateFormat = `${getDateFormatBasedOnLocale(locale)}`;

    const initialValues = {
        country: null,
        rightContractStatus: null,
        vuContractId: null,
        dateWithdrawn: null,
        comment: null,
        selected: false,
    };

    const form = useForm({
        defaultValues: initialValues,
        mode: 'all',
        reValidateMode: 'onChange',
    });

    const {
        reset,
        handleSubmit,
        formState: {isValid},
    } = form;

    const renderHeader = () => {
        return (
            <div className="row">
                <h3 className="col-12 text-start">{RIGHTS_CREATE}</h3>
                <h4 className="col-12 text-start mt-2">Territory Data</h4>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="row">
                <div className="col-12 text-end">
                    <Button
                        label="Cancel"
                        className="p-button-outlined p-button-secondary"
                        onClick={() => {
                            onClose();
                            reset(initialValues);
                        }}
                    />
                    <Button
                        label="Create"
                        className="p-button-outlined"
                        type="submit"
                        onClick={async e => {
                            await handleSubmit(onSubmitForm)(e);
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <Dialog
            header={renderHeader()}
            visible={isOpen}
            style={{width: '35vw'}}
            footer={renderFooter()}
            onHide={() => null}
            closeOnEscape={true}
            closable={false}
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Dropdown
                        labelProps={{
                            isRequired: true,
                            label: 'Country',
                            stacked: true,
                        }}
                        formControlOptions={{
                            formControlName: `country`,
                            rules: {
                                required: {value: true, message: 'Field cannot be empty!'},
                            },
                        }}
                        id="country"
                        disabled={isEdit && (currentTerritory['selected'] || isBonusRight)}
                        columnClass="col-12"
                        filter={true}
                        placeholder="Choose Country"
                        options={removeExistingOptions()}
                    />
                    <InputText
                        formControlOptions={{
                            formControlName: `selected`,
                        }}
                        labelProps={{label: 'Selected', stacked: true}}
                        id="selected"
                        defaultValue="False"
                        readOnly
                    />
                    <Dropdown
                        labelProps={{
                            isRequired: true,
                            label: 'Rights Contact Status',
                            stacked: true,
                        }}
                        formControlOptions={{
                            formControlName: `rightContractStatus`,
                            rules: {
                                required: {value: true, message: 'Field cannot be empty!'},
                            },
                        }}
                        id="rightContractStatus"
                        columnClass="col-12"
                        placeholder="Choose Status"
                        options={statusOptions}
                        disabled={isEdit && isBonusRight}
                    />
                    <InputText
                        formControlOptions={{
                            formControlName: `vuContractId`,
                        }}
                        labelProps={{label: 'VU Contact ID', stacked: true, isRequired: false}}
                        id="vuContractId"
                        placeholder="Enter VU Contact ID"
                    />
                    <Calendar
                        labelProps={{
                            isRequired: false,
                            label: 'Rights Contact Status',
                            stacked: true,
                        }}
                        formControlOptions={{
                            formControlName: `dateWithdrawn`,
                        }}
                        id="dateWithdrawn"
                        placeholder={dateFormat}
                        disabled={isFromCreatePage || (isEdit && isBonusRight)}
                        dateFormat="mm-dd-yy"
                        showIcon
                        icon={IconCalendar}
                    />
                    <InputText
                        formControlOptions={{
                            formControlName: `comment`,
                        }}
                        labelProps={{label: 'Comment', stacked: true, isRequired: false}}
                        id="comment"
                        placeholder="Enter Comment"
                    />
                </form>
            </FormProvider>
        </Dialog>
    );
};

RightTerritoryForm.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    options: PropTypes.array,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    isFromCreatePage: PropTypes.bool,
    existingTerritoryList: PropTypes.array,
    isBonusRight: PropTypes.bool,
    territory: PropTypes.array,
    territoryIndex: PropTypes.number,
};

RightTerritoryForm.defaultProps = {
    onClose: () => {},
    isOpen: false,
    isEdit: false,
    onSubmit: false,
    isFromCreatePage: false,
    existingTerritoryList: false,
    isBonusRight: false,
    territory: [],
    options: [],
    territoryIndex: 0,
};

export default RightTerritoryForm;
