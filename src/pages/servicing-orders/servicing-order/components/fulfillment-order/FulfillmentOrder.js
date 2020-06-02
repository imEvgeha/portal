import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import {get, isEqual} from 'lodash';
import Button from '@atlaskit/button';
import './FulfillmentOrder.scss';
import Select from '@atlaskit/select/dist/cjs/Select';
import Constants from './constants';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {getValidDate} from '../../../../../util/utils';
import NexusTextArea from '../../../../../ui/elements/nexus-textarea/NexusTextArea';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {SAVE_FULFILLMENT_ORDER} from '../../servicingOrderActionTypes';
import {saveFulfillmentOrder} from '../../servicingOrderActions';

export const FulfillmentOrderInner = ({selectedFulfillmentOrder = {}, children, isSaving, onSave}) => {
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

    const billToOption = fulfillmentOrder ? Constants.BILL_TO_LIST.find(l => l.value === fulfillmentOrder[fieldKeys.BILL_TO]) : {};
    const rateCardOption = fulfillmentOrder ? Constants.RATE_CARD_LIST.find(l => l.value === fulfillmentOrder[fieldKeys.RATE_CARD]) : {};
    const statusOption = fulfillmentOrder ? Constants.STATUS_LIST.find(l => l.value === fulfillmentOrder[fieldKeys.STATUS]) : {};

    const onCancel = () => {
        setFulfillmentOrder(selectedFulfillmentOrder);
    };

    const onInnerSave = () => {
        const payload = {data: fulfillmentOrder};
        onSave(payload);
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
                        <Button
                            onClick={onInnerSave}
                            appearance="primary"
                            isDisabled={isSaveDisabled}
                            isLoading={isSaving}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
            <div className='fulfillment-order__order-id'>
                Order ID: {get(fulfillmentOrder, fieldKeys.ID, '')}
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
                            value={get(fulfillmentOrder, fieldKeys.SERVICER, '')}
                            disabled
                        />
                    </div>
                    <div className='fulfillment-order__input'>
                        <span>Recipient</span>
                        <input
                            value={get(fulfillmentOrder, fieldKeys.RECIPIENT, '')}
                            disabled
                            onChange={val => onFieldChange(fieldKeys.RECIPIENT, val.value)}
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
                        notesValue={get(fulfillmentOrder, NOTES, '')}
                        disabled={!get(fulfillmentOrder, fieldKeys.ID, '')}
                    />
                </div>
            </div>
        </div>
    );
};

FulfillmentOrderInner.propTypes = {
    isSaving: PropTypes.bool,
    onSave: PropTypes.func
};

FulfillmentOrderInner.defaultProps = {
    isSaving: false,
    onSave: () => {}
};

const createMapStateToProps = () => {
    const savingFulfillmentOrderSelector = createLoadingSelector([SAVE_FULFILLMENT_ORDER]);
    return (state) => ({
        isSaving: savingFulfillmentOrderSelector(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    onSave: payload => dispatch(saveFulfillmentOrder(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(FulfillmentOrderInner);
