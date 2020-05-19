import React from 'react';
import ReactJsonView from 'react-json-view';
import './NexusJsonView.scss';

const NexusJsonView = props => (
    <div className="nexus-c-json-view">
        <ReactJsonView
            name={false}
            enableClipboard={false}
            displayObjectSize={false}
            displayPropTypes={false}
            {...props}
        />
    </div>
);

export default NexusJsonView;
