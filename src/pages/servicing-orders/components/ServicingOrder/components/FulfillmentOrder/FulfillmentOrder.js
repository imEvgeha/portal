import React, {useState} from 'react';
import './FulfillmentOrder.scss';
import Select from '@atlaskit/select/dist/cjs/Select';
import Constants from './constants';

const FulfillmentOrder = ({selectedFulfillmentOrder = {}}) => {
    const {filterKeys} = Constants;
    const {fulfillmentOrderId, notes, billTo, rateCard, servicer, recipient, startDate, dueDate, status} = selectedFulfillmentOrder;
    const [filters, setFilters] = useState({billTo, notes, rateCard, startDate, dueDate, status});

    const onFilterChange = (name, value) => {
        setFilters({...filters, [name]: value.value});
    };

    const billToOption = Constants.BILL_TO_LIST.find(l => l.value === filters['billTo']);
    const rateCardOption = Constants.RATE_CARD_LIST.find(l => l.value === filters['rateCard']);
    const statusOption = Constants.STATUS_LIST.find(l => l.value === filters['status']);
    return (
        <div className='fulfillment-order'>
            <div className='fulfillment-order__title'>
                Fulfillment Order
            </div>
            <div className='fulfillment-order__order-id'>
                Order ID: {fulfillmentOrderId}
            </div>
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__notes'>
                    Notes:
                    <div>
                        {notes}
                    </div>
                </div>
                <div className='fulfillment-order__billing'>
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
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__left'>
                    <div className='fulfillment-order__input'>
                        Servicer
                        {' '}
                        <input
                            value={servicer}
                            disabled
                        />
                    </div>
                    <div className='fulfillment-order__input'>
                        Recipient
                        {' '}
                        <input
                            value={recipient}
                            disabled
                        />
                    </div>
                </div>
                <div className='fulfillment-order__right'>
                    <div className='fulfillment-order__select-wrapper'>
                        Status
                        <Select
                            className='fulfillment-order__select'
                            options={Constants.STATUS_LIST}
                            value={{value: filters['status'], label: statusOption.label}}
                            onChange={value => onFilterChange(filterKeys.STATUS, value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FulfillmentOrder;