import React, {useEffect, useState} from 'react';
import HeaderSection from './components/HeaderSection/HeaderSection';
import FulfillmentOrder from './components/FulfillmentOrder/FulfillmentOrder';
import './ServicingOrder.scss';
import {servicingOrdersService} from '../../../servicing-orders/servicingOrdersService';
import {isObject} from '../../../../util/Common';

const ServicingOrder = ({match}) => {
    const [serviceOrder, setServiceOrder] = useState(null);
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
                            <HeaderSection fulfillmentOrders={serviceOrder['fulfillmentOrders']} orderDetails={serviceOrder} />
                        </div>
                        <div className='servicing-order__right'>
                            <FulfillmentOrder />
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