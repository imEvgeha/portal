import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {get} from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import FilterSolidIcon from '../../../../../assets/filter-solid.svg';
import FilterIcon from '../../../../../assets/filter.svg';
import {SERVICING_ORDERS} from '../../../../../ui/elements/nexus-navigation/constants';
import {getValidDate} from '../../../../../util/utils';
import {backArrowColor} from '../../../../legacy/constants/avails/constants';
import {SORT_DIRECTION} from '../filter-section/constants';
import ServiceOrderFilter from '../filter-section/ServiceOrderFilter';
import Constants from '../fulfillment-order/constants';
import FulfillmentOrderPanel from '../fulfillment-order-panel/FulfillmentOrderPanel';
import './HeaderSection.scss';

const HeaderSection = ({orderDetails, handleFulfillmentOrderChange, selectedFulfillmentOrder}) => {
    const [showFilter, setShowFilter] = useState(true);
    const [filter, setFilter] = useState({ value: 'All', label: 'All' });
    const [dueDateSortDirection, setDueDateSortDirection] = useState(SORT_DIRECTION[0]);

    const toggleFilters = () => setShowFilter(!showFilter);
    const getFilteredList = () => {
        let filteredList = [];
        if (orderDetails.fulfillmentOrders && Array.isArray(orderDetails.fulfillmentOrders)) {
            if (!filter || filter.value === 'All') {
                filteredList = orderDetails.fulfillmentOrders;
            } else {
                filteredList = orderDetails.fulfillmentOrders.filter(
                    item => item.status === filter.value
                );
            }
        }
        return filteredList;
    };

    const sortByDueDate = (prevFulfillmentOrder, currFulfillmentOrder) => {
        const getMomentDueDate = fulfillmentOrder => {
            return moment(get(fulfillmentOrder, 'definition.dueDate'));
        };

        const prevFulfillmentOrderDueDate = getMomentDueDate(prevFulfillmentOrder);
        const currFulfillmentOrderDueDate = getMomentDueDate(currFulfillmentOrder);
        const diff = prevFulfillmentOrderDueDate.diff(currFulfillmentOrderDueDate);

        switch (dueDateSortDirection.value) {
            case 'NONE':
                return 0;

            case 'ASCENDING':
                return diff;

            case 'DESCENDING':
                return -diff;
        }
    };

    return (
        <div className="panel-header">
            <div className="panel-header__title">
                <div className="panel-header__title--section">
                    <Link to={`/${SERVICING_ORDERS.toLowerCase()}`}>
                        <ArrowLeftIcon size="large" primaryColor={backArrowColor} />
                    </Link>
                    <h1>Servicing Order</h1>
                </div>
                <div className="panel-header__filter">
                    <div onClick={toggleFilters}>
                        {showFilter ? <FilterSolidIcon /> : <FilterIcon />}
                    </div>
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
                {getFilteredList()
                    .sort(sortByDueDate)
                    .map(({id, external_id, status, definition: {dueDate} = {}}, index) => (
                        <FulfillmentOrderPanel
                            key={index}
                            id={id}
                            external_id={external_id}
                            status={status}
                            dueDate={getValidDate(dueDate)}
                            selected={selectedFulfillmentOrder === id}
                            handleFulfillmentOrderChange={handleFulfillmentOrderChange}
                        />
                    ))}
            </div>
        </div>
    );
};

HeaderSection.propTypes = {
    orderDetails: PropTypes.object.isRequired,
    handleFulfillmentOrderChange: PropTypes.func,
    selectedFulfillmentOrder: PropTypes.string
};

HeaderSection.defaultProps = {
    handleFulfillmentOrderChange: () => null,
    selectedFulfillmentOrder: ''
};
export default HeaderSection;
