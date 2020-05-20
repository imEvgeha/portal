import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import './FulfillmentOrderPanel.scss';
import File from '../../../../../../assets/file.svg';
import StatusTag from '../../../../../../ui/elements/nexus-status-tag/StatusTag';

const FulfillmentOrderPanel = ({id, status, dueDate, selected, setSelectedFulfillmentOrder}) => {

    return (
        <div
            className={`nexus-c-fulfillment-order-panel  ${selected ? 'nexus-c-fulfillment-order-panel--is-selected' : ''}`}
            onClick={() => setSelectedFulfillmentOrder(id)}
        >
            <div className='nexus-c-fulfillment-order-panel__title'>
                <File className='nexus-c-fulfillment-order-panel__file-icon' />
                <span title={id} className='nexus-c-fulfillment-order-panel__filename'>{id}</span>
            </div>
            <div className='nexus-c-fulfillment-order-panel__status'>
                <span className='nexus-c-fulfillment-order-panel__date'>Due Date: {dueDate}</span>
                <StatusTag status={status.toUpperCase()} />
            </div>
        </div>
    );
};

FulfillmentOrderPanel.propTypes = {
    id: PropTypes.string,
    setSelectedFulfillmentOrder: PropTypes.func,
    status: PropTypes.string,
    dueDate: PropTypes.string,
    selected: PropTypes.bool
};

FulfillmentOrderPanel.defaultProps = {
    id: '',
    setSelectedFulfillmentOrder: () => null,
    status: '',
    dueDate: '',
    selected: false,
};

export default FulfillmentOrderPanel;