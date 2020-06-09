import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {saveAs} from 'file-saver';
import {DOWNLOAD, JSON_MIME, XML_MIME} from './constants';

const NexusDownload = ({data, filename, mimeType, label, ...restProps}) => {

    const parsedData = typeof data === 'string' && mimeType === JSON_MIME ? JSON.parse(data) : data;

    const handleDownload = () => {
        const blob = mimeType === XML_MIME
            ? new Blob([prettifyXML(parsedData)], {type: mimeType})
            : new Blob([JSON.stringify(parsedData, null, 2)], {type: mimeType});

        saveAs(blob, filename);
    };

    const prettifyXML = sourceXml => {
        let xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
        let xsltDoc = new DOMParser().parseFromString([
            // describes how we want to modify the XML - indent everything
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:strip-space elements="*"/>',
            '  <xsl:template match="para[content-style][not(text())]">',
            '    <xsl:value-of select="normalize-space(.)"/>',
            '  </xsl:template>',
            '  <xsl:template match="node()|@*">',
            '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '  </xsl:template>',
            '  <xsl:output indent="yes"/>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');

        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        const resultXml = new XMLSerializer().serializeToString(resultDoc);
        return resultXml;
    };

    return (
        <Button
            className="nexus-c-download"
            onClick={handleDownload}
            {...restProps}
        >
            {label}
        </Button>
    );
};

NexusDownload.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    filename: PropTypes.string.isRequired,
    mimeType: PropTypes.string,
    label: PropTypes.string,
};

NexusDownload.defaultProps = {
    label: DOWNLOAD,
    mimeType: JSON_MIME,
};

export default NexusDownload;
