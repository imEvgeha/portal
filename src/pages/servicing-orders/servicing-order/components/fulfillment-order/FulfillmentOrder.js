import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import ErrorIcon from "@atlaskit/icon/glyph/error";
import Lozenge from '@atlaskit/lozenge';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import {Radio} from '@atlaskit/radio';
import Select from '@atlaskit/select/dist/cjs/Select';
import Textfield from '@atlaskit/textfield';
import Tooltip from "@atlaskit/tooltip";
import NexusDatePicker from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import NexusTextArea from '@vubiquity-nexus/portal-ui/lib/elements/nexus-textarea/NexusTextArea';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {createSuccessMessageSelector} from '@vubiquity-nexus/portal-ui/lib/success/successSelector';
import {getValidDate} from '@vubiquity-nexus/portal-utils/lib/utils';
import {cloneDeep, get, isEmpty, set, isEqual} from 'lodash';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {SAVE_FULFILLMENT_ORDER, SAVE_FULFILLMENT_ORDER_SUCCESS} from '../../servicingOrderActionTypes';
import {saveFulfillmentOrder} from '../../servicingOrderActions';
import ErrorsList from './ErrorsList';
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
    deteErrors,
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

    const {openModal, closeModal} = useContext(NexusModalContext);

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
                const readiness = get(selectedFulfillmentOrder, fieldKeys.READINESS, '');
                readiness === 'READY' ? setIsFormDisabled(true) : setIsFormDisabled(false);
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
                    externalSystem: get(item, 'assetInfo.externalSystem', 'VSOM'),
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
        dispatch(saveFulfillmentOrder(payload));
        setIsSaveDisabled(true);
    };

    console.log('start date: ',getValidDate(get(fulfillmentOrder, fieldKeys.START_DATE, '')))

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
                        <Grid spacing="compact">
                            <GridColumn medium={3}>                      
                                <div className="nexus-fo-date-readonly">
                                    Servicer:  <Lozenge appearance="new">{get(fulfillmentOrder, fieldKeys.SERVICER, '')}</Lozenge>
                                </div>
                                <div className="nexus-fo-date-readonly">
                                    Start Date:  <Lozenge>{moment(getValidDate(get(fulfillmentOrder, fieldKeys.START_DATE, ''))).format('MM/DD/YYYY') || 'N/A'}</Lozenge>
                                </div>
                                <div className="nexus-fo-date-readonly">
                                    Due Date:  <Lozenge>{moment(getValidDate(get(fulfillmentOrder, fieldKeys.DUE_DATE, ''))).format('MM/DD/YYYY') || 'N/A'}</Lozenge>
                                </div>
                                <div className="nexus-fo-date-readonly">
                                    Completed Date:  <Lozenge>{moment(getValidDate(get(fulfillmentOrder, fieldKeys.COMPLETED_DATE, ''))).format('MM/DD/YYYY') || 'N/A'}</Lozenge>
                                </div>
                                <div>
                                    <Radio
                                        value="premiering"
                                        label="Premiering"
                                        name="premiering"
                                        isChecked={false}
                                        onChange={() => {}}
                                    />
                                </div>
                                <div>
                                    <Radio
                                        value="watermark"
                                        label="Watermark"
                                        name="watermark"
                                        isChecked={false}
                                        onChange={() => {}}
                                    />
                                </div>
                                <div>
                                    <Radio
                                        value="late"
                                        label="Late"
                                        name="late"
                                        isChecked={false}
                                        onChange={() => {}}
                                    />
                                </div>
                            </GridColumn>
                            <GridColumn medium={3}>
                                <div className="fulfillment-order__input">
                                    <label htmlFor="readiness-status">Market Type</label>
                                    <Select
                                        id="market-type"
                                        name="market-type"
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
                                    <label htmlFor="late-fault">Late At Fault</label>
                                    <Select
                                        id="late-fault"
                                        name="late-fault"
                                        options={Constants.READINESS_STATUS}
                                        value={{
                                            value: get(fulfillmentOrder, fieldKeys.READINESS, ''),
                                            label: readinessOption && readinessOption.label,
                                        }}
                                        onChange={val => onFieldChange(fieldKeys.READINESS, val.value)}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                            </GridColumn>
                            <GridColumn medium={3}>
                                <div className="fulfillment-order__input">
                                    <label htmlFor="car">CAR</label>
                                    <Textfield
                                        name="CAR"
                                        id="car"
                                        value={Constants.STATUS[get(fulfillmentOrder, fieldKeys.STATUS, '')] || 'CAR'}
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <label htmlFor="late-reason">Late Reason</label>
                                    <Select
                                        id="late-reason"
                                        name="late-reason"
                                        options={Constants.READINESS_STATUS}
                                        value={{
                                            value: get(fulfillmentOrder, fieldKeys.READINESS, ''),
                                            label: readinessOption && readinessOption.label,
                                        }}
                                        onChange={val => onFieldChange(fieldKeys.READINESS, val.value)}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                            </GridColumn>
                            <GridColumn medium={3}>
                            <div className="fulfillment-order__input">
                                    <Tooltip content={deteErrors.length ?
                                        `View ${deteErrors.length} errors`
                                        : '0 errors'}>
                                        <div
                                            onClick={() =>
                                                deteErrors.length ?
                                                    openModal(<ErrorsList errors={deteErrors} closeModal={closeModal} />)
                                                    : null
                                            }
                                        >
                                            <label htmlFor="late-reason">Fulfillment Status</label>
                                            <ErrorIcon size="small" primaryColor={deteErrors.length ?
                                            'red' :
                                            'grey'}
                                        />
                                        </div>
                                    </Tooltip>
                                    <Textfield
                                        name="fulfillment-status"
                                        value={Constants.STATUS[get(fulfillmentOrder, fieldKeys.STATUS, '')] || ''}
                                        isDisabled={true}
                                    />
                                </div>
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
                                <label htmlFor="notes">Notes:</label>
                                <NexusTextArea
                                    name="notes"
                                    onTextChange={value => onFieldChange(fieldKeys.NOTES, value)}
                                    notesValue={get(fulfillmentOrder, fieldKeys.NOTES, '') || ''}
                                    isDisabled={isFormDisabled}
                                />
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
    deteErrors: PropTypes.array,
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
    deteErrors: [],
};

export default FulfillmentOrder;
