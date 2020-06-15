import React, {useState, useEffect, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {get, set, isEqual, cloneDeep} from 'lodash';
import Button, { ButtonGroup }from '@atlaskit/button';
import './FulfillmentOrder.scss';
import Select from '@atlaskit/select/dist/cjs/Select';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import Constants from './constants';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {getValidDate} from '../../../../../util/utils';
import NexusTextArea from '../../../../../ui/elements/nexus-textarea/NexusTextArea';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {createSuccessMessageSelector} from '../../../../../ui/success/successSelector';
import {SAVE_FULFILLMENT_ORDER} from '../../servicingOrderActionTypes';
import {saveFulfillmentOrder} from '../../servicingOrderActions';
import {NexusModalContext} from '../../../../../ui/elements/nexus-modal/NexusModal';

export const FulfillmentOrder = ({selectedFulfillmentOrder = {}, children}) => {
    const {fieldKeys} = Constants;
    const [savedFulfillmentOrder, setSavedFulfillmentOrder] = useState(null);
    const [fulfillmentOrder, setFulfillmentOrder] = useState(cloneDeep(savedFulfillmentOrder || selectedFulfillmentOrder));
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isSaving = useSelector(state => createLoadingSelector([SAVE_FULFILLMENT_ORDER])(state));
    const isSuccess = useSelector(state => createSuccessMessageSelector([SAVE_FULFILLMENT_ORDER])(state));
    const dispatch = useDispatch();

    const ModalContent = (
        <>
            <p>You are about to set a Fulfillment Order&apos;s readiness status to &quot;Ready&quot;. No further edits will be possible.</p>
            <p>Do you wish to continue?</p>
        </>
    );
    const modalHeading = 'Warning';
    const modalStyle = {
        width: 'small'
    };

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
        get(fulfillmentOrder, fieldKeys.REDINESS, '') === 'READY' ?  setIsFormDisabled(true) : setIsFormDisabled(false);
    }, [fulfillmentOrder]);

    const onFieldChange = (path, value) => {
        const fo = cloneDeep(fulfillmentOrder);
        set(fo, path, value);

        if (get(fo, fieldKeys.REDINESS, '') === 'READY') {
            setModalContentAndTitle(ModalContent, modalHeading);
            setModalStyle(modalStyle);
            setModalActions([{
                text: 'Continue',
                onClick: () => {
                    close();
                    setFulfillmentOrder(fo);
                }
            },
            {
                text: 'Cancel',
                onClick: () => {
                    close();
                }
            }]);
        } else {
            setFulfillmentOrder(fo);
        }
    };

    const redinessOption = fulfillmentOrder ? Constants.REDINESS_STATUS.find(l => l.value === fulfillmentOrder[fieldKeys.REDINESS]) : {};

    const {setModalContentAndTitle, setModalActions, setModalStyle, close} = useContext(NexusModalContext);

    const onCancel = () => {
        setFulfillmentOrder(savedFulfillmentOrder || selectedFulfillmentOrder);
    };

    const onSave = () => {
        const payload = {data: fulfillmentOrder};
        dispatch(saveFulfillmentOrder(payload));
    };

    return (
        <Page>
            <Grid>
                <GridColumn>
                    <div className="fulfillment-order">
                        <div className="fulfillment-order__row fulfillment-order__header">
                            <div className="fulfillment-order__title">
                                <h1>Fulfillment Order</h1>
                                Order ID: {get(fulfillmentOrder, fieldKeys.ID, '')}
                            </div>
                            <div className="fulfillment-order__save-buttons">
                                <ButtonGroup>
                                    <Button
                                        onClick={onCancel}
                                        isDisabled={isSaveDisabled || isSaving || isFormDisabled}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={onSave}
                                        appearance="primary"
                                        isDisabled={isSaveDisabled || isFormDisabled}
                                        isLoading={isSaving}
                                    >
                                        Save
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        <Grid>
                            <GridColumn medium={6}>
                                <label htmlFor='notes'>Notes:</label>
                                <NexusTextArea
                                    name='notes'
                                    onTextChange={e => onFieldChange(fieldKeys.NOTE, e.target)}
                                    notesValue={get(fulfillmentOrder, fieldKeys.NOTE, '')}
                                    isDisabled={isFormDisabled}
                                />
                            </GridColumn>
                            <GridColumn medium={2}>
                                <label htmlFor='servicer'>Servicer</label>
                                <Textfield
                                    name='servicer'
                                    value={get(fulfillmentOrder, fieldKeys.SERVICER, '')}
                                    isDisabled={true}
                                />
                            </GridColumn>

                            <GridColumn medium={2}>
                                <div className="fulfillment-order__input">
                                    <label htmlFor='fulfillment-status'>Fulfillment Status</label>
                                    <Textfield
                                        name='fulfillment-status'
                                        value={Constants.STATUS[get(fulfillmentOrder, fieldKeys.STATUS, '')]}
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <NexusDatePicker
                                        id='dueDate'
                                        label='Start Date'
                                        value={getValidDate(get(fulfillmentOrder, fieldKeys.START_DATE, ''))}
                                        onChange={val => onFieldChange(fieldKeys.START_DATE, val)}
                                        isReturningTime={false}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                            </GridColumn>

                            <GridColumn medium={2}>
                                <div className="fulfillment-order__input">
                                    <label htmlFor='rediness-status'>Rediness Status</label>
                                    <Select
                                        name='rediness-status'
                                        className='fulfillment-order__select'
                                        options={Constants.REDINESS_STATUS}
                                        value={{value: get(fulfillmentOrder, fieldKeys.REDINESS, ''), label: redinessOption && redinessOption.label}}
                                        onChange={val => onFieldChange(fieldKeys.REDINESS, val.value)}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <NexusDatePicker
                                        id='dueDate'
                                        label='Due Date'
                                        value={getValidDate(get(fulfillmentOrder, fieldKeys.DUE_DATE, ''))}
                                        onChange={val => onFieldChange(fieldKeys.DUE_DATE, val)}
                                        isReturningTime={false}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                            </GridColumn>
                        </Grid>
                        <hr />
                        {children}
                    </div>
                </GridColumn>
            </Grid>
        </Page>
    );
};

FulfillmentOrder.propTypes = {
};

FulfillmentOrder.defaultProps = {
};

export default FulfillmentOrder;
