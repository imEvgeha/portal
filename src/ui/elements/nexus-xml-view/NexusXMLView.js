import React from 'react';
import XMLViewer from 'react-xml-viewer';
import NexusResizable from '../nexus-resizable/NexusResizable';
import './NexusXMLView.scss';

const customTheme = {
    attributeKeyColor: '#CB4B16',
    attributeValueColor: '#000FF',
};

const NexusXMLView = props => (
    <NexusResizable defaultHeight={250}>
        <div className="nexus-c-xml-view">
            <XMLViewer theme={customTheme} {...props} />
        </div>
    </NexusResizable>
);

export default NexusXMLView;
