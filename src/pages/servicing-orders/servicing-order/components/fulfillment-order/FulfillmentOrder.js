import Button, {ButtonGroup} from '@atlaskit/button';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import Select from '@atlaskit/select/dist/cjs/Select';
import Textfield from '@atlaskit/textfield';
import {cloneDeep, get, isEqual, set} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {NexusModalContext} from '../../../../../ui/elements/nexus-modal/NexusModal';
import NexusTextArea from '../../../../../ui/elements/nexus-textarea/NexusTextArea';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {createSuccessMessageSelector} from '../../../../../ui/success/successSelector';
import {getValidDate} from '../../../../../util/utils';
import {saveFulfillmentOrder} from '../../servicingOrderActions';
import {SAVE_FULFILLMENT_ORDER, SAVE_FULFILLMENT_ORDER_SUCCESS} from '../../servicingOrderActionTypes';
import Constants from './constants';
import './FulfillmentOrder.scss';

export const transformClientToServerFulfillmentOrder = clientFulfillmentOrder => {
    return {
        ...clientFulfillmentOrder,
        definition: JSON.stringify(clientFulfillmentOrder.definition)
    };
};

export const FulfillmentOrder = ({
    selectedFulfillmentOrder = {},
    setSelectedOrder,
    setSelectedFulfillmentOrderID,
    fetchFulfillmentOrders,
    serviceOrder,
    updatedServices,
    children
}) => {
    const {fieldKeys} = Constants;
    const [savedFulfillmentOrder, setSavedFulfillmentOrder] = useState(null);
    const [fulfillmentOrder, setFulfillmentOrder] = useState(
        cloneDeep(savedFulfillmentOrder || selectedFulfillmentOrder)
    );
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const isSaving = useSelector(state => createLoadingSelector([SAVE_FULFILLMENT_ORDER])(state));
    const isSuccess = useSelector(state => createSuccessMessageSelector([SAVE_FULFILLMENT_ORDER])(state));
    const dispatch = useDispatch();

    const ModalContent = (
        <>
            <p>
                You are about to set a Fulfillment Order&apos;s readiness status to &quot;Ready&quot;. No further edits
                will be possible.
            </p>
            <p>Do you wish to continue?</p>
        </>
    );
    const modalHeading = 'Warning';
    const modalStyle = {
        width: 'small'
    };

    // runs when a fulfillment order has been successfully edited and saved
    // 1. re-fetches all the fulfillment orders
    // 2. dispatches a success action with a value different than 'SUCCESS' so that this effect only runs once on a successful edit
    useEffect(
        () => {
            if (isSuccess && isSuccess !== 'ALREADY_SET') {
                fetchFulfillmentOrders(serviceOrder).then(() => {
                    setSavedFulfillmentOrder(null);
                    setFulfillmentOrder(fulfillmentOrder);
                    setSelectedOrder(fulfillmentOrder);
                    setSelectedFulfillmentOrderID(get(fulfillmentOrder, 'id', ''));
                    dispatch({
                        type: SAVE_FULFILLMENT_ORDER_SUCCESS,
                        payload: 'ALREADY_SET'
                    });
                });
            }
        },
        [isSuccess]
    );

    useEffect(
        () => {
            if (!_.isEmpty(selectedFulfillmentOrder)) {
                setFulfillmentOrder(cloneDeep(savedFulfillmentOrder || selectedFulfillmentOrder));

                // Disable form if status is READY
                get(selectedFulfillmentOrder, fieldKeys.READINESS, '') === 'READY'
                    ? setIsFormDisabled(true)
                    : setIsFormDisabled(false);
            }
        },
        [selectedFulfillmentOrder, savedFulfillmentOrder]
    );

    // effect runs when the services table is updated
    useEffect(
        () => {
            const updatedDeteServices = get(fulfillmentOrder, 'definition.deteServices', []).map(deteService => {
                if (get(deteService, 'deteSources.barcode') === updatedServices.barcode) {
                    return {
                        ...deteService,
                        ...updatedServices.deteServices
                    };
                }
            });

            const fulfillmentOrderClone = cloneDeep(fulfillmentOrder);
            set(fulfillmentOrderClone, 'definition.deteServices', updatedDeteServices);
            setFulfillmentOrder(fulfillmentOrderClone);
        },
        [updatedServices]
    );

    useEffect(
        () => {
            setIsSaveDisabled(isEqual(fulfillmentOrder, savedFulfillmentOrder || selectedFulfillmentOrder));
        },
        [fulfillmentOrder]
    );

    const onFieldChange = (path, value) => {
        const fo = cloneDeep(fulfillmentOrder);
        set(fo, path, value);

        // Show warning modal when status is set to READY
        get(fo, fieldKeys.READINESS, '') === 'READY' && path === 'readiness'
            ? openWarningModal(fo)
            : setFulfillmentOrder(fo);
    };

    const openWarningModal = fo => {
        setModalContentAndTitle(ModalContent, modalHeading);
        setModalStyle(modalStyle);
        setModalActions([
            {
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
            }
        ]);
    };

    const readinessOption = fulfillmentOrder
        ? Constants.READINESS_STATUS.find(l => l.value === fulfillmentOrder[fieldKeys.READINESS])
        : {};

    const {setModalContentAndTitle, setModalActions, setModalStyle, close} = useContext(NexusModalContext);

    const onCancel = () => {
        setFulfillmentOrder(savedFulfillmentOrder || selectedFulfillmentOrder);
    };

    const onSaveHandler = () => {
        const payload = {data: transformClientToServerFulfillmentOrder(fulfillmentOrder)};
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
                                <div>Order ID: {get(fulfillmentOrder, fieldKeys.ID, '')}</div>
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
                                        onClick={onSaveHandler}
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
                                <label htmlFor="notes">Notes:</label>
                                <NexusTextArea
                                    name="notes"
                                    onTextChange={e => onFieldChange(fieldKeys.NOTES, e.target.value)}
                                    notesValue={get(fulfillmentOrder, fieldKeys.NOTES, '') || ''}
                                    isDisabled={isFormDisabled}
                                />
                            </GridColumn>
                            <GridColumn medium={2}>
                                <label htmlFor="servicer">Servicer</label>
                                <Textfield
                                    name="servicer"
                                    value={get(fulfillmentOrder, fieldKeys.SERVICER, '')}
                                    isDisabled={true}
                                />
                            </GridColumn>

                            <GridColumn medium={2}>
                                <div className="fulfillment-order__input">
                                    <label htmlFor="fulfillment-status">Fulfillment Status</label>
                                    <Textfield
                                        name="fulfillment-status"
                                        value={Constants.STATUS[get(fulfillmentOrder, fieldKeys.STATUS, '')] || ''}
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <NexusDatePicker
                                        id="dueDate"
                                        label="Start Date"
                                        value={getValidDate(get(fulfillmentOrder, fieldKeys.START_DATE, ''))}
                                        onChange={val => onFieldChange(fieldKeys.START_DATE, val)}
                                        isReturningTime={false}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                            </GridColumn>

                            <GridColumn medium={2}>
                                <div className="fulfillment-order__input">
                                    <label htmlFor="readiness-status">Readiness Status</label>
                                    <Select
                                        id="readiness-status"
                                        name="readiness-status"
                                        className="fulfillment-order__readiness-status"
                                        options={Constants.READINESS_STATUS}
                                        value={{
                                            value: get(fulfillmentOrder, fieldKeys.READINESS, ''),
                                            label: readinessOption && readinessOption.label
                                        }}
                                        onChange={val => onFieldChange(fieldKeys.READINESS, val.value)}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <NexusDatePicker
                                        id="dueDate"
                                        label="Due Date"
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

FulfillmentOrder.propTypes = {};

FulfillmentOrder.defaultProps = {};

export default FulfillmentOrder;
