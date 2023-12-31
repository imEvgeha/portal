import React from 'react';
import PropTypes from 'prop-types';
import StatusTag from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-tag/StatusTag';
import classnames from 'classnames';
import {SERVICERS} from '../../../constants';
import './FulfillmentOrderPanel.scss';

const FulfillmentOrderPanel = ({
    id,
    externalId,
    status,
    dueDate,
    completedDate,
    servicer,
    selected,
    handleFulfillmentOrderChange,
    productDescription,
    isChild,
}) => {
    const panelClassNames = classnames('nexus-c-fulfillment-order-panel', {
        'nexus-c-fulfillment-order-panel--is-selected': selected,
        'nexus-c-fulfillment-order-panel--is-child': isChild,
    });
    return (
        <div className={panelClassNames} onClick={() => handleFulfillmentOrderChange(id)}>
            <div className="nexus-c-fulfillment-order-panel__title-and-date">
                <div className="nexus-c-fulfillment-order-panel__servicer">
                    <span className="nexus-c-fulfillment-order-panel__servicer-label">{SERVICERS[servicer]}</span>
                </div>
                <div className="nexus-c-fulfillment-order-panel__order-info">
                    <div className="nexus-c-fulfillment-order-panel__title-container">
                        <span title={id} className="nexus-c-fulfillment-order-panel__title">
                            {externalId}
                        </span>
                    </div>
                    <div className="nexus-c-fulfillment-order-panel__title-container">
                        <div className="nexus-c-fulfillment-order-panel__date">Due Date: {dueDate}</div>
                        { completedDate && <div className="nexus-c-fulfillment-order-panel__date">Completed Date: {completedDate}</div> }
                    </div>
                </div>
            </div>
            <div className="nexus-c-fulfillment-order-panel__description-and-status">
                <span className="nexus-c-fulfillment-order-panel__description">{productDescription}</span>
                <StatusTag status={`FO_${status}`} />
            </div>
        </div>
    );
};

FulfillmentOrderPanel.propTypes = {
    id: PropTypes.string,
    handleFulfillmentOrderChange: PropTypes.func,
    status: PropTypes.string,
    dueDate: PropTypes.string,
    completedDate: PropTypes.string,
    servicer: PropTypes.string,
    // eslint-disable-next-line react/boolean-prop-naming
    selected: PropTypes.bool,
    productDescription: PropTypes.string,
    externalId: PropTypes.string,
    isChild: PropTypes.bool,
};

FulfillmentOrderPanel.defaultProps = {
    id: '',
    handleFulfillmentOrderChange: () => null,
    status: '',
    dueDate: '',
    completedDate: '',
    servicer: '',
    selected: false,
    productDescription: '',
    externalId: '',
    isChild: false,
};

export default FulfillmentOrderPanel;
