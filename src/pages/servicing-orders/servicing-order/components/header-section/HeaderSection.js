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

const HeaderSection = ({orderDetails, handleFulfillmentOrderChange, selectedFulfillmentOrder}) => {
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState('');
    const toggleFilters = () => setShowFilter(!showFilter);
    const getFilteredList = () => {
        let filteredList = [];
        if(orderDetails.fulfillmentOrders && Array.isArray(orderDetails.fulfillmentOrders)) {
            if(!filter || filter.value === 'All')
                filteredList =  orderDetails.fulfillmentOrders;
            else
                filteredList = orderDetails.fulfillmentOrders.filter(item=> item.status === filter.value);
        }
        return filteredList;
    };

    return (
        <div className='panel-header'>
            <div className='panel-header__title'>
                <div className='panel-header__title--section'>
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
                showFilter && <ServiceOrderFilter orderDetails={orderDetails || {}} filter={filter} setFilter={setFilter} />
            }
            <div className='panel-header__list'>
                {
                    getFilteredList().map(({fulfillmentOrderId, status, dueDate},index) => (
                        <FulfillmentOrderPanel
                            key={index}
                            id={fulfillmentOrderId}
                            status={status}
                            dueDate={dueDate}
                            selected={selectedFulfillmentOrder === fulfillmentOrderId}
                            handleFulfillmentOrderChange={handleFulfillmentOrderChange}
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
    handleFulfillmentOrderChange: PropTypes.func,
    selectedFulfillmentOrder: PropTypes.string,
};

HeaderSection.defaultProps = {
    handleFulfillmentOrderChange: () => null,
    selectedFulfillmentOrder: '',
};
export default HeaderSection;
