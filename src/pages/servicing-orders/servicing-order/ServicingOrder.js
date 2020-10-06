import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get, cloneDeep} from 'lodash';
import {URL} from '../../../util/Common';
import {sortByDateFn} from '../../../util/date-time/DateTimeUtils';
import {servicingOrdersService, getMgmTitleByBarcode, getMgmAssetByBarcode} from '../servicingOrdersService';
import FulfillmentOrder from './components/fulfillment-order/FulfillmentOrder';
import HeaderSection from './components/header-section/HeaderSection';
import ServicesTable from './components/services-table/ServicesTable';
import SourcesTable from './components/sources-table/SourcesTable';
import {prepareRowData, populateMgmData} from './components/sources-table/util';
import './ServicingOrder.scss';

const Loading = 'loading...';

const ServicingOrder = ({match}) => {
    const [serviceOrder, setServiceOrder] = useState({});
    const [selectedFulfillmentOrderID, setSelectedFulfillmentOrderID] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedSource, setSelectedSource] = useState();

    // this piece of state is used for when a service is updated in the services table
    const [updatedServices, setUpdatedServices] = useState({});

    useEffect(() => {
        setSelectedOrder(
            get(serviceOrder, 'fulfillmentOrders', []).find(s => s && s.id === selectedFulfillmentOrderID) || {}
        );
    }, [serviceOrder, selectedFulfillmentOrderID]);

    const fetchFulfillmentOrders = async servicingOrder => {
        if (servicingOrder.so_number) {
            try {
                if (URL.isLocalOrDevOrQA()) {
                    const {
                        fulfillmentOrders,
                        servicingOrderItems,
                    } = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(servicingOrder.so_number);

                    const newFulfillmentOrders = await populateMgmData(fulfillmentOrders);
                    console.log('newFulfillmentOrders: ', newFulfillmentOrders);

                    setServiceOrder({
                        ...servicingOrder,
                        fulfillmentOrders: newFulfillmentOrders,
                        servicingOrderItems,
                    });
                    /* setServiceOrder({
                        ...servicingOrder,
                        fulfillmentOrders,
                        servicingOrderItems,
                    }); */

                    const sortedFulfillmentOrders = sortByDateFn(newFulfillmentOrders, 'definition.dueDate');
                    setSelectedFulfillmentOrderID(get(sortedFulfillmentOrders, '[0].id', ''));
                    setSelectedOrder(sortedFulfillmentOrders[0]);
                    // console.log('sortedFulfillmentOrders: ', sortedFulfillmentOrders);
                } else {
                    const fulfillmentOrders = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(
                        servicingOrder.so_number
                    );

                    setServiceOrder({
                        ...servicingOrder,
                        fulfillmentOrders,
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
    // console.log('selecedOrder: ', selectedOrder);

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

    console.log('state changed: ', selectedOrder);

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
                    cancelEditing={() => setSelectedSource({...selectedSource})}
                >
                    <SourcesTable
                        data={prepareRowData(selectedOrder)}
                        onSelectedSourceChange={handleSelectedSourceChange}
                    />
                    {selectedSource && (
                        <ServicesTable
                            data={selectedSource}
                            isDisabled={isFormDisabled(selectedOrder)}
                            setUpdatedServices={setUpdatedServices}
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
