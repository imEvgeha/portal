import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {backArrowColor} from '../../../../../legacy/constants/avails/constants';
import {SERVICING_ORDERS} from '../../../../../../ui/elements/nexus-navigation/constants';
import './HeaderSection.scss';
import FulfillmentOrderPanel from '../FulfillmentOrderPanel/FulfillmentOrderPanel';

const HeaderSection = ({fulfillmentOrders, setSelectedFulfillmentOrder, selectedFulfillmentOrder}) => {

    return (
        <div className='panel-header'>
            <div className='panel-header__title'>
                <Link to={`/${SERVICING_ORDERS.toLowerCase()}`}>
                    <ArrowLeftIcon size='large' primaryColor={backArrowColor} />
                </Link>
                <span className='panel-header__title--text'>Servicing Order</span>
            </div>
            <div
                className='panel-header__list'
            >
                {
                    fulfillmentOrders && fulfillmentOrders.map(({fulfillmentOrderId, status, dueDate},index) => (
                        <FulfillmentOrderPanel
                            key={index}
                            id={fulfillmentOrderId}
                            status={status}
                            dueDate={dueDate}
                            selected={selectedFulfillmentOrder === fulfillmentOrderId}
                            setSelectedFulfillmentOrder={setSelectedFulfillmentOrder}
                        />
                        )
                    )
                }
            </div>
        </div>
    );
};

export default HeaderSection;