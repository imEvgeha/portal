import React from 'react';
import ReactJsonView from 'react-json-view';
import NexusVerticalResizable from '../nexus-vertical-resizable/NexusVerticalResizable';
import './NexusJsonView.scss';

const NexusJsonView = props => (
    <NexusVerticalResizable
        defaultHeight={250}
    >
        <div className="nexus-c-json-view">
            <ReactJsonView
                name={false}
                enableClipboard={false}
                displayObjectSize={false}
                displayPropTypes={false}
                {...props}
            />
        </div>
    </NexusVerticalResizable>
);

export default NexusJsonView;
