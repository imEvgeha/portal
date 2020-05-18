import React, {useEffect, useState} from 'react';
import HeaderSection from './components/HeaderSection/HeaderSection';
import FulfillmentOrder from './components/FulfillmentOrder/FulfillmentOrder';
import './ServicingOrder.scss';
import {servicingOrdersService} from '../../servicing-orders-table/servicingOrdersService';

const ServicingOrder = ({match}) => {
    const [fulfillmentOrders, setFulfillmentOrders] = useState([]);
    const [selectedFulfillmentOrder, setSelectedFulfillmentOrder] = useState('');
    const setSelectedOrder = (id) => setSelectedFulfillmentOrder(id);

    useEffect(() => {
        servicingOrdersService.getServicingOrderById(match.params.id) .then(res => {
            const servicingOrder = res['servicingOrder'];
            setFulfillmentOrders(servicingOrder.data['fulfillmentOrders']);
        });
    }, []);
    
    return (
        <div className='servicing-order'>
            <div className='servicing-order__left'>
                <HeaderSection
                    fulfillmentOrders={fulfillmentOrders}
                    setSelectedFulfillmentOrder={setSelectedOrder}
                    selectedFulfillmentOrder={selectedFulfillmentOrder}
                />
            </div>
            <div className='servicing-order__right'>
                <FulfillmentOrder selectedFulfillmentOrder={selectedFulfillmentOrder} />
            </div>
        </div>
    );
};

ServicingOrder.propTypes = {};

ServicingOrder.defaultProps = {};

export default ServicingOrder;