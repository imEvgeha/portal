import React from 'react';
import XMLViewer from 'react-xml-viewer';
import './NexusXMLView.scss';

const customTheme = {
    'attributeKeyColor': '#CB4B16',
    'attributeValueColor': '#000FF'
};

const NexusXMLView = props => (
    <div className="nexus-c-xml-view">
        <XMLViewer theme={customTheme} {...props} />
    </div>
);

export default NexusXMLView;
