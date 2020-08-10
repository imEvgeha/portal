import React from 'react';
import PropTypes from 'prop-types';
import './TooltipCellRenderer.scss';
import NexusTooltip from "../../../../nexus-tooltip/NexusTooltip";

const TooltipCellRenderer = ({value}) => {
    return (
        <NexusTooltip content='aaaaaaa'>
            <span className='nexus-c-tooltip-cell-renderer'>
                {value || ''}
            </span>
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
