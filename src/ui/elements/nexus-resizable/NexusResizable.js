import React from 'react';
import PropTypes from 'prop-types';
import {Resizable} from 're-resizable';
import {DEFAULT_HANDLES} from './constants';

const NexusResizable = ({children, defaultWidth, defaultHeight, handles}) => {
    return (
        <Resizable
            defaultSize={{
                width: defaultWidth,
                height: defaultHeight,
            }}
            enable={{...DEFAULT_HANDLES, ...handles}}
        >
            {children}
        </Resizable>
    );
};

NexusResizable.propTypes = {
    defaultWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handles: PropTypes.object,
};

NexusResizable.defaultProps = {
    defaultWidth: 'initial',
    defaultHeight: 'initial',
    handles: {bottom: true},
};

export default NexusResizable;
