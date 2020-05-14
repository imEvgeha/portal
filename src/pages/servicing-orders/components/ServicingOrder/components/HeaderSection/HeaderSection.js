import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {backArrowColor} from '../../../../../legacy/constants/avails/constants';
import {SERVICING_ORDERS} from '../../../../../../ui/elements/nexus-navigation/constants';
import './HeaderSection.scss';
import FulfillmentOrderPanel from '../FulfillmentOrderPanel/FulfillmentOrderPanel';

const HeaderSection = () => {
    const [selectedFulfillmentOrder, setSelectedFulfillmentOrder] = useState('');
    const setSelectedOrder = (id) => setSelectedFulfillmentOrder(id);
const fulfillmentOrders =  [
    {
        fulfillmentOrderId: 'VU000134567-001',
        dueDate: '10/05/2021',
        status: 'COMPLETED'
    },
    {
        fulfillmentOrderId: 'VU000134597-002',
        dueDate: '09/05/2021',
        status: 'PENDING'
    }
];

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
                    fulfillmentOrders.map(({fulfillmentOrderId, status, dueDate},index) => (
                        <FulfillmentOrderPanel
                            key={index}
                            id={fulfillmentOrderId}
                            status={status}
                            dueDate={dueDate}
                            selected={selectedFulfillmentOrder === fulfillmentOrderId}
                            setSelectedFulfillmentOrder={setSelectedOrder}
                        />
                        )
                    )
                }
            </div>
        </div>
    );
};

export default HeaderSection;