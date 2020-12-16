import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Popup from '@atlaskit/popup';
import StatusTag from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-tag/StatusTag';
import ServicingOrdersTableStatusTooltip from '../servicing-orders-table-status-tooltip/ServicingOrdersTableStatusTooltip';

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
