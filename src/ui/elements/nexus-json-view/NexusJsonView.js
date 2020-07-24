import React from 'react';
import ReactJsonView from 'react-json-view';
import NexusResizable from '../nexus-resizable/NexusResizable';
import './NexusJsonView.scss';

const NexusJsonView = props => (
    <NexusResizable defaultHeight={250}>
        <div className="nexus-c-json-view">
            <ReactJsonView
                name={false}
                enableClipboard={false}
                displayObjectSize={false}
                displayPropTypes={false}
                {...props}
            />
        </div>
    </NexusResizable>
);

export default NexusJsonView;
