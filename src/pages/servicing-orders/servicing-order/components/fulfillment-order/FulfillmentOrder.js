import React, {useState, useEffect} from 'react';
import './FulfillmentOrder.scss';
import Select from '@atlaskit/select/dist/cjs/Select';
import Constants from './constants';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {getValidDate} from '../../../../../util/utils';
import NexusTextArea from '../../../../../ui/elements/nexus-textarea/NexusTextArea';

const FulfillmentOrder = ({selectedFulfillmentOrder = {}, children}) => {
    const {fieldKeys, NOTES} = Constants;
    const {external_id: fulfillmentOrderId, notes, billTo, rateCard, fs: servicer, status, definition: {dueDate, startDate} = {} } = selectedFulfillmentOrder;
    const [filters, setFilters] = useState({billTo, notes, rateCard, startDate, status});

    useEffect(() => {
        setFilters({billTo, notes, rateCard, startDate, status});
    }, [selectedFulfillmentOrder]);

    const onFieldChange = (name, value) => {
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
                <div className='fulfillment-order__column'>
                    <div className='fulfillment-order__column--notes'>
                        <h6>Notes:</h6>
                        <NexusTextArea
                            onTextChange={e => onFieldChange(NOTES, e.target)}
                            notesValue={filters.notes}
                            disabled={!fulfillmentOrderId}
                        />
                    </div>
                </div>
                <div className='fulfillment-order__column'>
                    <div className='fulfillment-order__row'>
                        <div className='fulfillment-order--section'>
                            <div className='fulfillment-order__input'>
                                <span>Servicer</span>
                                <input
                                    value={servicer}
                                    disabled
                                />
                            </div>
                            <div className='fulfillment-order__select-wrapper'>
                                Set Order Status
                                <Select
                                    className='fulfillment-order__select'
                                    options={Constants.STATUS_LIST}
                                    value={{value: filters['status'], label: statusOption.label}}
                                    onChange={value => onFieldChange(fieldKeys.STATUS, value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='fulfillment-order__row'>
                        <div className='fulfillment-order--section'>
                            <div className='fulfillment-order__select-wrapper'>
                                <NexusDatePicker
                                    id='dueDate'
                                    label='Due Date'
                                    value={getValidDate(dueDate)}
                                    onChange={value => onDateChange(fieldKeys.DUE_DATE, value)}
                                    isReturningTime={false}
                                />
                            </div>
                            <div className='fulfillment-order__select-wrapper'>
                                <NexusDatePicker
                                    id='startDate'
                                    label='Start Date'
                                    value={getValidDate(startDate)}
                                    onChange={value => onDateChange(fieldKeys.START_DATE, value)}
                                    isReturningTime={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='fulfillment-order__column'>
                {children}
            </div>
        </div>
    );
};

export default FulfillmentOrder;
