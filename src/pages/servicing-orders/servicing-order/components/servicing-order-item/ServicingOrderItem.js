import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import StatusTag from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-tag/StatusTag';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {ISODateToView, sortByDateFn} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import classnames from 'classnames';
import {get} from 'lodash';
import {renderPanel} from '../fulfillment-order-panels/FulfillmentOrderPanels';
import './ServicingOrderItem.scss';

const ServicingOrderItem = ({
    servicingOrderItem,
    selectedFulfillmentOrder,
    handleFulfillmentOrderChange,
    completedDate,
}) => {
    const {
        product_description: productDescription,
        fulfillmentOrders,
        external_id: externalId,
        status,
        watermark,
        premiering,
        market_type: marketType,
        late,
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
                    <div className="nexus-c-servicing-order-item__row-group nexus-c-servicing-order-item__title-row">
                        <i className="po po-folder nexus-c-servicing-order-item__folder-icon" />
                        <NexusTooltip content={productDescription}>
                            <h5 className="nexus-c-servicing-order-item__title">{productDescription}</h5>
                        </NexusTooltip>
                        <span className="nexus-c-servicing-order-item__row-group nexus-c-servicing-order-item__icons">
                            {late && (
                                <span className="nexus-c-servicing-order-item__badge">
                                    <NexusTooltip content="Late">
                                        <Badge>
                                            <i className="fas fa-stopwatch" />
                                        </Badge>
                                    </NexusTooltip>
                                </span>
                            )}
                            {watermark && (
                                <span className="nexus-c-servicing-order-item__badge">
                                    <NexusTooltip content="Watermark">
                                        <Badge>
                                            <i className="fas fa-tint" />
                                        </Badge>
                                    </NexusTooltip>
                                </span>
                            )}
                            {premiering && (
                                <span className="nexus-c-servicing-order-item__badge">
                                    <NexusTooltip content="Premiering">
                                        <Badge>
                                            <i className="far fa-star" />
                                        </Badge>
                                    </NexusTooltip>
                                </span>
                            )}
                            {marketType === 'Major' && (
                                <span className="nexus-c-servicing-order-item__badge">
                                    <NexusTooltip content="Major">
                                        <Badge>
                                            <i className="fas fa-angle-up" />
                                        </Badge>
                                    </NexusTooltip>
                                </span>
                            )}
                            {marketType === 'Minor' && (
                                <span className="nexus-c-servicing-order-item__badge">
                                    <NexusTooltip content="Minor">
                                        <Badge>
                                            <i className="fas fa-minus fa-xs" />
                                        </Badge>
                                    </NexusTooltip>
                                </span>
                            )}
                            <span className="nexus-c-servicing-order-item__badge">
                                <Badge>{count}</Badge>
                            </span>
                        </span>
                    </div>
                </div>
                <p className="nexus-c-servicing-order-item__external-id">{externalId}</p>
                <div className="nexus-c-servicing-order-item__row">
                    <div className="nexus-c-servicing-order-item__row-group">
                        <i className={`po po-chevron-right ${chevronClassNames}`} />
                        <div className="nexus-c-servicing-order-item__due-dates">
                            <div>{renderDueDateRangeOfServicingOrderItem(servicingOrderItem)}</div>
                            {completedDate && <div>Completed Date: {completedDate}</div>}
                        </div>
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
    completedDate: PropTypes.string,
};

ServicingOrderItem.defaultProps = {
    selectedFulfillmentOrder: null,
    handleFulfillmentOrderChange: () => null,
    completedDate: '',
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
