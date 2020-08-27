import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';
import NexusResizable from '../nexus-resizable/NexusResizable';
import './NexusJsonView.scss';

const NexusJsonView = ({defaultHeight, defaultWidth, ...rest}) => {
    return (
        <NexusResizable defaultHeight={defaultHeight} defaultWidth={defaultWidth}>
            <div className="nexus-c-json-view">
                <ReactJsonView
                    name={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayPropTypes={false}
                    {...rest}
                />
            </div>
        </NexusResizable>
    );
};

NexusJsonView.propTypes = {
    defaultHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

NexusJsonView.defaultProps = {
    defaultHeight: 250,
    defaultWidth: '100%',
};

export default NexusJsonView;
