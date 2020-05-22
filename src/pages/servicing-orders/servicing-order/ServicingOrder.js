import React, {useEffect, useState} from 'react';
import {get} from 'lodash';
import HeaderSection from './components/header-section/HeaderSection';
import FulfillmentOrder from './components/fulfillment-order/FulfillmentOrder';
import './ServicingOrder.scss';
import {servicingOrdersService} from '../servicingOrdersService';
import SourcesTable from './components/sources-table/SourcesTable';

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
                <HeaderSection
                    orderDetails={serviceOrder}
                    setSelectedFulfillmentOrder={setSelectedFulfillmentOrderID}
                    selectedFulfillmentOrder={selectedFulfillmentOrderID}
                />
            </div>
            <div className='servicing-order__right'>
                <FulfillmentOrder selectedFulfillmentOrder={selectedOrder} />
                <div className='servicing-order__tables'>
                    <SourcesTable />
                </div>
            </div>
        </div>
    );
};

ServicingOrder.propTypes = {};

ServicingOrder.defaultProps = {};

export default ServicingOrder;
