import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {backArrowColor} from '../../../../legacy/constants/avails/constants';
import {SERVICING_ORDERS} from '../../../../../ui/elements/nexus-navigation/constants';
import './HeaderSection.scss';
import FulfillmentOrderPanel from '../fulfillment-order-panel/FulfillmentOrderPanel';
import FilterSolidIcon from '../../../../../assets/filter-solid.svg';
import FilterIcon from '../../../../../assets/filter.svg';
import ServiceOrderFilter from '../filter-section/ServiceOrderFilter';

const HeaderSection = ({orderDetails, setSelectedFulfillmentOrder, selectedFulfillmentOrder}) => {
    const [showFilter, setShowFilter] = useState(false);
    const toggleFilters = () => setShowFilter(!showFilter);

    return (
        <div className='panel-header'>
            <div className='panel-header__title'>
                <div>
                    <Link to={`/${SERVICING_ORDERS.toLowerCase()}`}>
                        <ArrowLeftIcon size='large' primaryColor={backArrowColor} />
                    </Link>
                    <span className='panel-header__title--text'>Servicing Order</span>
                </div>
                <div className='panel-header__filter'>
                    <div onClick={toggleFilters}>
                        {
                            showFilter ? <FilterSolidIcon /> : <FilterIcon />
                        }
                    </div>
                </div>
            </div>
            {
                showFilter && <ServiceOrderFilter orderDetails={orderDetails || {}} />
            }
            <div
                className='panel-header__list'
            >
                {
                    orderDetails && orderDetails.fulfillmentOrders && Array.isArray(orderDetails.fulfillmentOrders) && orderDetails.fulfillmentOrders.map(({fulfillmentOrderId, status, dueDate},index) => (
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

HeaderSection.propTypes = {
    orderDetails: PropTypes.object.isRequired,
    setSelectedFulfillmentOrder: PropTypes.func,
    selectedFulfillmentOrder: PropTypes.string,
};

HeaderSection.defaultProps = {
    setSelectedFulfillmentOrder: ()=>null,
    selectedFulfillmentOrder: '',
};
export default HeaderSection;
