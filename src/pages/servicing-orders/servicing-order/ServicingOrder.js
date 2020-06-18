import {get} from 'lodash';
import React, {useEffect, useState} from 'react';
import {servicingOrdersService} from '../servicingOrdersService';
import FulfillmentOrder from './components/fulfillment-order/FulfillmentOrder';
import HeaderSection from './components/header-section/HeaderSection';
import ServicesTable from './components/services-table/ServicesTable';
import SourcesTable from './components/sources-table/SourcesTable';
import {prepareRowData} from './components/sources-table/util';
import './ServicingOrder.scss';

const ServicingOrder = ({match}) => {
    const [serviceOrder, setServiceOrder] = useState({});
    const [selectedFulfillmentOrderID, setSelectedFulfillmentOrderID] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedSource, setSelectedSource] = useState();

    useEffect(
        () => {
            setSelectedOrder(
                get(serviceOrder, 'fulfillmentOrders', []).find(
                    s => s && s.id === selectedFulfillmentOrderID
                ) || {}
            );
        },
        [serviceOrder, selectedFulfillmentOrderID]
    );

    const fetchFulfillmentOrders = async servicingOrder => {
        if (servicingOrder.so_number) {
            try {
                const fulfillmentOrders = await servicingOrdersService.getFulfilmentOrdersForServiceOrder(
                    servicingOrder.so_number
                );

                const parsedFulfillmentOrders = fulfillmentOrders.map(fo => {
                    let {definition} = fo || {};
                    const parsedDefinition = definition ? JSON.parse(definition) : {};
                    return {...fo, definition: parsedDefinition};
                });

                setServiceOrder({
                    ...servicingOrder,
                    fulfillmentOrders: parsedFulfillmentOrders
                });
                setSelectedFulfillmentOrderID(get(parsedFulfillmentOrders, '[0].id', ''));
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
    }, []);

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
                    fetchFulfillmentOrders={fetchFulfillmentOrders}
                    serviceOrder={serviceOrder}
                >
                    <SourcesTable
                        data={prepareRowData(selectedOrder)}
                        onSelectedSourceChange={handleSelectedSourceChange}
                    />
                    {
                        selectedSource && (
                        <ServicesTable
                            data={selectedSource}
                            isDisabled={isFormDisabled(selectedOrder)}
                        />
                        )
                    }
                </FulfillmentOrder>
            </div>
        </div>
    );
};

ServicingOrder.propTypes = {};

ServicingOrder.defaultProps = {};

export default ServicingOrder;
