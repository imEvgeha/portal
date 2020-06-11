import React from 'react';
import ReactJsonView from 'react-json-view';
import {Resizable} from 're-resizable';
import './NexusJsonView.scss';

const NexusJsonView = props => (
    <Resizable
        defaultSize={{
            height: 250
        }}
        minWidth='100%'
        maxWidth='100%'
        enable={{top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false}}
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
    </Resizable>
);

export default NexusJsonView;
