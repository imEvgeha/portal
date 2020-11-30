import React from 'react';
import PropTypes from 'prop-types';
import {SORT_DIRECTION} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import {get} from 'lodash';
import moment from 'moment';
import {ISODateToView, sortByDateFn} from '../../../../../util/date-time/DateTimeUtils';
import FulfillmentOrderPanel from '../fulfillment-order-panel/FulfillmentOrderPanel';
import ServicingOrderItem from '../servicing-order-item/ServicingOrderItem';

const FulfillmentOrderPanels = ({
    dueDateSortDirection,
    orderDetails,
    fulfillmentOrders,
    selectedFulfillmentOrder,
    handleFulfillmentOrderChange,
}) => {
    const {servicingOrderItems = []} = orderDetails;
    const fulfillmentOrdersWithoutParentServicingOrderItem = fulfillmentOrders.filter(fo => !fo.soi_doc_id);
    const panels = fulfillmentOrdersWithoutParentServicingOrderItem.concat(
        servicingOrderItems.map(servicingOrderItem => ({
            ...servicingOrderItem,
            fulfillmentOrders: fulfillmentOrders.filter(fo => fo.soi_doc_id === servicingOrderItem.id),
        }))
    );
    // determines whether to sort the fulfillment order panels or not
    const sortedPanels = sortPanelsByDueDate(panels, dueDateSortDirection.value);

    const renderAccordion = accordionData => {
        return accordionData.map(info => renderPanel(info, selectedFulfillmentOrder, handleFulfillmentOrderChange));
    };

    return renderAccordion(sortedPanels);
};

export default FulfillmentOrderPanels;

FulfillmentOrderPanels.propTypes = {
    dueDateSortDirection: PropTypes.object.isRequired,
    orderDetails: PropTypes.object.isRequired,
    fulfillmentOrders: PropTypes.array,
    selectedFulfillmentOrder: PropTypes.string,
    handleFulfillmentOrderChange: PropTypes.func,
};

FulfillmentOrderPanels.defaultProps = {
    fulfillmentOrders: [],
    selectedFulfillmentOrder: null,
    handleFulfillmentOrderChange: () => null,
};

export const renderPanel = (info, selectedFulfillmentOrder, handleFulfillmentOrderChange, isChild = false) => {
    return info.type === 'ServicingOrderItem' ? (
        <ServicingOrderItem
            key={info.id}
            servicingOrderItem={info}
            selectedFulfillmentOrder={selectedFulfillmentOrder}
            handleFulfillmentOrderChange={handleFulfillmentOrderChange}
        />
    ) : (
        <FulfillmentOrderPanel
            key={info.id}
            id={info.id}
            externalId={info.external_id}
            status={info.status}
            dueDate={ISODateToView(get(info, 'definition.dueDate'), 'regionalMidnight')}
            servicer={info.fs}
            selected={selectedFulfillmentOrder === info.id}
            handleFulfillmentOrderChange={handleFulfillmentOrderChange}
            productDescription={info.product_description}
            isChild={isChild}
        />
    );
};

export const sortPanelsByDueDate = (panels, dueDateSortDirection) => {
    const toSort = panels.slice();

    const getDueDateOfServicingOrderItem = servicingOrderItem => {
        const {length} = servicingOrderItem.fulfillmentOrders;
        const sortedDates = sortByDateFn(servicingOrderItem.fulfillmentOrders, 'definition.dueDate').map(
            getMomentDueDate
        );
        return dueDateSortDirection === SORT_DIRECTION.ASCENDING ? sortedDates[0] : sortedDates[length - 1];
    };

    const getMomentDueDate = panel => {
        if (panel.type === 'ServicingOrderItem') {
            return moment(getDueDateOfServicingOrderItem(panel));
        }

        return moment(get(panel, 'definition.dueDate'));
    };

    const panelSortFn = (prevPanel, currPanel) => {
        const prevPanelDueDate = getMomentDueDate(prevPanel);
        const currPanelDueDate = getMomentDueDate(currPanel);
        const diff = prevPanelDueDate.diff(currPanelDueDate);

        switch (dueDateSortDirection) {
            case SORT_DIRECTION.ASCENDING:
                return diff;
            case SORT_DIRECTION.DESCENDING:
                return -diff;
            default:
                break;
        }
    };

    const sorted = toSort
        .map(panel => {
            if (panel.type === 'ServicingOrderItem') {
                return {
                    ...panel,
                    fulfillmentOrders: panel.fulfillmentOrders.sort(panelSortFn),
                };
            }
            return panel;
        })
        .sort(panelSortFn);
    return sorted;
};
