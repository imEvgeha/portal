import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {downloadFile, getDeepValue, isObject, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Link} from 'react-router-dom';
import './LoadingCellRenderer.scss';
import { downloadUploadedMetadata } from '../../../../../../../src/pages/title-metadata/utils';
import {renderTitleName} from './utils/utils';

const LoadingCellRenderer = params => {
    const {
        data,
        colDef,
        colDef: {field, colId},
        valueFormatted,
        linkId = '',
        link = null,
        newTab = true,
    } = params;
    if (!data && colDef !== 'actions') {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }

    const idToFileDownloading = data.reportId;
    let linkTo = link && URL.keepEmbedded(`${link}${data[linkId] || data.id || data[colId]}`);
    if (data.type === 'title') {
        linkTo = URL.keepEmbedded(`/metadata/detail/${data.id}`);
    }
    
    const handleDownload = () => {
        downloadUploadedMetadata(idToFileDownloading).then(response => {
            const buffer = new Uint8Array(response.value).buffer;
            const buftype = 'application/vnd.ms-excel;charset=utf-8';
            const blob = new Blob([buffer], {type: buftype});
            downloadFile(blob, 'Editorial_Metadata');
        }).catch((err) => console.error(err))
    };

    let value = getDeepValue(data, field);
    if (isObject(value)) {
        value = JSON.stringify(value);
    }
    if (Array.isArray(value) && value.length > 1) {
        value = value.join(', ');
    }
    const {title, episodic, contentType} = data;
    const content =
        colId === 'concatenatedTitle' && episodic
            ? renderTitleName(
                  title,
                  contentType,
                  episodic.seasonNumber,
                  episodic.episodeNumber,
                  episodic.seriesTitleName
              )
            : valueFormatted || value;
    if ((content !== undefined && content !== null) || content === false) {
        let highlighted = false;
        if (data && data.highlightedFields) {
            highlighted = data.highlightedFields.indexOf(field) > -1;
        }
        const displayValue = (
            <div className="nexus-c-loading-cell-renderer">
                <div className={`nexus-c-loading-cell-renderer__value ${highlighted ? 'font-weight-bold' : ''}`}>
                    {String(content)}
                </div>
                {highlighted ? (
                    <span
                        title="Fields in bold are original values provided by the studios"
                        className="nexus-c-loading-cell-renderer__highlighted"
                    >
                        <i className="far fa-question-circle nexus-c-loading-cell-renderer__icon" />
                    </span>
                ) : (
                    ''
                )}
            </div>
        );
        
        if (linkTo) {
            return newTab ? (
                <a href={linkTo} target="_blank">
                    {displayValue}
                </a>
            ) : (
                <Link to={linkTo}>{displayValue}</Link>
            )
        } 

        if (idToFileDownloading) {
            return <Link to='#'  onClick={handleDownload}>{displayValue}</Link>
        }
        
        return displayValue;
    }

    return null;
};
export default LoadingCellRenderer;
