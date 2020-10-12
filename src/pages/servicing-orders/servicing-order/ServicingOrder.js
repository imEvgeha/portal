import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {URL} from '../../../util/Common';
import {sortByDateFn} from '../../../util/date-time/DateTimeUtils';
import {servicingOrdersService} from '../servicingOrdersService';
import FulfillmentOrder from './components/fulfillment-order/FulfillmentOrder';
import HeaderSection from './components/header-section/HeaderSection';
import ServicesTable from './components/services-table/ServicesTable';
import SourcesTable from './components/sources-table/SourcesTable';
import {
    prepareRowData,
    populateLoading,
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

    // this piece of state is used for when a service is updated in the services table
    const [updatedServices, setUpdatedServices] = useState({});
    const [isSaved, setIsSaved] = useState(false);

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

                    setServiceOrder({
                        ...servicingOrder,
                        fulfillmentOrders: populateLoading(fulfillmentOrders),
                        servicingOrderItems,
                    });
                    const barcodes = getBarCodes(fulfillmentOrders);
                    fetchAssetInfo(barcodes).then(assetInfo => {
                        const newFulfillmentOrders = populateAssetInfo(fulfillmentOrders, assetInfo);
                        setServiceOrder({
                            ...servicingOrder,
                            fulfillmentOrders: newFulfillmentOrders,
                            servicingOrderItems,
                        });
                        setSelectedFulfillmentOrderID(get(newFulfillmentOrders, '[0].id', ''));
                        setSelectedOrder(newFulfillmentOrders[0]);
                    });

                    setSelectedFulfillmentOrderID(get(fulfillmentOrders, '[0].id', ''));
                } else {
                    const fulfillmentOrders = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(
                        servicingOrder.so_number
                    );
                    setServiceOrder({
                        ...servicingOrder,
                        fulfillmentOrders: populateLoading(fulfillmentOrders),
                    });
                    const barcodes = getBarCodes(fulfillmentOrders);
                    fetchAssetInfo(barcodes).then(assetInfo => {
                        const newFulfillmentOrders = populateAssetInfo(fulfillmentOrders, assetInfo);
                        setServiceOrder({
                            ...servicingOrder,
                            fulfillmentOrders: newFulfillmentOrders,
                        });
                    });

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
        // CURRENT SELECTED SOURCE
        setSelectedSource(source);
    };

    const handleFulfillmentOrderChange = id => {
        if (selectedFulfillmentOrderID !== id) {
            setSelectedFulfillmentOrderID(id);
            setSelectedSource(null);
        }
    };

    const isFormDisabled = selectedOrder => {
        const {readiness} = selectedOrder;
        return readiness === 'READY';
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
                    cancelEditing={() => {
                        setSelectedSource({...selectedSource});
                        setSelectedOrder({...selectedOrder});
                    }}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                    lastOrder={lastOrder}
                >
                    <SourcesTable
                        onSelectedSourceChange={handleSelectedSourceChange}
                        data={prepareRowData(selectedOrder)}
                        setUpdatedServices={setUpdatedServices}
                        isDisabled={isFormDisabled(selectedOrder)}
                        setIsSaved={setIsSaved}
                    />
                    {selectedSource && (
                        <ServicesTable
                            data={selectedSource}
                            isDisabled={isFormDisabled(selectedOrder)}
                            setUpdatedServices={setUpdatedServices}
                            setIsSaved={setIsSaved}
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
