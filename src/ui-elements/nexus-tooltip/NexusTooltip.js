import React from 'react';
import Tooltip from '@atlaskit/tooltip';

function NexusTooltip({content, children, ...restProps}) {
    return (
        <Tooltip
            content={content}
            {...restProps}
        >
            {children}
        </Tooltip>
    );
}

NexusTooltip.defaultProps = {
    content: null,
};

export default NexusTooltip;