import React from 'react';
import ServicingOrdersTable from './components/servicing-orders-table/ServicingOrdersTable';
import './ServicingOrdersView.scss';

const ServicingOrdersView = () => {
    return (
        <div className='nexus-c-servicing-orders'>
            <div className='nexus-c-servicing-orders__title'>
                Servicing Orders
            </div>
            <ServicingOrdersTable />
        </div>
    );
};

export default ServicingOrdersView;