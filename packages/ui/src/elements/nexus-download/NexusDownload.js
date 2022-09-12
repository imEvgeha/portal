import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import {DOWNLOAD, JSON_INDENT_SPACE, JSON_MIME, XML_MIME} from './constants';

const NexusDownload = ({data, filename, mimeType, label, ...restProps}) => {
    const tryParseJSON = data => {
        let parsedData = '{}';
        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            parsedData = '{}';
        }
        return parsedData;
    };

    const parsedData = typeof data === 'string' && mimeType === JSON_MIME ? tryParseJSON(data) : data;

    const handleDownload = () => {
        const blob =
            mimeType === XML_MIME
                ? new Blob([prettifyXML(parsedData)], {type: mimeType})
                : new Blob([JSON.stringify(parsedData, null, JSON_INDENT_SPACE)], {type: mimeType});

        downloadFile(blob, filename, '.json', false, false);
    };

    const prettifyXML = sourceXml => {
        const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
        const xsltDoc = new DOMParser().parseFromString(
            [
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
            ].join('\n'),
            'application/xml'
        );

        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        return new XMLSerializer().serializeToString(resultDoc);
    };

    return (
        <Button
            className="p-button-outlined p-button-secondary nexus-c-download"
            label={label}
            onClick={handleDownload}
            {...restProps}
        />
    );
};

NexusDownload.propTypes = {
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    filename: PropTypes.string.isRequired,
    mimeType: PropTypes.string,
    label: PropTypes.string,
};

NexusDownload.defaultProps = {
    label: DOWNLOAD,
    mimeType: JSON_MIME,
};

export default NexusDownload;
