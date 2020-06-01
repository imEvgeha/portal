import React, {useState, useEffect} from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {get, isEqual} from 'lodash';
import Button from '@atlaskit/button';
import './FulfillmentOrder.scss';
import Select from '@atlaskit/select/dist/cjs/Select';
import Constants from './constants';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {getValidDate} from '../../../../../util/utils';
import NexusTextArea from '../../../../../ui/elements/nexus-textarea/NexusTextArea';

const FulfillmentOrder = ({selectedFulfillmentOrder = {}, children}) => {
    const {fieldKeys, NOTES} = Constants;
    const [fulfillmentOrder, setFulfillmentOrder] = useState(cloneDeep(selectedFulfillmentOrder));
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    useEffect(() => {
        setFulfillmentOrder(cloneDeep(selectedFulfillmentOrder));
        setIsSaveDisabled(true);
    }, [selectedFulfillmentOrder]);

    useEffect(() => {
        setIsSaveDisabled(isEqual(fulfillmentOrder, selectedFulfillmentOrder));
    }, [fulfillmentOrder]);

    const onFieldChange = (name, value) => {
        setFulfillmentOrder({...fulfillmentOrder, [name]: value});
    };

    const billToOption = fulfillmentOrder ? Constants.BILL_TO_LIST.find(l => l.value === fulfillmentOrder['billTo']) : {};
    const rateCardOption = fulfillmentOrder ? Constants.RATE_CARD_LIST.find(l => l.value === fulfillmentOrder['rateCard']) : {};
    const statusOption = fulfillmentOrder ? Constants.STATUS_LIST.find(l => l.value === fulfillmentOrder['status']) : {};

    const onCancel = () => {
        setFulfillmentOrder(selectedFulfillmentOrder);
    };

    const onSave = () => {

    };

    return (
        <div className='fulfillment-order'>
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__title'>
                    Fulfillment Order
                </div>
                <div className='fulfillment-order__actions'>
                    <div className='fulfillment-order__cancel'>
                        <Button onClick={onCancel}>Cancel</Button>
                    </div>
                    <div className='fulfillment-order__save'>
                        <Button onClick={onSave} appearance="primary" isDisabled={isSaveDisabled}>Save</Button>
                    </div>
                </div>
            </div>
            <div className='fulfillment-order__order-id'>
                Order ID: {get(fulfillmentOrder, 'fulfillmentOrderId', '')}
            </div>
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__row--section'>
                    <div className='fulfillment-order__input'>
                        <span>Servicer</span>
                        <input
                            value={get(fulfillmentOrder, 'servicer', '')}
                            disabled
                        />
                    </div>
                </div>
                <div className='fulfillment-order__row--section'>
                    <div className='fulfillment-order__select-wrapper'>
                        Bill To
                        <Select
                            className='fulfillment-order__select'
                            options={Constants.BILL_TO_LIST}
                            value={{value: get(fulfillmentOrder, fieldKeys.BILL_TO, ''), label: billToOption && billToOption.label}}
                            onChange={val => onFieldChange(fieldKeys.BILL_TO, val.value)}
                        />
                    </div>
                    <div className='fulfillment-order__select-wrapper'>
                        Rate Card
                        <Select
                            className='fulfillment-order__select'
                            options={Constants.RATE_CARD_LIST}
                            value={{value: get(fulfillmentOrder, fieldKeys.RATE_CARD, ''), label: rateCardOption && rateCardOption.label}}
                            onChange={val => onFieldChange(fieldKeys.RATE_CARD, val.value)}
                        />
                    </div>
                </div>
            </div>
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__section'>
                    <div className='fulfillment-order__input'>
                        <span>Servicer</span>
                        <input
                            value={get(fulfillmentOrder, 'servicer', '')}
                            disabled
                        />
                    </div>
                    <div className='fulfillment-order__input'>
                        <span>Recipient</span>
                        <input
                            value={get(fulfillmentOrder, 'recipient', '')}
                            disabled
                            onChange={val => onFieldChange('recipient', val.value)}
                        />
                    </div>
                </div>
            </div>
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__row--section'>
                    <div className='fulfillment-order__input'>
                        <span>Priority</span>
                        <Select
                            value={{value: get(fulfillmentOrder, fieldKeys.PRIORITY, ''), label:get(fulfillmentOrder, fieldKeys.PRIORITY, '')}}
                            options={new Array(10)
                                    .fill('')
                                    .map((val,idx) => ({value:idx, label:idx}))}
                            onChange={val => onFieldChange(fieldKeys.PRIORITY, val.value)}
                        />
                    </div>
                    <div className='fulfillment-order__select-wrapper'>
                        Set Order Status
                        <Select
                            className='fulfillment-order__select'
                            options={Constants.STATUS_LIST}
                            value={{value: get(fulfillmentOrder, fieldKeys.STATUS, ''), label: statusOption && statusOption.label}}
                            onChange={val => onFieldChange(fieldKeys.STATUS, val.value)}
                        />
                    </div>
                </div>
                <div className='fulfillment-order__row--section'>
                    <div className='fulfillment-order__select-wrapper'>
                        <NexusDatePicker
                            id='dueDate'
                            label='Due Date'
                            value={getValidDate(get(fulfillmentOrder, fieldKeys.DUE_DATE, ''))}
                            onChange={val => onFieldChange(fieldKeys.DUE_DATE, val)}
                            isReturningTime={false}
                        />
                    </div>
                    <div className='fulfillment-order__select-wrapper'>
                        <NexusDatePicker
                            id='startDate'
                            label='Start Date'
                            value={getValidDate(get(fulfillmentOrder, fieldKeys.START_DATE, ''))}
                            onChange={val => onFieldChange(fieldKeys.START_DATE, val)}
                            isReturningTime={false}
                        />
                    </div>
                </div>
            </div>
            <div className='fulfillment-order__column'>
                {children}
            </div>
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__row--notes'>
                    <h6>Notes:</h6>
                    <NexusTextArea
                        onTextChange={e => onFieldChange(NOTES, e.target.value)}
                        notesValue={get(fulfillmentOrder, 'notes', '')}
                        disabled={!get(fulfillmentOrder, 'fulfillmentOrderId', '')}
                    />
                </div>
            </div>
        </div>
    );
};

export default FulfillmentOrder;
