import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import ChevronIcon from '@vubiquity-nexus/portal-assets/chevron-right.svg';
import FolderIcon from '@vubiquity-nexus/portal-assets/folder.svg';
import StatusTag from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-tag/StatusTag';
import {ISODateToView, sortByDateFn} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import classnames from 'classnames';
import {get} from 'lodash';
import {renderPanel} from '../fulfillment-order-panels/FulfillmentOrderPanels';
import './ServicingOrderItem.scss';

const ServicingOrderItem = ({servicingOrderItem, selectedFulfillmentOrder, handleFulfillmentOrderChange}) => {
    const {
        product_description: productDescription,
        fulfillmentOrders,
        external_id: externalId,
        status,
    } = servicingOrderItem;
    const count = fulfillmentOrders.length;
    const [isOpen, setOpen] = useState(false);
    const chevronClassNames = classnames('nexus-c-servicing-order-item__chevron-icon', {
        'nexus-c-servicing-order-item__chevron-icon--is-expanded': isOpen,
    });

    // opens the SOI that contains the currently selected FO
    useEffect(() => {
        if (isFulfillmentOrderInSoi(servicingOrderItem, selectedFulfillmentOrder)) {
            setOpen(true);
        }
    }, [servicingOrderItem]);

    return servicingOrderItem.fulfillmentOrders.length > 0 ? (
        <>
            <div className="nexus-c-servicing-order-item" onClick={() => setOpen(!isOpen)}>
                <div className="nexus-c-servicing-order-item__row">
                    <div className="nexus-c-servicing-order-item__row-group">
                        <FolderIcon className="nexus-c-servicing-order-item__folder-icon" />
                        <h5 className="nexus-c-servicing-order-item__title">{productDescription}</h5>
                    </div>
                    <Badge>{count}</Badge>
                </div>
                <p className="nexus-c-servicing-order-item__external-id">{externalId}</p>
                <div className="nexus-c-servicing-order-item__row">
                    <div className="nexus-c-servicing-order-item__row-group">
                        <ChevronIcon className={chevronClassNames} />
                        <p className="nexus-c-servicing-order-item__due-dates">
                            {renderDueDateRangeOfServicingOrderItem(servicingOrderItem)}
                        </p>
                    </div>
                    {!!status && <StatusTag status={`FO_${status}`} />}
                </div>
            </div>
            {/* renders any children FO panels */}
            {isOpen &&
                servicingOrderItem.fulfillmentOrders.map(info =>
                    renderPanel(info, selectedFulfillmentOrder, handleFulfillmentOrderChange, true)
                )}
        </>
    ) : null;
};

export default ServicingOrderItem;

ServicingOrderItem.propTypes = {
    servicingOrderItem: PropTypes.any.isRequired,
    selectedFulfillmentOrder: PropTypes.string,
    handleFulfillmentOrderChange: PropTypes.func,
};

ServicingOrderItem.defaultProps = {
    selectedFulfillmentOrder: null,
    handleFulfillmentOrderChange: () => null,
};

/**
 * Returns the date range of the fulfillment orders within a ServicingOrderItem
 * @param {ServicingOrderItem} servicingOrderItem the given ServicingOrderItem
 */
const renderDueDateRangeOfServicingOrderItem = servicingOrderItem => {
    // formats the moment date
    const dateDisplay = momentObj => ISODateToView(momentObj, DATETIME_FIELDS.REGIONAL_MIDNIGHT);

    const {length} = servicingOrderItem.fulfillmentOrders;
    const sortedDates = sortByDateFn(servicingOrderItem.fulfillmentOrders, 'definition.dueDate').map(fo =>
        get(fo, 'definition.dueDate')
    );
    const earliestDueDate = dateDisplay(sortedDates[0]);
    const latestDueDate = dateDisplay(sortedDates[length - 1]);
    const isDifferent = earliestDueDate !== latestDueDate;
    const latestDueDateWithDash = ` - ${latestDueDate}`;
    return `Due Date${isDifferent ? 's' : ''}: ${earliestDueDate}${isDifferent ? latestDueDateWithDash : ''}`;
};

export const isFulfillmentOrderInSoi = (servicingOrderItem, fulfillmentOrderId) => {
    return servicingOrderItem.fulfillmentOrders.map(fo => fo.id).includes(fulfillmentOrderId);
};
