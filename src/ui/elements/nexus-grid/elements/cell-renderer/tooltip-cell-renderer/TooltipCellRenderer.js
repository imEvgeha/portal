import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Popup from '@atlaskit/popup';
import ServicingOrdersTableStatusTooltip from '../../../../../../pages/servicing-orders/components/servicing-orders-table-status-tooltip/ServicingOrdersTableStatusTooltip';
import StatusTag from '../../../../nexus-status-tag/StatusTag';

const TooltipCellRenderer = props => {
    const {value, soNumber} = props;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Popup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            boundariesElement="scrollParent"
            content={() => <ServicingOrdersTableStatusTooltip soNumber={soNumber} />}
            trigger={triggerProps => (
                <div {...triggerProps} onClick={() => setIsOpen(!isOpen)} role="button">
                    <StatusTag status={`FO_${value}`} />
                </div>
            )}
        />
    );
};

TooltipCellRenderer.propTypes = {
    value: PropTypes.string,
    soNumber: PropTypes.string,
};

TooltipCellRenderer.defaultProps = {
    value: '',
    soNumber: '',
};

export default TooltipCellRenderer;
