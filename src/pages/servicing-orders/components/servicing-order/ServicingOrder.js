import React, {useEffect, useState} from 'react';
import HeaderSection from './components/HeaderSection/HeaderSection';
import FulfillmentOrder from './components/FulfillmentOrder/FulfillmentOrder';
import './ServicingOrder.scss';
import {servicingOrdersService} from '../../servicingOrdersService';
import {get} from 'lodash';

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
