import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {Button} from '@portal/portal-components';
import {backArrowColor} from '@vubiquity-nexus/portal-styles/constants';
import classnames from 'classnames';
import {Link} from 'react-router-dom';
import ServiceOrderFilter from '../filter-section/ServiceOrderFilter';
import {SORT_DIRECTION} from '../filter-section/constants';
import FulfillmentOrderPanels from '../fulfillment-order-panels/FulfillmentOrderPanels';
import './HeaderSection.scss';

const HeaderSection = ({
    orderDetails,
    handleFulfillmentOrderChange,
    selectedFulfillmentOrder,
    fetchNewPageForFulfillmentOrders,
    servicingOrderItemsLength,
}) => {
    const {fulfillmentOrders} = orderDetails;
    const [showFilter, setShowFilter] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('All');
    const [sortDirection, setSortDirection] = useState(SORT_DIRECTION[0]);

    const toggleFilters = () => setShowFilter(!showFilter);
    const getFilteredList = () => {
        let filteredList = [];
        if (fulfillmentOrders && Array.isArray(fulfillmentOrders)) {
            if (!filter || filter === 'All') {
                filteredList = fulfillmentOrders;
            } else {
                filteredList = fulfillmentOrders.filter(item => item.status === filter);
            }
        }
        return filteredList;
    };

    const onScroll = e => {
        const {target: {scrollHeight, scrollTop, clientHeight} = {}} = e || {};
        if (scrollHeight - scrollTop - clientHeight < 1 && fulfillmentOrders.length < servicingOrderItemsLength) {
            fetchNewPageForFulfillmentOrders(page);
            setPage(page + 1);
        }
    };

    const panelHeaderClassNames = classnames('panel-header__title', {
        'panel-header__title--open': showFilter,
    });

    return (
        <div className="panel-header">
            <div className={panelHeaderClassNames}>
                <div className="panel-header__title--section">
                    <Link id="lnkServicingOrders" to={-1}>
                        <ArrowLeftIcon size="large" primaryColor={backArrowColor} />
                    </Link>
                    <span className="panel-header__title--text">Servicing Order</span>
                </div>
                <div className="panel-header__filter">
                    <Button
                        className="p-button-text"
                        icon="po po-filter"
                        tooltip={showFilter ? 'Hide Filter Section' : 'Show Filter Section'}
                        onClick={toggleFilters}
                    />
                </div>
            </div>
            {showFilter && (
                <ServiceOrderFilter
                    orderDetails={orderDetails || {}}
                    filter={filter}
                    setFilter={setFilter}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                />
            )}
            <div className="panel-header__list" onScroll={onScroll}>
                <FulfillmentOrderPanels
                    orderDetails={orderDetails}
                    sortDirection={sortDirection}
                    selectedFulfillmentOrder={selectedFulfillmentOrder}
                    fulfillmentOrders={getFilteredList()}
                    handleFulfillmentOrderChange={handleFulfillmentOrderChange}
                    statusFilter={filter}
                    page={page}
                />
            </div>
        </div>
    );
};

HeaderSection.propTypes = {
    orderDetails: PropTypes.object.isRequired,
    handleFulfillmentOrderChange: PropTypes.func,
    selectedFulfillmentOrder: PropTypes.string,
    fetchNewPageForFulfillmentOrders: PropTypes.func,
    servicingOrderItemsLength: PropTypes.number,
};

HeaderSection.defaultProps = {
    handleFulfillmentOrderChange: () => null,
    fetchNewPageForFulfillmentOrders: () => null,
    selectedFulfillmentOrder: '',
    servicingOrderItemsLength: 0,
};
export default HeaderSection;
