import React, {useEffect, useState} from 'react';
import {get} from 'lodash';
import HeaderSection from './components/header-section/HeaderSection';
import FulfillmentOrder from './components/fulfillment-order/FulfillmentOrder';
import './ServicingOrder.scss';
import {servicingOrdersService} from '../servicingOrdersService';
import SourcesTable from './components/sources-table/SourcesTable';
import ServicesTable from './components/services-table/ServicesTable';
import {prepareRowData} from './components/sources-table/util';

const ServicingOrder = ({match}) => {
    const [serviceOrder, setServiceOrder] = useState({});
    const [selectedFulfillmentOrderID, setSelectedFulfillmentOrderID] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedSource, setSelectedSource] = useState();

    useEffect(() => {
        setSelectedOrder(get(serviceOrder, 'fulfillmentOrders', []).find(s=> s && s.fulfillmentOrderId === selectedFulfillmentOrderID) || {});
    }, [serviceOrder, selectedFulfillmentOrderID]);

    useEffect(() => {
        servicingOrdersService.getServicingOrderById(match.params.id) .then(res => {
            const servicingOrder = res['servicingOrder'];
            setServiceOrder(servicingOrder.data || {});
        });
    }, []);

    const handleSelectedSourceChange = source => {
        // CURRENT SELECTED SOURCE
        setSelectedSource(source);

    };
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
                <FulfillmentOrder selectedFulfillmentOrder={selectedOrder}>
                    <SourcesTable
                        data={prepareRowData(selectedOrder)}
                        onSelectedSourceChange={handleSelectedSourceChange}
                    />
                    {selectedSource &&
                        <ServicesTable data={selectedSource} />}

                </FulfillmentOrder>
            </div>
        </div>
    );
};

ServicingOrder.propTypes = {};

ServicingOrder.defaultProps = {};

export default ServicingOrder;
