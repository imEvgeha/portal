import React, {useEffect, useState} from 'react';
import HeaderSection from './components/HeaderSection/HeaderSection';
import FulfillmentOrder from './components/FulfillmentOrder/FulfillmentOrder';
import './ServicingOrder.scss';
import {servicingOrdersService} from '../../servicingOrdersService';
import {isObject} from '../../../../util/Common';
import {get} from 'lodash';

const ServicingOrder = ({match}) => {
    const [serviceOrder, setServiceOrder] = useState(null);
    const [selectedFulfillmentOrder, setSelectedFulfillmentOrder] = useState('');
    const setSelectedOrder = (id) => setSelectedFulfillmentOrder(id);
    const selectedOrder = get(serviceOrder, 'fulfillmentOrders', []).find(s=> s && s.fulfillmentOrderId === selectedFulfillmentOrder);

    useEffect(() => {
        servicingOrdersService.getServicingOrderById(match.params.id) .then(res => {
            const servicingOrder = res['servicingOrder'];
            setServiceOrder(servicingOrder.data);
        });
    }, []);
    
    return (
        <div className='servicing-order'>
            {
                serviceOrder && isObject(serviceOrder) &&
                (
                    <>
                        <div className='servicing-order__left'>
                            <HeaderSection
                                fulfillmentOrders={serviceOrder['fulfillmentOrders']}
                                orderDetails={serviceOrder}
                                setSelectedFulfillmentOrder={setSelectedOrder}
                                selectedFulfillmentOrder={selectedFulfillmentOrder}
                            />
                        </div>
                        <div className='servicing-order__right'>
                            {selectedOrder && <FulfillmentOrder selectedFulfillmentOrder={selectedOrder} />}
                        </div>
                    </>
                )
            }
        </div>
    );
};

ServicingOrder.propTypes = {};

ServicingOrder.defaultProps = {};

export default ServicingOrder;