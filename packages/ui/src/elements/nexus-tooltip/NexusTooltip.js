import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import {TooltipPrimitive} from '@atlaskit/tooltip/styled';
import styled from 'styled-components';

const NexusTooltip = ({content, isDisabled, children, hasWhiteBackground = false, ...restProps}) => {
    const InlineDialog = styled(TooltipPrimitive)`
        background: white;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        box-sizing: content-box;
        color: #333;
        padding: 8px 12px;
    `;

    const additionalProps = hasWhiteBackground ? {...restProps, component: InlineDialog} : restProps;
    return (
        <Tooltip content={!isDisabled && content} {...additionalProps}>
            <>{children}</>
        </Tooltip>
    );
};

NexusTooltip.propTypes = {
    content: PropTypes.node,
    isDisabled: PropTypes.bool,
    hasWhiteBackground: PropTypes.bool,
};

NexusTooltip.defaultProps = {
    content: null,
    isDisabled: false,
    hasWhiteBackground: false,
};

export default NexusTooltip;
