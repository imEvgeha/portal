import React, {useState, useEffect} from 'react';
import './FulfillmentOrder.scss';
import Select from '@atlaskit/select/dist/cjs/Select';
import Constants from './constants';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {getValidDate} from '../../../../../util/utils';
import NexusTextArea from '../../../../../ui/elements/nexus-textarea/NexusTextArea';

const FulfillmentOrder = ({selectedFulfillmentOrder = {}, children}) => {
    const {filterKeys, NOTES} = Constants;
    const {fulfillmentOrderId, notes, billTo, rateCard, servicer, recipient, startDate, dueDate, status} = selectedFulfillmentOrder;
    const [filters, setFilters] = useState({billTo, notes, rateCard, startDate, dueDate, status});

    useEffect(() => {
        setFilters({billTo, notes, rateCard, startDate, dueDate, status});
    }, [selectedFulfillmentOrder]);

    const onFilterChange = (name, value) => {
        setFilters({...filters, [name]: value.value});
    };

    const onDateChange = (name, value) => {
        setFilters({...filters, [name]: value});
    };

    const billToOption = Constants.BILL_TO_LIST.find(l => l.value === filters['billTo']) || {};
    const rateCardOption = Constants.RATE_CARD_LIST.find(l => l.value === filters['rateCard']) || {};
    const statusOption = Constants.STATUS_LIST.find(l => l.value === filters['status']) || {};

    return (
        <div className='fulfillment-order'>
            <div className='fulfillment-order__title'>
                Fulfillment Order
            </div>
            <div className='fulfillment-order__order-id'>
                Order ID: {fulfillmentOrderId}
            </div>
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__section'>
                    <div className='fulfillment-order__select-wrapper'>
                        Bill To
                        <Select
                            className='fulfillment-order__select'
                            options={Constants.BILL_TO_LIST}
                            value={{value: filters['billTo'], label: billToOption.label}}
                            onChange={value => onFilterChange(filterKeys.BILL_TO, value)}
                        />
                    </div>
                    <div className='fulfillment-order__select-wrapper'>
                        Rate Card
                        <Select
                            className='fulfillment-order__select'
                            options={Constants.RATE_CARD_LIST}
                            value={{value: filters['rateCard'], label: rateCardOption.label}}
                            onChange={value => onFilterChange(filterKeys.RATE_CARD, value)}
                        />
                    </div>
                </div>
            </div>
            <div className='fulfillment-order__row fulfillment-order__row--with-border'>
                <div className='fulfillment-order__section'>
                    <div className='fulfillment-order__input'>
                        <span>Servicer</span>
                        <input
                            value={servicer || ''}
                            disabled
                        />
                    </div>
                    <div className='fulfillment-order__input'>
                        <span>Recipient</span>
                        <input
                            value={recipient || ''}
                            disabled
                        />
                    </div>
                    <div className='fulfillment-order__section'>
                        <div className='fulfillment-order__select-wrapper'>
                            Set Order Status
                            <Select
                                className='fulfillment-order__select'
                                options={Constants.STATUS_LIST}
                                value={{value: filters['status'], label: statusOption.label}}
                                onChange={value => onFilterChange(filterKeys.STATUS, value)}
                            />
                        </div>
                        <div className='fulfillment-order__select-wrapper'>
                            <NexusDatePicker
                                id='dueDate'
                                label='Due Date'
                                value={getValidDate(dueDate)}
                                onChange={value => onDateChange(filterKeys.DUE_DATE, value)}
                                isReturningTime={false}
                            />
                        </div>
                        <div className='fulfillment-order__select-wrapper'>
                            <NexusDatePicker
                                id='startDate'
                                label='Start Date'
                                value={getValidDate(startDate)}
                                onChange={value => onDateChange(filterKeys.START_DATE, value)}
                                isReturningTime={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='fulfillment-order__column'>
                {children}
            </div>
            <div className='fulfillment-order__notes'>
                <h5>Notes:</h5>
                <NexusTextArea
                    onTextChange={e => onFilterChange(NOTES, e.target)}
                    notesValue={filters.notes}
                    disabled={!fulfillmentOrderId}
                />
            </div>
        </div>
    );
};

export default FulfillmentOrder;
