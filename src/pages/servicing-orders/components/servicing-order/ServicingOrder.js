import React, {useEffect, useState} from 'react';
import {get} from 'lodash';
import {servicingOrdersService} from '../../servicingOrdersService';
import HeaderSection from './components/HeaderSection/HeaderSection';
import FulfillmentOrder from './components/FulfillmentOrder/FulfillmentOrder';
import './ServicingOrder.scss';

const ServicingOrder = ({match}) => {
    const [serviceOrder, setServiceOrder] = useState({});
    const [selectedFulfillmentOrderID, setSelectedFulfillmentOrderID] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({});

    useEffect(() => {
        setSelectedOrder(get(serviceOrder, 'fulfillmentOrders', []).find(s=> s && s.fulfillmentOrderId === selectedFulfillmentOrderID) || {});
    }, [serviceOrder, selectedFulfillmentOrderID]);

    useEffect(() => {
        servicingOrdersService.getServicingOrderById(match.params.id) .then(res => {
            const servicingOrder = res['servicingOrder'];
            setServiceOrder(servicingOrder.data || {});
            setSelectedFulfillmentOrderID(get(servicingOrder, 'data.fulfillmentOrders[0].fulfillmentOrderId', ''));
        });
    }, []);

    return (
        <div className='servicing-order'>
            <div className='servicing-order__left'>
                {
                    serviceOrder && Array.isArray(serviceOrder.fulfillmentOrders) && (
                    <HeaderSection
                        orderDetails={serviceOrder}
                        setSelectedFulfillmentOrder={setSelectedFulfillmentOrderID}
                        selectedFulfillmentOrder={selectedFulfillmentOrderID}
                    />
                    )
                }
            </div>
            <div className='servicing-order__right'>
                <FulfillmentOrder selectedFulfillmentOrder={selectedOrder} />
            </div>
        </div>
    );
};

ServicingOrder.propTypes = {};

ServicingOrder.defaultProps = {};

export default ServicingOrder;
