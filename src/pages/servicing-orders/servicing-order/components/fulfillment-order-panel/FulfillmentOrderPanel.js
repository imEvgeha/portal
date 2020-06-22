import PropTypes from 'prop-types';
import React from 'react';
import File from '../../../../../assets/file.svg';
import Constants from '../fulfillment-order/constants';
import './FulfillmentOrderPanel.scss';

const FulfillmentOrderPanel = ({id, external_id, status, dueDate, selected, handleFulfillmentOrderChange}) => {
    return (
        <div
            className={`nexus-c-fulfillment-order-panel  ${
                selected ? 'nexus-c-fulfillment-order-panel--is-selected' : ''
            }`}
            onClick={() => handleFulfillmentOrderChange(id)}
        >
            <div className="nexus-c-fulfillment-order-panel__title">
                <File className="nexus-c-fulfillment-order-panel__file-icon" />
                <span title={id} className="nexus-c-fulfillment-order-panel__filename">
                    {external_id}
                </span>
            </div>
            <div className="nexus-c-fulfillment-order-panel__status">
                <span className="nexus-c-fulfillment-order-panel__date">Due Date: {dueDate}</span>
                <span>{Constants.STATUS[status]}</span>
            </div>
        </div>
    );
};

FulfillmentOrderPanel.propTypes = {
    id: PropTypes.string,
    handleFulfillmentOrderChange: PropTypes.func,
    status: PropTypes.string,
    dueDate: PropTypes.string,
    selected: PropTypes.bool
};

FulfillmentOrderPanel.defaultProps = {
    id: '',
    handleFulfillmentOrderChange: () => null,
    status: '',
    dueDate: '',
    selected: false
};

export default FulfillmentOrderPanel;
