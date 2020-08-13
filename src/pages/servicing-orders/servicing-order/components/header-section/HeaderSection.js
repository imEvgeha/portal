import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {Link} from 'react-router-dom';
import FilterSolidIcon from '../../../../../assets/filter-solid.svg';
import FilterIcon from '../../../../../assets/filter.svg';
import {SERVICING_ORDERS} from '../../../../../ui/elements/nexus-navigation/constants';
import {backArrowColor} from '../../../../legacy/constants/avails/constants';
import ServiceOrderFilter from '../filter-section/ServiceOrderFilter';
import {SORT_DIRECTION} from '../filter-section/constants';
import FulfillmentOrderPanels from '../fulfillment-order-panels/FulfillmentOrderPanels';
import './HeaderSection.scss';

const HeaderSection = ({orderDetails, handleFulfillmentOrderChange, selectedFulfillmentOrder}) => {
    const {fulfillmentOrders} = orderDetails;
    const [showFilter, setShowFilter] = useState(true);
    const [filter, setFilter] = useState({value: 'All', label: 'All'});
    const [dueDateSortDirection, setDueDateSortDirection] = useState(SORT_DIRECTION[0]);

    const toggleFilters = () => setShowFilter(!showFilter);
    const getFilteredList = () => {
        let filteredList = [];
        if (fulfillmentOrders && Array.isArray(fulfillmentOrders)) {
            if (!filter || filter.value === 'All') {
                filteredList = fulfillmentOrders;
            } else {
                filteredList = fulfillmentOrders.filter(item => item.status === filter.value);
            }
        }
        return filteredList;
    };

    return (
        <div className="panel-header">
            <div className="panel-header__title">
                <div className="panel-header__title--section">
                    <Link to={`/${SERVICING_ORDERS.toLowerCase()}`}>
                        <ArrowLeftIcon size="large" primaryColor={backArrowColor} />
                    </Link>
                    <span className="panel-header__title--text">Servicing Order</span>
                </div>
                <div className="panel-header__filter">
                    <div onClick={toggleFilters}>{showFilter ? <FilterSolidIcon /> : <FilterIcon />}</div>
                </div>
            </div>
            {showFilter && (
                <ServiceOrderFilter
                    orderDetails={orderDetails || {}}
                    filter={filter}
                    setFilter={setFilter}
                    dueDateSortDirection={dueDateSortDirection}
                    setDueDateSortDirection={setDueDateSortDirection}
                />
            )}
            <div className="panel-header__list">
                <FulfillmentOrderPanels
                    orderDetails={orderDetails}
                    dueDateSortDirection={dueDateSortDirection}
                    selectedFulfillmentOrder={selectedFulfillmentOrder}
                    fulfillmentOrders={getFilteredList()}
                    handleFulfillmentOrderChange={handleFulfillmentOrderChange}
                />
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
