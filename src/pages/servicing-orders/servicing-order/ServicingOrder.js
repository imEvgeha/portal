import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {get} from 'lodash';
import {sortByDateFn} from '../../../util/date-time/DateTimeUtils';
import {servicingOrdersService, getSpecOptions} from '../servicingOrdersService';
import FulfillmentOrder from './components/fulfillment-order/FulfillmentOrder';
import HeaderSection from './components/header-section/HeaderSection';
import ServicesTable from './components/services-table/ServicesTable';
import SourcesTable from './components/sources-table/SourcesTable';
import {
    prepareRowData,
    showLoading,
    fetchAssetInfo,
    getBarCodes,
    populateAssetInfo,
} from './components/sources-table/util';
import './ServicingOrder.scss';

const ServicingOrder = ({match}) => {
    const [serviceOrder, setServiceOrder] = useState({});
    const [selectedFulfillmentOrderID, setSelectedFulfillmentOrderID] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedSource, setSelectedSource] = useState();
    const [lastOrder, setLastOrder] = useState({});
    const [components, setComponents] = useState([]);
    const [deteErrors, setDeteErrors] = useState([]);
    const [recipientsSpecs, setRecipientsSpecs] = useState({});

    // this piece of state is used for when a service is updated in the services table
    const [updatedServices, setUpdatedServices] = useState({});

    useEffect(() => {
        const order =
            get(serviceOrder, 'fulfillmentOrders', []).find(s => s && s.id === selectedFulfillmentOrderID) || {};
        setSelectedOrder(order);
        setLastOrder(order);
    }, [serviceOrder, selectedFulfillmentOrderID]);

    const fetchFulfillmentOrders = async servicingOrder => {
        if (servicingOrder.so_number) {
            try {
                if (URL.isLocalOrDevOrQA()) {
                    let {
                        fulfillmentOrders,
                        servicingOrderItems,
                    } = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(servicingOrder.so_number);

                    fulfillmentOrders = sortByDateFn(fulfillmentOrders, 'definition.dueDate');
                    setDeteErrors(fulfillmentOrders.errors || []);

                    setServiceOrder({
                        ...servicingOrder,
                        fulfillmentOrders: showLoading(fulfillmentOrders),
                        servicingOrderItems,
                    });
                    const barcodes = getBarCodes(fulfillmentOrders);
                    fetchAssetInfo(barcodes).then(assetInfo => {
                        const newFulfillmentOrders = populateAssetInfo(fulfillmentOrders, assetInfo[0]);
                        setServiceOrder({
                            ...servicingOrder,
                            fulfillmentOrders: newFulfillmentOrders,
                            servicingOrderItems,
                        });
                        // Todo remove below comments after nothing is broken in SO page. kbora
                        // setSelectedFulfillmentOrderID(get(newFulfillmentOrders, '[0].id', ''));
                        // setSelectedOrder(newFulfillmentOrders[0]);
                        setComponents(assetInfo[1]);
                    });

                    setSelectedFulfillmentOrderID(get(fulfillmentOrders, '[0].id', ''));
                } else {
                    const fulfillmentOrders = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(
                        servicingOrder.so_number
                    );

                    setServiceOrder({
                        ...servicingOrder,
                        ...fulfillmentOrders,
                    });
                    /*
                    Todo : uncomment below when MGM stories are done
                    const barcodes = getBarCodes(fulfillmentOrders);
                    fetchAssetInfo(barcodes).then(assetInfo => {
                        const newFulfillmentOrders = populateAssetInfo(fulfillmentOrders, assetInfo);
                        setServiceOrder({
                            ...servicingOrder,
                            fulfillmentOrders: newFulfillmentOrders,
                        });
                        setSelectedFulfillmentOrderID(get(newFulfillmentOrders, '[0].id', ''));
                    });
                    */
                    setSelectedFulfillmentOrderID(get(fulfillmentOrders, '[0].id', ''));
                }
            } catch (e) {
                setServiceOrder(servicingOrder);
            }
        } else {
            setServiceOrder(servicingOrder);
        }
    };

    useEffect(() => {
        servicingOrdersService.getServicingOrderById(match.params.id).then(servicingOrder => {
            if (servicingOrder) {
                fetchFulfillmentOrders(servicingOrder);
            } else {
                setServiceOrder({});
            }
        });
    }, [match]);

    const handleSelectedSourceChange = source => {
        // upon source change, call format sheets api if not already called for recipient
        if (source) {
            if (Array.isArray(source.deteServices) && source.deteServices.length > 0) {
                let recp = {};
                source.deteServices.forEach(item => {
                    const recipient = get(item, 'deteTasks.deteDeliveries[0].externalDelivery.deliverToId', '');
                    if (recipient && !recipientsSpecs.hasOwnProperty(recipient)) {
                        getSpecOptions(recipient, source.tenant).then(res => {
                            recp = {...recp, [recipient]: res.outputFormats.map(item => item.outputTemplateName)};
                            setSelectedSource(prevState => {
                                return {...prevState, ...source, recipientsSpecs: recp};
                            });
                            setRecipientsSpecs(prevState => {
                                return {...prevState, ...recp};
                            });
                        });
                    } else {
                        setSelectedSource(prevState => {
                            return {...prevState, ...source, recipientsSpecs};
                        });
                    }
                });
            } else {
                setSelectedSource(prevState => {
                    return {...prevState, ...source};
                });
            }
        }
    };

    const handleFulfillmentOrderChange = id => {
        if (selectedFulfillmentOrderID !== id) {
            setSelectedFulfillmentOrderID(id);
            setSelectedSource(null);
        }
    };

    const isFormDisabled = selectedOrder => {
        const {readiness, tenant} = selectedOrder;
        return readiness === 'READY' || tenant === 'WB';
    };

    const cancelEdit = () => {
        setSelectedSource({...selectedSource});
        setSelectedOrder({...selectedOrder});
    };

    return (
        <div className="servicing-order">
            <div className="servicing-order__left">
                {serviceOrder && (
                    <HeaderSection
                        orderDetails={serviceOrder}
                        handleFulfillmentOrderChange={handleFulfillmentOrderChange}
                        selectedFulfillmentOrder={selectedFulfillmentOrderID}
                    />
                )}
            </div>
            <div className="servicing-order__right">
                <FulfillmentOrder
                    selectedFulfillmentOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrder}
                    setSelectedFulfillmentOrderID={setSelectedFulfillmentOrderID}
                    fetchFulfillmentOrders={fetchFulfillmentOrders}
                    serviceOrder={serviceOrder}
                    updatedServices={updatedServices}
                    cancelEditing={cancelEdit}
                    lastOrder={lastOrder}
                >
                    <SourcesTable
                        onSelectedSourceChange={handleSelectedSourceChange}
                        data={prepareRowData(selectedOrder)}
                        setUpdatedServices={setUpdatedServices}
                        isDisabled={isFormDisabled(selectedOrder)}
                    />
                    {selectedSource && (
                        <ServicesTable
                            data={selectedSource}
                            isDisabled={isFormDisabled(selectedOrder)}
                            setUpdatedServices={setUpdatedServices}
                            components={components}
                            deteErrors={deteErrors}
                        />
                    )}
                </FulfillmentOrder>
            </div>
        </div>
    );
};

ServicingOrder.propTypes = {
    match: PropTypes.object,
};

ServicingOrder.defaultProps = {
    match: {},
};

export default ServicingOrder;
