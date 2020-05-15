import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import './FulfillmentOrderPanel.scss';
import File from '../../../../../../assets/file.svg';
import StatusTag from '../../../../../../ui/elements/nexus-status-tag/StatusTag';

const FulfillmentOrderPanel = ({id, status, dueDate, selected, setSelectedFulfillmentOrder}) => {

    return (
        <div
            className={`nexus-c-fulfillmentOrderPanel ${selected ? 'nexus-c-fulfillmentOrderPanel--is-selected' : ''}`}
            onClick={() => setSelectedFulfillmentOrder(id)}
        >
            <div className='nexus-c-fulfillmentOrderPanel__title'>
                <File className='nexus-c-fulfillmentOrderPanel__file-icon' />
                <span title={id} className='nexus-c-fulfillmentOrderPanel__filename'>{id}</span>
            </div>
            <div className='nexus-c-fulfillmentOrderPanel__status'>
                <span className='nexus-c-fulfillmentOrderPanel__date'>{dueDate}</span>
                <StatusTag status={status} />
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
