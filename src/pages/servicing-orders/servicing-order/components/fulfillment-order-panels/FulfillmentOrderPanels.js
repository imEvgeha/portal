import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {get} from 'lodash';
import {getFilteredByIdOrders, getFilteredByTitleOrders} from '../../../servicingOrdersService';
import FulfillmentOrderPanel from '../fulfillment-order-panel/FulfillmentOrderPanel';
import ServicingOrderItem from '../servicing-order-item/ServicingOrderItem';

const FulfillmentOrderPanels = ({
    sortDirection,
    orderDetails,
    fulfillmentOrders,
    selectedFulfillmentOrder,
    handleFulfillmentOrderChange,
    statusFilter,
    page,
}) => {
    const {servicingOrderItems = []} = orderDetails;
    const [newFulfillmentOrders, setNewFulfillmentOrders] = useState(fulfillmentOrders);
    const [newServicingOrderItems, setNewServicingOrderItems] = useState(servicingOrderItems);

    useEffect(() => {
        if (sortDirection.type === 'ID') {
            getFilteredByIdOrders(orderDetails.so_number, sortDirection.code, statusFilter, page).then(data => {
                setNewFulfillmentOrders(data?.fulfillmentOrders);
                setNewServicingOrderItems(data?.servicingOrderItems);
            });
        } else if (sortDirection.type === 'TITLE') {
            getFilteredByTitleOrders(orderDetails.so_number, sortDirection.code, statusFilter, page).then(data => {
                setNewFulfillmentOrders(data?.fulfillmentOrders);
                setNewServicingOrderItems(data?.servicingOrderItems);
            });
        }
    }, [statusFilter, sortDirection]);

    const fulfillmentOrdersWithoutParentServicingOrderItem = newFulfillmentOrders?.filter(fo => !fo.soi_doc_id);
    const panels = fulfillmentOrdersWithoutParentServicingOrderItem.concat(
        newServicingOrderItems.map(servicingOrderItem => ({
            ...servicingOrderItem,
            fulfillmentOrders: newFulfillmentOrders?.filter(fo => fo.soi_doc_id === servicingOrderItem.id),
        }))
    );

    const renderAccordion = accordionData => {
        return accordionData.map(info => renderPanel(info, selectedFulfillmentOrder, handleFulfillmentOrderChange));
    };

    return renderAccordion(panels);
};

export default FulfillmentOrderPanels;

FulfillmentOrderPanels.propTypes = {
    sortDirection: PropTypes.object,
    orderDetails: PropTypes.object.isRequired,
    fulfillmentOrders: PropTypes.array,
    selectedFulfillmentOrder: PropTypes.string,
    handleFulfillmentOrderChange: PropTypes.func,
    statusFilter: PropTypes.object,
    page: PropTypes.number,
};

FulfillmentOrderPanels.defaultProps = {
    sortDirection: {},
    fulfillmentOrders: [],
    selectedFulfillmentOrder: null,
    handleFulfillmentOrderChange: () => null,
    statusFilter: {},
    page: undefined,
};

export const renderPanel = (info, selectedFulfillmentOrder, handleFulfillmentOrderChange, isChild = false) => {
    return info.type === 'ServicingOrderItem' ? (
        <ServicingOrderItem
            key={info.id}
            servicingOrderItem={info}
            selectedFulfillmentOrder={selectedFulfillmentOrder}
            handleFulfillmentOrderChange={handleFulfillmentOrderChange}
            completedDate={ISODateToView(get(info, 'completed_date'), 'regionalMidnight')}
        />
    ) : (
        <FulfillmentOrderPanel
            key={info.id}
            id={info.id}
            externalId={info.external_id}
            status={info.status}
            dueDate={ISODateToView(get(info, 'due_date'), 'regionalMidnight')}
            servicer={info.fs}
            selected={selectedFulfillmentOrder === info.id}
            handleFulfillmentOrderChange={handleFulfillmentOrderChange}
            productDescription={info.product_description}
            isChild={isChild}
            completedDate={ISODateToView(get(info, 'completed_date'), 'regionalMidnight')}
        />
    );
};
