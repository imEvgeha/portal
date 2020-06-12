import React from 'react';
import PropTypes from 'prop-types';
import {Resizable} from 're-resizable';

const NexusVerticalResizable = ({children, defaultHeight}) => {
    return (
        <Resizable
            defaultSize={{
                height: defaultHeight
            }}
            enable={{top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false}}
        >
            {children}
        </Resizable>
    );
};

NexusVerticalResizable.propTypes = {
    defaultHeight: PropTypes.string.isRequired
};

export default NexusVerticalResizable;