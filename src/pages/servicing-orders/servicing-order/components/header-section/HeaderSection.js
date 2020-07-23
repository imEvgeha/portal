import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {get} from 'lodash';
import moment from 'moment';
import {Link} from 'react-router-dom';
import FilterSolidIcon from '../../../../../assets/filter-solid.svg';
import FilterIcon from '../../../../../assets/filter.svg';
import {SERVICING_ORDERS} from '../../../../../ui/elements/nexus-navigation/constants';
import {getValidDate} from '../../../../../util/utils';
import {backArrowColor} from '../../../../legacy/constants/avails/constants';
import ServiceOrderFilter from '../filter-section/ServiceOrderFilter';
import {SORT_DIRECTION} from '../filter-section/constants';
import FulfillmentOrderPanel from '../fulfillment-order-panel/FulfillmentOrderPanel';
import './HeaderSection.scss';

const HeaderSection = ({orderDetails, handleFulfillmentOrderChange, selectedFulfillmentOrder}) => {
    const [showFilter, setShowFilter] = useState(true);
    const [filter, setFilter] = useState({value: 'All', label: 'All'});
    const [dueDateSortDirection, setDueDateSortDirection] = useState(SORT_DIRECTION[0]);

    const toggleFilters = () => setShowFilter(!showFilter);
    const getFilteredList = () => {
        let filteredList = [];
        if (orderDetails.fulfillmentOrders && Array.isArray(orderDetails.fulfillmentOrders)) {
            if (!filter || filter.value === 'All') {
                filteredList = orderDetails.fulfillmentOrders;
            } else {
                filteredList = orderDetails.fulfillmentOrders.filter(item => item.status === filter.value);
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
            case 'ASCENDING':
                return diff;
            case 'DESCENDING':
                return -diff;
            default:
                break;
        }
    };

    // determines whether to sort the fulfillment order panels or not
    const getSortedFilteredList = () => (dueDateSortDirection !== SORT_DIRECTION[0]
        ? getFilteredList()
            .slice() // creates a copy of the list so that the sort doesn't mutate the original array
            .sort(sortByDueDate)
        : getFilteredList());

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
                {getSortedFilteredList().map(
                    ({
                        id,
                        external_id: extId,
                        status, definition: {dueDate} = {},
                        product_description: prodDesc,
                    }, index) => (
                        <FulfillmentOrderPanel
                            key={index}
                            id={id}
                            externalId={extId}
                            status={status}
                            dueDate={getValidDate(dueDate)}
                            selected={selectedFulfillmentOrder === id}
                            handleFulfillmentOrderChange={handleFulfillmentOrderChange}
                            productDescription={prodDesc}
                        />
                    )
                )}
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
