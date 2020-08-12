import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import classnames from 'classnames';
import {get} from 'lodash';
import moment from 'moment';
import ChevronIcon from '../../../../../assets/chevron-right.svg';
import FolderIcon from '../../../../../assets/folder.svg';
import StatusTag from '../../../../../ui/elements/nexus-status-tag/StatusTag';
import {ISODateToView} from '../../../../../util/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '../../../../../util/date-time/constants';
import {renderPanel} from '../fulfillment-order-panels/FulfillmentOrderPanels';
import './ServicingOrderItem.scss';

const ServicingOrderItem = ({soi, selectedFulfillmentOrder, handleFulfillmentOrderChange}) => {
    const {product_description: productDescription, fulfillmentOrders, external_id: externalId, status} = soi;
    const count = fulfillmentOrders.length;
    const [isOpen, setOpen] = useState(false);
    const chevronClassNames = classnames('nexus-c-servicing-order-item__chevron-icon', {
        'nexus-c-servicing-order-item__chevron-icon--is-expanded': isOpen,
    });

    // opens the SOI that contains the currently selected FO
    useEffect(() => {
        setOpen(isFulfillmentOrderInSoi(soi, selectedFulfillmentOrder));
    }, [soi, selectedFulfillmentOrder]);

    return soi.fulfillmentOrders.length > 0 ? (
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
                            {renderDueDateRangeOfServicingOrderItem(soi)}
                        </p>
                    </div>
                    {!!status && <StatusTag status={`FO_${status}`} />}
                </div>
            </div>
            {/* renders any children FO panels */}
            {isOpen &&
                soi.fulfillmentOrders.map(info =>
                    renderPanel(info, selectedFulfillmentOrder, handleFulfillmentOrderChange, true)
                )}
        </>
    ) : null;
};

export default ServicingOrderItem;

ServicingOrderItem.propTypes = {
    soi: PropTypes.any.isRequired,
    selectedFulfillmentOrder: PropTypes.string,
    handleFulfillmentOrderChange: PropTypes.func,
};

ServicingOrderItem.defaultProps = {
    selectedFulfillmentOrder: null,
    handleFulfillmentOrderChange: () => null,
};

/**
 * Returns the date range of the fulfillment orders within a ServicingOrderItem
 * @param {ServicingOrderItem} soi the given ServicingOrderItem
 */
const renderDueDateRangeOfServicingOrderItem = soi => {
    // parses the fulfillmentOrder due date with moment
    const getMomentDueDate = panel => moment(get(panel, 'definition.dueDate'));

    // sorts the due dates in the servicingOrderItem
    const dateSortFn = (prevFulfillmentOrder, currFulfillmentOrder) => {
        const prevDueDate = getMomentDueDate(prevFulfillmentOrder);
        const currDueDate = getMomentDueDate(currFulfillmentOrder);
        const diff = prevDueDate.diff(currDueDate);

        return diff;
    };

    // formats the moment date
    const dateDisplay = momentObj => ISODateToView(momentObj, DATETIME_FIELDS.REGIONAL_MIDNIGHT);

    const {length} = soi.fulfillmentOrders;
    const sortedDates = soi.fulfillmentOrders.slice().sort(dateSortFn).map(getMomentDueDate);
    const earliestDueDate = dateDisplay(sortedDates[0]);
    const latestDueDate = dateDisplay(sortedDates[length - 1]);
    const isDifferent = earliestDueDate !== latestDueDate;
    const latestDueDateWithDash = ` - ${latestDueDate}`;
    return `Due Date${isDifferent ? 's' : ''}: ${earliestDueDate}${isDifferent ? latestDueDateWithDash : ''}`;
};

export const isFulfillmentOrderInSoi = (soi, foId) => {
    return soi.fulfillmentOrders.map(fo => fo.id).includes(foId);
};
