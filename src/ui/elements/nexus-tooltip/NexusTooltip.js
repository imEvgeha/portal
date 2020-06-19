import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';

const NexusTooltip = ({content, isDisabled, children, ...restProps}) => {
    return (
        <Tooltip
            content={!isDisabled && content}
            {...restProps}
        >
            <>
                {children}
            </>
        </Tooltip>
    );
};

NexusTooltip.propTypes = {
    content: PropTypes.node,
    isDisabled: PropTypes.bool,
};

NexusTooltip.defaultProps = {
    content: null,
    isDisabled: false,
};

export default NexusTooltip;
