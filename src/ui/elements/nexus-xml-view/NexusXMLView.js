import React from 'react';
import XMLViewer from 'react-xml-viewer';
import NexusVerticalResizable from '../nexus-vertical-resizable/NexusVerticalResizable';
import './NexusXMLView.scss';

const customTheme = {
    'attributeKeyColor': '#CB4B16',
    'attributeValueColor': '#000FF'
};

const NexusXMLView = props => (
    <NexusVerticalResizable
        defaultHeight={250}
    >
        <div className="nexus-c-xml-view">
            <XMLViewer theme={customTheme} {...props} />
        </div>
    </NexusVerticalResizable>
);

export default NexusXMLView;
