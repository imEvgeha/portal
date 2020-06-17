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
        setSelectedOrder(get(serviceOrder, 'fulfillmentOrders', []).find(s=> s && s.id === selectedFulfillmentOrderID) || {});
    }, [serviceOrder, selectedFulfillmentOrderID]);

    useEffect(() => {
        servicingOrdersService.getServicingOrderById(match.params.id).then(servicingOrder => {
            if(servicingOrder) {
                if (servicingOrder.so_number) {
                    servicingOrdersService.getFulfilmentOrdersForServiceOrder(servicingOrder.so_number).then(fulfillmentOrders => {
                        //convert definition field from string to json for each fulfillmentOrder
                        const parsedFulfillmentOrders = fulfillmentOrders.map((fo) => {
                            let {definition} = fo || {};
                            const parsedDefinition = definition ? JSON.parse(definition) : {};
                            return {...fo, definition: parsedDefinition};
                        });

                        setServiceOrder({...servicingOrder, fulfillmentOrders: parsedFulfillmentOrders});
                        setSelectedFulfillmentOrderID(get(parsedFulfillmentOrders, '[0].id', ''));
                    }).catch(() => {
                        setServiceOrder(servicingOrder);
                    });
                } else {
                    setServiceOrder(servicingOrder);
                }
            }else{
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
        <div className='servicing-order'>
            <div className='servicing-order__left'>
                {
                    serviceOrder && (
                    <HeaderSection
                        orderDetails={serviceOrder}
                        handleFulfillmentOrderChange={handleFulfillmentOrderChange}
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
                    {selectedSource && (
                        <ServicesTable
                            data={selectedSource}
                            isDisabled={isFormDisabled(selectedOrder)}
                        />
                      )}
                </FulfillmentOrder>
            </div>
        </div>
    );
};

ServicingOrder.propTypes = {};

ServicingOrder.defaultProps = {};

export default ServicingOrder;
