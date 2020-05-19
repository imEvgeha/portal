import React from 'react';
import HeaderSection from './components/HeaderSection/HeaderSection';
import FulfillmentOrder from './components/FulfillmentOrder/FulfillmentOrder';
import './ServicingOrder.scss';

const ServicingOrder = () => {
    return (
        <div className='servicing-order'>
            <div className='servicing-order__left'>
                <HeaderSection />
            </div>
            <div className='servicing-order__right'>
                <FulfillmentOrder />
            </div>
        </div>
    );
};

ServicingOrder.propTypes = {};

ServicingOrder.defaultProps = {};

export default ServicingOrder;