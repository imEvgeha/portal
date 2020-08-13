import React from 'react';
import PropTypes from 'prop-types';
import ServicingOrdersTableStatusTooltip from "../../../../../../pages/servicing-orders/components/servicing-orders-table-status-tooltip/ServicingOrdersTableStatusTooltip"
import NexusTooltip from "../../../../nexus-tooltip/NexusTooltip";

const TooltipCellRenderer = ({value}) => {
    return (
        <NexusTooltip hasWhiteBackground content={<ServicingOrdersTableStatusTooltip />}>
            <span> {value || ''} </span>
        </NexusTooltip>
    );
};

TooltipCellRenderer.propTypes = {
    value: PropTypes.string,
};

TooltipCellRenderer.defaultProps = {
    value: '',
};

export default TooltipCellRenderer;
