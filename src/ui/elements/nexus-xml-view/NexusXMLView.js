import React from 'react';
import XMLViewer from 'react-xml-viewer';
import {Resizable} from 're-resizable';
import './NexusXMLView.scss';

const customTheme = {
    'attributeKeyColor': '#CB4B16',
    'attributeValueColor': '#000FF'
};

const NexusXMLView = props => (
    <Resizable
        defaultSize={{
            height: 250
        }}
        minWidth='100%'
        maxWidth='100%'
        enable={{top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false}}
    >
        <div className="nexus-c-xml-view">
            <XMLViewer theme={customTheme} {...props} />
        </div>
    </Resizable>
);

export default NexusXMLView;
