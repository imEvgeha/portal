import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import {Dropdown, InputText, InputTextarea, Tooltip as PortalTooltip, Button} from '@portal/portal-components';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {createSuccessMessageSelector} from '@vubiquity-nexus/portal-ui/lib/success/successSelector';
import {getValidDate} from '@vubiquity-nexus/portal-utils/lib/utils';
import {cloneDeep, get, isEmpty, isEqual, set} from 'lodash';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {readinessStatus} from '../../../constants';
import {SAVE_FULFILLMENT_ORDER, SAVE_FULFILLMENT_ORDER_SUCCESS} from '../../servicingOrderActionTypes';
import {saveFulfillmentOrder} from '../../servicingOrderActions';
import {SOURCE_STANDARD} from '../services-table/Constants';
import ErrorsList from './ErrorsList';
import Constants, {ORDER_REVISION_WARNING, READINESS_CHANGE_WARNING} from './constants';
import './FulfillmentOrder.scss';

const modalHeading = 'Warning';

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
    userHasPermissions,
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

    const lateFaults = useSelector(state => get(state, 'servicingOrders.servicingOrder.lateFaults'));

    // fetch (and store) late reasons if not available in store for the tenant
    useEffect(() => {
        if (fulfillmentOrder.tenant && !lateFaults.hasOwnProperty(fulfillmentOrder.tenant)) {
            dispatch({type: 'FETCH_CONFIG', payload: get(fulfillmentOrder, 'tenant')});
        }
    }, [get(fulfillmentOrder, 'tenant')]);

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
                userHasPermissions
                    ? readiness === 'READY'
                        ? setIsFormDisabled(true)
                        : setIsFormDisabled(false)
                    : setIsFormDisabled(true);
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

        if (path === fieldKeys.LATE_FAULT) {
            // set late reason = null when user select/reselect late fault
            set(fo, fieldKeys.LATE_REASON, null);
        }

        // Show warning modal when status is set to READY
        get(fo, fieldKeys.READINESS, '') === readinessStatus.READY && path === 'readiness'
            ? openWarningModal(fo)
            : setFulfillmentOrder(fo);
        setIsSaveDisabled(false);
    };

    const openWarningModal = fo => {
        const ModalContent = (
            <>
                <p>{READINESS_CHANGE_WARNING}</p>
                <p>Do you wish to continue?</p>
            </>
        );
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
        const status = get(selectedFulfillmentOrder, fieldKeys.READINESS, '');

        const setDefaultValues = data => {
            const updatedData = data;
            const firstExternalServices = updatedData?.definition?.deteServices?.[0].externalServices;
            const sourceStandardAsParameter = firstExternalServices?.parameters?.find(
                param => param.name === SOURCE_STANDARD
            )?.value;

            if (
                (sourceStandardAsParameter === undefined || sourceStandardAsParameter === ' ') &&
                updatedData?.definition?.deteServices
            ) {
                const parametersWithoutSourceStandard = firstExternalServices?.parameters?.filter(
                    elem => elem.name !== SOURCE_STANDARD
                );
                updatedData.definition.deteServices[0].externalServices = {
                    ...firstExternalServices,
                    parameters: [
                        ...parametersWithoutSourceStandard,
                        {
                            name: SOURCE_STANDARD,
                            value: updatedData?.definition?.deteServices?.[0]?.deteSources?.[0]?.externalSources
                                ?.standard,
                        },
                    ],
                };
            }
            return updatedData;
        };

        const actions = [
            {
                text: 'Continue',
                onClick: () => {
                    closeModal();
                    const data = prepareOrderPutData(fulfillmentOrder);
                    const dataToSave = setDefaultValues(data);
                    const payload = {data: setDefaultValues(dataToSave)};
                    dispatch(saveFulfillmentOrder(payload));
                },
            },
            {
                text: 'Cancel',
                onClick: () => {
                    closeModal();
                },
            },
        ];
        if (status === readinessStatus.READY) {
            const ModalContent = (
                <>
                    <p>{ORDER_REVISION_WARNING}</p>
                    <p>Do you wish to continue?</p>
                </>
            );
            openModal(ModalContent, {title: modalHeading, width: 'small', actions});
        } else {
            const data = prepareOrderPutData(fulfillmentOrder);
            const dataToSave = setDefaultValues(data);

            if (dataToSave?.definition?.deteServices?.length) {
                dataToSave.definition.deteServices.forEach(item => {
                    if (item.externalServices.sourceStandard) {
                        const sourceStandard = item.externalServices.sourceStandard;
                        const indexOfSourceStandard = item.externalServices.parameters.findIndex(
                            elem => elem.name === SOURCE_STANDARD
                        );
                        indexOfSourceStandard >= 0
                            ? (item.externalServices.parameters[indexOfSourceStandard].value = sourceStandard)
                            : (item.externalServices.parameters = [
                                  ...item.externalServices.parameters,
                                  {name: SOURCE_STANDARD, value: sourceStandard},
                              ]);
                        delete item.externalServices[SOURCE_STANDARD];
                    }
                });
            }

            const payload = {data: dataToSave};
            dispatch(saveFulfillmentOrder(payload));
            setIsSaveDisabled(true);
        }
    };

    const getLateFaultOptions = () => {
        let faultOptions = [];
        if (fulfillmentOrder.tenant) {
            const faultArray = Object.keys(lateFaults[fulfillmentOrder.tenant] || {});
            faultOptions = faultArray.length > 0 ? faultArray.map(item => ({value: item, label: item})) : [];
        }

        return faultOptions;
    };

    const getLateReasonOptions = fault => {
        const faultObj = lateFaults[fulfillmentOrder.tenant] || {};
        return fault && fault in faultObj ? faultObj[fault].map(item => ({value: item, label: item})) : [];
    };

    const lateFaultOptions = [...Constants.LATE_FAULT, ...getLateFaultOptions()];
    const lateReasonOptions = getLateReasonOptions(fulfillmentOrder?.late_fault);

    const onTooltipOptionClick = () =>
        deteErrors.length ? openModal(<ErrorsList errors={deteErrors} closeModal={closeModal} />) : null;

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
                                <Button
                                    label="Cancel"
                                    className="p-button-outlined p-button-secondary  mx-3"
                                    onClick={onCancel}
                                    disabled={userHasPermissions && (isSaveDisabled || isSaving)}
                                />
                                <Button
                                    label="Save"
                                    className="p-button-outlined"
                                    onClick={onSaveHandler}
                                    disabled={!userHasPermissions}
                                    loading={isSaving}
                                />
                            </div>
                        </div>
                        <Grid layout="fluid">
                            <GridColumn medium={3}>
                                <div className="nexus-fo-date-readonly">
                                    Servicer:{' '}
                                    <Lozenge appearance="new">{get(fulfillmentOrder, fieldKeys.SERVICER, '')}</Lozenge>
                                </div>
                                <div className="nexus-fo-date-readonly">
                                    Start Date:{' '}
                                    <Lozenge>
                                        {moment(getValidDate(get(fulfillmentOrder, fieldKeys.START_DATE, ''))).format(
                                            'MM/DD/YYYY'
                                        )}
                                    </Lozenge>
                                </div>
                                <div className="nexus-fo-date-readonly">
                                    Due Date:{' '}
                                    <Lozenge>
                                        {moment(getValidDate(get(fulfillmentOrder, fieldKeys.DUE_DATE, ''))).format(
                                            'MM/DD/YYYY'
                                        )}
                                    </Lozenge>
                                </div>
                                {get(fulfillmentOrder, fieldKeys.STATUS) === Constants.STATUS.COMPLETE && (
                                    <div className="nexus-fo-date-readonly">
                                        Completed Date:{' '}
                                        <Lozenge>
                                            {moment(
                                                getValidDate(get(fulfillmentOrder, fieldKeys.COMPLETED_DATE, ''))
                                            ).format('MM/DD/YYYY')}
                                        </Lozenge>
                                    </div>
                                )}
                                <div>
                                    {fulfillmentOrder.hasOwnProperty(fieldKeys.PREMIERING) && (
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="inp-premiering"
                                                defaultChecked={get(fulfillmentOrder, fieldKeys.PREMIERING, false)}
                                                onClick={() =>
                                                    onFieldChange(
                                                        fieldKeys.PREMIERING,
                                                        !get(fulfillmentOrder, fieldKeys.PREMIERING)
                                                    )
                                                }
                                                disabled={!userHasPermissions}
                                            />
                                            <label htmlFor="inp-premiering" className="fo-gridhdr-radio">
                                                Premiering
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {fulfillmentOrder.hasOwnProperty(fieldKeys.WATERMARK) && (
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="inp-watermark"
                                                defaultChecked={get(fulfillmentOrder, fieldKeys.WATERMARK, false)}
                                                onClick={() =>
                                                    onFieldChange(
                                                        fieldKeys.WATERMARK,
                                                        !get(fulfillmentOrder, fieldKeys.WATERMARK)
                                                    )
                                                }
                                                disabled={!userHasPermissions}
                                            />
                                            <label htmlFor="inp-watermark" className="fo-gridhdr-radio">
                                                Watermark
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {fulfillmentOrder.hasOwnProperty(fieldKeys.LATE) && (
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="inp-late"
                                                defaultChecked={get(fulfillmentOrder, fieldKeys.LATE, false)}
                                                onClick={() =>
                                                    onFieldChange(
                                                        fieldKeys.LATE,
                                                        !get(fulfillmentOrder, fieldKeys.LATE)
                                                    )
                                                }
                                                disabled={!userHasPermissions}
                                            />
                                            <label htmlFor="inp-late" className="fo-gridhdr-radio">
                                                Late
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </GridColumn>
                            <GridColumn medium={3}>
                                {fulfillmentOrder.hasOwnProperty(fieldKeys.MARKET_TYPE) && (
                                    <div className="fulfillment-order__input">
                                        <Dropdown
                                            labelProps={{
                                                label: 'Market Type',
                                                shouldUpper: false,
                                                stacked: true,
                                            }}
                                            id="market-type"
                                            options={Constants.MARKET_TYPES}
                                            value={get(fulfillmentOrder, fieldKeys.MARKET_TYPE, '')}
                                            onChange={val => onFieldChange(fieldKeys.MARKET_TYPE, val.value)}
                                        />
                                    </div>
                                )}
                                {fulfillmentOrder.hasOwnProperty(fieldKeys.LATE_FAULT) && (
                                    <div className="fulfillment-order__input">
                                        <Dropdown
                                            labelProps={{
                                                label: 'Late At Fault',
                                                shouldUpper: false,
                                                stacked: true,
                                            }}
                                            id="late-fault"
                                            options={lateFaultOptions}
                                            value={get(fulfillmentOrder, fieldKeys.LATE_FAULT)}
                                            onChange={val => onFieldChange(fieldKeys.LATE_FAULT, val.value)}
                                            disabled={!userHasPermissions}
                                        />
                                    </div>
                                )}
                            </GridColumn>
                            <GridColumn medium={3}>
                                {fulfillmentOrder.hasOwnProperty(fieldKeys.CAR) && (
                                    <div className="fulfillment-order__input">
                                        <PortalTooltip
                                            content={get(fulfillmentOrder, fieldKeys.CAR, '')}
                                            target=".lbl-car"
                                            position="bottom"
                                        />

                                        <InputText
                                            labelProps={{
                                                htmlFor: 'car',
                                                label: 'Car',
                                                shouldUpper: true,
                                                stacked: true,
                                            }}
                                            id="car"
                                            className="lbl-car"
                                            name="CAR"
                                            value={get(fulfillmentOrder, fieldKeys.CAR, '') || ''}
                                            disabled={!userHasPermissions}
                                            onChange={e => onFieldChange(fieldKeys.CAR, e.target.value)}
                                        />
                                    </div>
                                )}
                                {fulfillmentOrder.hasOwnProperty(fieldKeys.LATE_REASON) && (
                                    <div className="fulfillment-order__input">
                                        <Dropdown
                                            labelProps={{
                                                label: 'Late Reason',
                                                shouldUpper: false,
                                                stacked: true,
                                            }}
                                            id="late-reason"
                                            className="late-reason-ddl"
                                            options={lateReasonOptions}
                                            value={get(fulfillmentOrder, fieldKeys.LATE_REASON, '')}
                                            onChange={val => onFieldChange(fieldKeys.LATE_REASON, val.value)}
                                            disabled={!userHasPermissions}
                                            tooltip={fulfillmentOrder[fieldKeys.LATE_REASON]}
                                            tooltipOptions={{position: 'bottom'}}
                                        />
                                    </div>
                                )}
                            </GridColumn>
                            <GridColumn medium={3}>
                                <div className="fulfillment-order__input">
                                    <PortalTooltip
                                        content={deteErrors.length ? `View ${deteErrors.length} errors` : '0 errors'}
                                        target=".late-reason-lbl"
                                    />

                                    <InputText
                                        labelProps={{
                                            htmlFor: 'fulfillmentStatus',
                                            label: 'Fulfillment Status',
                                            shouldUpper: false,
                                            stacked: true,
                                            className: 'late-reason-lbl',
                                            additionalLabel: (
                                                <i
                                                    onClick={onTooltipOptionClick}
                                                    className={`pi pi-exclamation-circle mx-2 error-icon ${
                                                        deteErrors.length ? 'red' : 'grey'
                                                    }`}
                                                />
                                            ),
                                        }}
                                        id="fulfillmentStatus"
                                        name="fulfillment-status"
                                        value={Constants.STATUS[get(fulfillmentOrder, fieldKeys.STATUS, '')] || ''}
                                        disabled={true}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <Dropdown
                                        labelProps={{
                                            label: 'Readiness Status',
                                            shouldUpper: false,
                                            stacked: true,
                                        }}
                                        id="readiness-status"
                                        className="fulfillment-order__readiness-status"
                                        options={Constants.READINESS_STATUS}
                                        value={get(fulfillmentOrder, fieldKeys.READINESS, '')}
                                        onChange={val => onFieldChange(fieldKeys.READINESS, val.value)}
                                        disabled={isFormDisabled}
                                    />
                                </div>

                                <InputTextarea
                                    labelProps={{
                                        label: 'Notes',
                                        shouldUpper: false,
                                        stacked: true,
                                    }}
                                    id="txtAreaNotes"
                                    name="notes"
                                    onChange={e => onFieldChange(fieldKeys.NOTES, e.target.value)}
                                    value={get(fulfillmentOrder, fieldKeys.NOTES, '') || ''}
                                    disabled={!userHasPermissions}
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
    lastOrder: PropTypes.object,
    deteErrors: PropTypes.array,
    userHasPermissions: PropTypes.bool,
};

FulfillmentOrder.defaultProps = {
    selectedFulfillmentOrder: {},
    setSelectedOrder: () => null,
    setSelectedFulfillmentOrderID: () => null,
    fetchFulfillmentOrders: () => null,
    serviceOrder: null,
    updatedServices: {},
    children: null,
    cancelEditing: () => null,
    lastOrder: {},
    deteErrors: [],
    userHasPermissions: null,
};

export default FulfillmentOrder;
