import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import Select from '@atlaskit/select/dist/cjs/Select';
import Textfield from '@atlaskit/textfield';
import {getValidDate} from '@vubiquity-nexus/portal-utils/lib/utils';
import {cloneDeep, get, isEmpty, set, isEqual} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {NexusModalContext} from '../../../../../ui/elements/nexus-modal/NexusModal';
import NexusTextArea from '../../../../../ui/elements/nexus-textarea/NexusTextArea';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {createSuccessMessageSelector} from '../../../../../ui/success/successSelector';
import {SAVE_FULFILLMENT_ORDER, SAVE_FULFILLMENT_ORDER_SUCCESS} from '../../servicingOrderActionTypes';
import {saveFulfillmentOrder} from '../../servicingOrderActions';
import Constants from './constants';
import './FulfillmentOrder.scss';

export const FulfillmentOrder = ({
    selectedFulfillmentOrder = {},
    setSelectedOrder,
    setSelectedFulfillmentOrderID,
    fetchFulfillmentOrders,
    serviceOrder,
    updatedServices,
    children,
    cancelEditing,
    lastOrder,
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

    // runs when a fulfillment order has been successfully edited and saved
    // 1. re-fetches all the fulfillment orders
    // 2. dispatches action with a value other than 'SUCCESS' so that this effect only runs once on a successful edit
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
                        payload: 'ALREADY_SET',
                    });
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isSuccess]
    );

    useEffect(
        () => {
            if (!isEmpty(selectedFulfillmentOrder)) {
                setFulfillmentOrder(cloneDeep(savedFulfillmentOrder || selectedFulfillmentOrder));

                // Disable form if status is READY
                get(selectedFulfillmentOrder, fieldKeys.READINESS, '') === 'READY'
                    ? setIsFormDisabled(true)
                    : setIsFormDisabled(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedFulfillmentOrder, savedFulfillmentOrder]
    );

    // effect runs when the services table is updated
    useEffect(
        () => {
            const updatedDeteServices = get(updatedServices, 'deteServices');
            const fulfillmentOrderClone = cloneDeep(fulfillmentOrder);
            set(fulfillmentOrderClone, 'definition.deteServices', updatedDeteServices);
            setFulfillmentOrder(fulfillmentOrderClone);
            setSelectedOrder(fulfillmentOrderClone);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [updatedServices]
    );

    useEffect(() => {
        setIsSaveDisabled(isEqual(fulfillmentOrder, lastOrder));
    }, [fulfillmentOrder]);

    const onFieldChange = (path, value) => {
        const fo = cloneDeep(fulfillmentOrder);
        set(fo, path, value);

        // Show warning modal when status is set to READY
        get(fo, fieldKeys.READINESS, '') === 'READY' && path === 'readiness'
            ? openWarningModal(fo)
            : setFulfillmentOrder(fo);
        setIsSaveDisabled(false);
    };

    const openWarningModal = fo => {
        const actions = [
            {
                text: 'Continue',
                onClick: () => {
                    closeModal();
                    setFulfillmentOrder(fo);
                },
            },
            {
                text: 'Cancel',
                onClick: () => {
                    closeModal();
                    setIsSaveDisabled(isEqual(fulfillmentOrder, lastOrder));
                },
            },
        ];
        openModal(ModalContent, {title: modalHeading, width: 'small', actions});
    };

    const readinessOption = fulfillmentOrder
        ? Constants.READINESS_STATUS.find(l => l.value === fulfillmentOrder[fieldKeys.READINESS])
        : {};

    const {openModal, closeModal} = useContext(NexusModalContext);

    const onCancel = () => {
        setFulfillmentOrder(savedFulfillmentOrder || selectedFulfillmentOrder);
        cancelEditing();
        setIsSaveDisabled(true);
        setSelectedOrder(lastOrder);
    };

    // format put data as per DETE specifications before sending to FO api
    const prepareOrderPutData = data => {
        const clonedData = cloneDeep(data);
        const sources = get(clonedData, 'definition.deteServices[0].deteSources', []);
        sources.forEach(item => {
            // remove old properties if exists. DETE validation
            item.assetFormat && delete item.assetFormat;
            item.standard && delete item.standard;
            item.status && delete item.status;
            item.title && delete item.title;
            item.version && delete item.version;

            // add properties on externalSources. DETE validation
            if (item.assetInfo) {
                item.externalSources = {
                    ...item.externalSources,
                    assetFormat: item.assetInfo.assetFormat,
                    assetType: get(item, 'externalSources.assetType', 'DETE_FILE'),
                    standard: item.assetInfo.standard,
                    title: item.assetInfo.title,
                    version: item.assetInfo.version,
                    status: item.assetInfo.status,
                    externalId: item.assetInfo.barcode,
                };
                // remove assetInfo property (used for simplifying source table row data)
                delete item.assetInfo;
            }
        });
        return clonedData;
    };

    const onSaveHandler = () => {
        const dataToSave = prepareOrderPutData(fulfillmentOrder);
        const payload = {data: dataToSave};
        console.log('payload to api:: ', payload);
        dispatch(saveFulfillmentOrder(payload));
        setIsSaveDisabled(true);
    };

    return (
        <Page>
            <div className="fulfillment-order__section">
                <GridColumn>
                    <div className="fulfillment-order">
                        <div className="fulfillment-order__row fulfillment-order__header">
                            <div className="fulfillment-order__title">
                                <div className="fulfillment-order__title--text">Fulfillment Order</div>
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
                                    onTextChange={value => onFieldChange(fieldKeys.NOTES, value)}
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
                                        id="ff_startDate"
                                        label="Start Date"
                                        value={getValidDate(get(fulfillmentOrder, fieldKeys.START_DATE, ''))}
                                        onChange={val => onFieldChange(fieldKeys.START_DATE, val)}
                                        isReturningTime={false}
                                        isDisabled={true}
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
                                            label: readinessOption && readinessOption.label,
                                        }}
                                        onChange={val => onFieldChange(fieldKeys.READINESS, val.value)}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <NexusDatePicker
                                        id="ff_dueDate"
                                        label="Due Date"
                                        value={getValidDate(get(fulfillmentOrder, fieldKeys.DUE_DATE, ''))}
                                        onChange={val => onFieldChange(fieldKeys.DUE_DATE, val)}
                                        isReturningTime={false}
                                        isDisabled={true}
                                    />
                                </div>
                            </GridColumn>
                        </Grid>
                        <hr />
                        {children}
                    </div>
                </GridColumn>
            </div>
        </Page>
    );
};

FulfillmentOrder.propTypes = {
    selectedFulfillmentOrder: PropTypes.object,
    setSelectedOrder: PropTypes.func,
    setSelectedFulfillmentOrderID: PropTypes.func,
    fetchFulfillmentOrders: PropTypes.func,
    serviceOrder: PropTypes.object,
    updatedServices: PropTypes.object,
    children: PropTypes.any,
    cancelEditing: PropTypes.func,
    lastOrder: PropTypes.object.isRequired,
};

FulfillmentOrder.defaultProps = {
    selectedFulfillmentOrder: {},
    setSelectedOrder: () => null,
    setSelectedFulfillmentOrderID: () => null,
    fetchFulfillmentOrders: () => null,
    serviceOrder: null,
    updatedServices: () => null,
    children: null,
    cancelEditing: () => null,
};

export default FulfillmentOrder;
