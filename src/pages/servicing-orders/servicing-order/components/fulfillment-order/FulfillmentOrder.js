import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {get, set, isEqual, cloneDeep} from 'lodash';
import Button from '@atlaskit/button';
import './FulfillmentOrder.scss';
import Select from '@atlaskit/select/dist/cjs/Select';
import Textfield from '@atlaskit/textfield';
import Constants from './constants';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {getValidDate} from '../../../../../util/utils';
import NexusTextArea from '../../../../../ui/elements/nexus-textarea/NexusTextArea';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {createSuccessMessageSelector} from '../../../../../ui/success/successSelector';
import {SAVE_FULFILLMENT_ORDER} from '../../servicingOrderActionTypes';
import {saveFulfillmentOrder} from '../../servicingOrderActions';

export const FulfillmentOrder = ({selectedFulfillmentOrder = {}, children}) => {
    const {fieldKeys} = Constants;
    const [savedFulfillmentOrder, setSavedFulfillmentOrder] = useState(null);
    const [fulfillmentOrder, setFulfillmentOrder] = useState(cloneDeep(savedFulfillmentOrder || selectedFulfillmentOrder));
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const isSaving = useSelector(state => createLoadingSelector([SAVE_FULFILLMENT_ORDER])(state));
    const isSuccess = useSelector(state => createSuccessMessageSelector([SAVE_FULFILLMENT_ORDER])(state));
    const dispatch = useDispatch();

    useEffect(() => {
        if(isSuccess){
            setSavedFulfillmentOrder(fulfillmentOrder);
        }
    }, [isSuccess]);

    useEffect(() => {
        setFulfillmentOrder(cloneDeep(savedFulfillmentOrder || selectedFulfillmentOrder));
    }, [selectedFulfillmentOrder, savedFulfillmentOrder]);

    useEffect(() => {
        setIsSaveDisabled(isEqual(fulfillmentOrder, savedFulfillmentOrder || selectedFulfillmentOrder));
    }, [fulfillmentOrder]);

    const onFieldChange = (path, value) => {
        const fo = cloneDeep(fulfillmentOrder);
        set(fo, path, value);
        setFulfillmentOrder(fo);
    };

    const statusOption = fulfillmentOrder ? Constants.STATUS_LIST.find(l => l.value === fulfillmentOrder[fieldKeys.STATUS]) : {};

    const onCancel = () => {
        setFulfillmentOrder(savedFulfillmentOrder || selectedFulfillmentOrder);
    };

    const onSave = () => {
        const payload = {data: fulfillmentOrder};
        dispatch(saveFulfillmentOrder(payload));
    };

    return (
        <div className='fulfillment-order'>
            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__column'>
                    <h2>Fulfillment Order</h2>
                    <div className='fulfillment-order__order-id'>
                        Order ID: {get(fulfillmentOrder, fieldKeys.ID, '')}
                    </div>
                </div>
                <div className='fulfillment-order__actions'>
                    <div className='fulfillment-order__cancel'>
                        <Button
                            onClick={onCancel}
                            isDisabled={isSaveDisabled || isSaving}
                        >
                            Cancel
                        </Button>
                    </div>
                    <div className='fulfillment-order__save'>
                        <Button
                            onClick={onSave}
                            appearance="primary"
                            isDisabled={isSaveDisabled}
                            isLoading={isSaving}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>

            <div className='fulfillment-order__row'>
                <div className='fulfillment-order__column'>
                    <div className='fulfillment-order__column--notes'>
                        <label htmlFor='notes'>Notes:</label>
                        <NexusTextArea
                            name='notes'
                            onTextChange={e => onFieldChange(fieldKeys.NOTE, e.target)}
                            notesValue={get(fulfillmentOrder, fieldKeys.NOTE, '')}
                        />
                    </div>
                </div>
                <div className='fulfillment-order__column'>
                    <div className='fulfillment-order__row'>
                        <div className='fulfillment-order__column'>
                            <div className='fulfillment-order__input'>
                                <label htmlFor='servicer'>Servicer</label>
                                <Textfield
                                    name='servicer'
                                    value={get(fulfillmentOrder, fieldKeys.SERVICER, '')}
                                    isDisabled={true}
                                />
                            </div>
                        </div>
                        <div className='fulfillment-order__column'>
                            <div className='fulfillment-order__select-wrapper'>
                                <label htmlFor="fulfillment-status">Fulfillment Status</label>
                                <Select
                                    name="fulfillment-status"
                                    className='fulfillment-order__select'
                                    options={Constants.STATUS_LIST}
                                    value={{value: get(fulfillmentOrder, fieldKeys.STATUS, ''), label: statusOption && statusOption.label}}
                                    onChange={val => onFieldChange(fieldKeys.STATUS, val.value)}
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
                        <div className='fulfillment-order__column'>
                            <div className='fulfillment-order__select-wrapper'>
                                <label htmlFor="rediness-status">Rediness Status</label>
                                <Select
                                    name='rediness-status'
                                    className='fulfillment-order__select'
                                    options={Constants.STATUS_LIST}
                                    value={{value: get(fulfillmentOrder, fieldKeys.STATUS, ''), label: statusOption && statusOption.label}}
                                    onChange={val => onFieldChange(fieldKeys.STATUS, val.value)}
                                />
                            </div>
                            <div className='fulfillment-order__select-wrapper'>
                                <NexusDatePicker
                                    id='dueDate'
                                    label='Due Date'
                                    value={getValidDate(get(fulfillmentOrder, fieldKeys.DUE_DATE, ''))}
                                    onChange={val => onFieldChange(fieldKeys.DUE_DATE, val)}
                                    isReturningTime={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className='fulfillment-order__column'>
                {children}
            </div>
        </div>
    );
};

FulfillmentOrder.propTypes = {
};

FulfillmentOrder.defaultProps = {
};

export default FulfillmentOrder;
