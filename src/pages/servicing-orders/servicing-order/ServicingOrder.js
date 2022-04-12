import React, {useEffect, useMemo, useState} from 'react';
import {sortByDateFn} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {cloneDeep, get} from 'lodash';
import {useParams} from 'react-router-dom';
import {PAGE_SIZE} from '../../avails/selected-for-planning/constants';
import Loading from '../../static/Loading';
import {getSpecOptions, servicingOrdersService} from '../servicingOrdersService';
import FulfillmentOrder from './components/fulfillment-order/FulfillmentOrder';
import HeaderSection from './components/header-section/HeaderSection';
import JuiceBoxSection from './components/juicebox-section/JuiceBoxSection';
import {SELECT_VALUES, SOURCE_STANDARD} from './components/services-table/Constants';
import ServicesTable from './components/services-table/ServicesTable';
import SourcesTable from './components/sources-table/SourcesTable';
import {
    fetchAssetInfo,
    getBarCodes,
    populateAssetInfo,
    prepareRowData,
    showLoading,
} from './components/sources-table/util';
import {readinessStatus, SERVICERS, TENANTS} from '../constants';
import './ServicingOrder.scss';

const ServicingOrder = () => {
    const [serviceOrder, setServiceOrder] = useState({});
    const [selectedFulfillmentOrderID, setSelectedFulfillmentOrderID] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedSource, setSelectedSource] = useState();
    const [lastOrder, setLastOrder] = useState({});
    const [components, setComponents] = useState([]);
    const [servicingOrderItemsLength, setServicingOrderItemsLength] = useState(0);
    const [recipientsOptions, setRecipientsOptions] = useState({});
    const routeParams = useParams();
    // this piece of state is used for when a service is updated in the services table
    const [updatedServices, setUpdatedServices] = useState({});

    // prepare row data from selected order for source table
    const sourceRowData = useMemo(() => prepareRowData(selectedOrder), [selectedOrder]);

    // order origin DETE, JuiceBox etc
    const orderOrigin = get(selectedOrder, 'fs');

    useEffect(() => {
        const filteredOrder = get(serviceOrder, 'fulfillmentOrders', []).filter(
            s => s && s.id === selectedFulfillmentOrderID
        );
        const order = filteredOrder[filteredOrder.length - 1] || {};
        setSelectedOrder(order);
        setLastOrder(order);
    }, [serviceOrder, selectedFulfillmentOrderID]);

    const fetchFulfillmentOrders = async (servicingOrder, page = 0) => {
        if (servicingOrder.so_number) {
            try {
                const {fulfillmentOrders, servicingOrderItems, fulfillmentOrderItems} =
                    await servicingOrdersService.getAdvancedFulfilmentOrdersForServiceOrder(
                        servicingOrder.so_number,
                        page,
                        PAGE_SIZE
                    );

                let fulfillmentOrdersClone = cloneDeep(fulfillmentOrders);

                fulfillmentOrdersClone = sortByDateFn(fulfillmentOrdersClone, 'definition.dueDate');

                const newFulfillmentOrders = serviceOrder?.fulfillmentOrders || [];
                const newServicingOrderItems = serviceOrder?.servicingOrderItems || [];
                const newFulfillmentOrderItems = serviceOrder?.fulfillmentOrderItems || [];

                setServiceOrder({
                    ...servicingOrder,
                    fulfillmentOrders: [...newFulfillmentOrders, ...showLoading(fulfillmentOrdersClone)],
                    servicingOrderItems: [...newServicingOrderItems, ...servicingOrderItems],
                    fulfillmentOrderItems: [...newFulfillmentOrderItems, ...fulfillmentOrderItems],
                });
                const barcodes = getBarCodes(fulfillmentOrdersClone);
                fetchAssetInfo(barcodes).then(assetInfo => {
                    const newUniqueFulfillmentOrders = populateAssetInfo(fulfillmentOrdersClone, assetInfo[0]);
                    setServiceOrder({
                        ...servicingOrder,
                        fulfillmentOrders: [...newFulfillmentOrders, ...newUniqueFulfillmentOrders],
                        servicingOrderItems: [...newServicingOrderItems, ...servicingOrderItems],
                        fulfillmentOrderItems: [...newFulfillmentOrderItems, ...fulfillmentOrderItems],
                    });
                    // Todo remove below comments after nothing is broken in SO page. kbora
                    // setSelectedFulfillmentOrderID(get(newFulfillmentOrders, '[0].id', ''));
                    // setSelectedOrder(newFulfillmentOrders[0]);
                    setComponents(assetInfo[1]);
                });

                setSelectedFulfillmentOrderID(get(fulfillmentOrdersClone, '[0].id', ''));
            } catch (e) {
                setServiceOrder(servicingOrder);
            }
        } else {
            setServiceOrder(servicingOrder);
        }
    };

    const fetchNewPageForFulfillmentOrders = page =>
        servicingOrdersService.getServicingOrderById(routeParams.id).then(servicingOrder => {
            if (servicingOrder) {
                fetchFulfillmentOrders(servicingOrder, page);
            } else {
                setServiceOrder({});
            }
        });

    const getAmountOfItems = async servicingOrder => {
        const totalOrdersForServiceOrder = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(
            servicingOrder.so_number
        );
        setServicingOrderItemsLength(totalOrdersForServiceOrder.fulfillmentOrders.length);
    };

    useEffect(() => {
        servicingOrdersService.getServicingOrderById(routeParams.id).then(servicingOrder => {
            if (servicingOrder) {
                fetchFulfillmentOrders(servicingOrder);
                getAmountOfItems(servicingOrder);
            } else {
                setServiceOrder({});
            }
        });
    }, [routeParams]);

    const handleSelectedSourceChange = source => {
        // upon source change, call format sheets api if not already called for recipient
        if (source) {
            if (Array.isArray(source.deteServices) && source.deteServices.length > 0) {
                let recp = {};
                source.deteServices.forEach(item => {
                    const extId = get(item, 'externalServices.externalId', '');
                    const sourceStandardAsParameter = item.externalServices?.parameters?.find(
                        param => param.name === SOURCE_STANDARD
                    )?.value;
                    if (sourceStandardAsParameter === undefined || sourceStandardAsParameter === ' ') {
                        const parametersWithoutSourceStandard = item?.externalServices?.parameters?.filter(
                            elem => elem.name !== SOURCE_STANDARD
                        );
                        item.externalServices = {
                            ...item.externalServices,
                            parameters: [
                                ...parametersWithoutSourceStandard,
                                {name: SOURCE_STANDARD, value: item.deteSources?.[0]?.assetInfo?.standard},
                            ],
                        };
                    }
                    if (!item?.deteTasks?.deteDeliveries?.length)
                        item.deteTasks.deteDeliveries = [{deliveryMethod: SELECT_VALUES.deliveryMethod[0]}];
                    item.foiStatus =
                        (get(serviceOrder, 'fulfillmentOrderItems', []).find(item => item.external_id === extId) || {})
                            .status || '';
                    const recipient = get(item, 'deteTasks.deteDeliveries[0].externalDelivery.deliverToId', '');
                    if (recipient && !recipientsOptions.hasOwnProperty(recipient)) {
                        getSpecOptions(recipient, source.tenant).then(res => {
                            recp = {
                                ...recp,
                                [recipient]: get(res, 'outputFormats', []).map(item => item.externalMapExternalId),
                            };
                            setRecipientsOptions(prevState => {
                                return {...prevState, ...recp};
                            });
                        });
                    }
                });
            }
        }
        setSelectedSource(source);
    };

    const handleFulfillmentOrderChange = id => {
        if (selectedFulfillmentOrderID !== id) {
            setSelectedFulfillmentOrderID(id);
            setSelectedSource(null);
        }
    };

    const isFormDisabled = selectedOrder => {
        const {readiness, tenant, fs} = selectedOrder;
        return (readiness === readinessStatus.READY && fs !== SERVICERS.DETE) || tenant === TENANTS.WB;
    };

    const cancelEdit = () => {
        setSelectedSource({...selectedSource});
        setSelectedOrder({...selectedOrder});
    };

    return (
        <div className="servicing-order">
            <div className="servicing-order__left">
                {Object.keys(serviceOrder).length > 0 ? (
                    <HeaderSection
                        orderDetails={serviceOrder}
                        handleFulfillmentOrderChange={handleFulfillmentOrderChange}
                        selectedFulfillmentOrder={selectedFulfillmentOrderID}
                        fetchNewPageForFulfillmentOrders={fetchNewPageForFulfillmentOrders}
                        servicingOrderItemsLength={servicingOrderItemsLength}
                    />
                ) : (
                    <Loading />
                )}
            </div>
            <div className="servicing-order__right">
                {Object.keys(serviceOrder).length > 0 ? (
                    <FulfillmentOrder
                        selectedFulfillmentOrder={selectedOrder}
                        setSelectedOrder={setSelectedOrder}
                        setSelectedFulfillmentOrderID={setSelectedFulfillmentOrderID}
                        fetchFulfillmentOrders={fetchFulfillmentOrders}
                        serviceOrder={serviceOrder}
                        updatedServices={updatedServices}
                        cancelEditing={cancelEdit}
                        lastOrder={lastOrder}
                        deteErrors={selectedOrder.errors || []}
                    >
                        {orderOrigin === 'JUICEBOX' ? (
                            <JuiceBoxSection
                                selectedOrder={selectedOrder}
                                setSelectedOrder={setSelectedOrder}
                                isDisabled={isFormDisabled(selectedOrder)}
                            />
                        ) : (
                            <div>
                                {get(selectedOrder, 'definition', null) && (
                                    <SourcesTable
                                        onSelectedSourceChange={handleSelectedSourceChange}
                                        data={sourceRowData}
                                        setUpdatedServices={setUpdatedServices}
                                        isDisabled={isFormDisabled(selectedOrder)}
                                    />
                                )}
                                {selectedSource && (
                                    <ServicesTable
                                        data={selectedSource}
                                        recipientsOptions={recipientsOptions}
                                        isDisabled={isFormDisabled(selectedOrder)}
                                        setUpdatedServices={setUpdatedServices}
                                        components={components}
                                        externalId={selectedOrder.external_id}
                                    />
                                )}
                            </div>
                        )}
                    </FulfillmentOrder>
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
};

export default ServicingOrder;
