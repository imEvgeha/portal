import React from 'react';
import styled from 'styled-components';
import Tooltip from '@atlaskit/tooltip';
import { TooltipPrimitive } from '@atlaskit/tooltip/styled';

const NexusTooltip = ({content, children, ...restProps}) => {
    return (
        <Tooltip
            component={NexusStyledTooltip}
            content={content}
            {...restProps}
        >
            {children}
        </Tooltip>
    );
};

NexusTooltip.defaultProps = {
    content: null,
};

// NOTE: Use styled-components when styling tooltips and extend TooltipPrimitive. (AtlasKit's requirement..)
const NexusStyledTooltip= styled(TooltipPrimitive)`
  background: #364767;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #FFFFFF;
  max-width: 300px;
  padding: 8px 12px;
`;

export default NexusTooltip;