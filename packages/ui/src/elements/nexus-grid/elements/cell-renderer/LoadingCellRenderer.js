import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {getDeepValue, isObject, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Button} from 'primereact/button';
import {useNavigate} from 'react-router-dom';
import './LoadingCellRenderer.scss';
import {renderTitleName} from './utils/utils';

const LoadingCellRenderer = params => {
    const navigate = useNavigate();

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

    let linkTo = link && URL.keepEmbedded(`${link}${data[linkId] || data.id || data[colId]}`);
    if (data.type === 'title') {
        linkTo = URL.keepEmbedded(`/metadata/detail/${data.id}`);
    }

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
                <Button label={displayValue} onClick={() => navigate(linkTo)} className="p-button-link" />
            );
        }

        return displayValue;
    }

    return null;
};
export default LoadingCellRenderer;
