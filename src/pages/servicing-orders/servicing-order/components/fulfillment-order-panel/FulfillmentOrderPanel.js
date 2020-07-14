import PropTypes from 'prop-types';
import React from 'react';
import File from '../../../../../assets/file.svg';
import Constants from '../fulfillment-order/constants';
import './FulfillmentOrderPanel.scss';

const FulfillmentOrderPanel = ({
    id,
    externalId,
    status,
    dueDate,
    selected,
    handleFulfillmentOrderChange,
    productDescription
}) => {
    return (
        <div
            className={`nexus-c-fulfillment-order-panel  ${
                selected ? 'nexus-c-fulfillment-order-panel--is-selected' : ''
            }`}
            onClick={() => handleFulfillmentOrderChange(id)}
        >
            <div className="nexus-c-fulfillment-order-panel__title-and-date">
                <div className="nexus-c-fulfillment-order-panel__title-container">
                    <File className="nexus-c-fulfillment-order-panel__file-icon" />
                    <span title={id} className="nexus-c-fulfillment-order-panel__title">
                        {externalId}
                    </span>
                </div>
                <span className="nexus-c-fulfillment-order-panel__date">Due Date: {dueDate}</span>
            </div>
            <div className="nexus-c-fulfillment-order-panel__description-and-status">
                <span className="nexus-c-fulfillment-order-panel__description">{productDescription}</span>
                <span className="nexus-c-fulfillment-order-panel__status">{Constants.STATUS[status]}</span>
            </div>
        </div>
    );
};

FulfillmentOrderPanel.propTypes = {
    id: PropTypes.string,
    handleFulfillmentOrderChange: PropTypes.func,
    status: PropTypes.string,
    dueDate: PropTypes.string,
    selected: PropTypes.bool,
    productDescription: PropTypes.string,
    externalId: PropTypes.string
};

FulfillmentOrderPanel.defaultProps = {
    id: '',
    handleFulfillmentOrderChange: () => null,
    status: '',
    dueDate: '',
    selected: false,
    productDescription: '',
    externalId: ''
};

export default FulfillmentOrderPanel;
