import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {getDeepValue, isObject, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Button} from 'primereact/button';
import {Link, useNavigate, useParams} from 'react-router-dom';
import './LoadingCellRenderer.scss';
import {renderTitleName} from './utils/utils';

const LoadingCellRenderer = params => {
    const navigate = useNavigate();
    const routeParams = useParams();

    const {
        data,
        colDef,
        colDef: {field, colId},
        valueFormatted,
        linkId = '',
        link = '',
        newTab = true,
    } = params;
    if (!data && colDef !== 'actions') {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }

    const getLink = () => {
        if (data.type === 'title') {
            return URL.keepEmbedded(`/${routeParams.realm}/metadata/detail/${data.id}`);
        }

        if (link?.includes('http')) {
            return URL.keepEmbedded(`${link}${data[linkId] || data.id || data[colId]}`);
        }

        return link && URL.keepEmbedded(`/${routeParams.realm}/${link}${data[linkId] || data.id || data[colId]}`);
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

        if (getLink()) {
            return newTab ? (
                getLink().includes('http') ? (
                    <a href={getLink()} target="_blank">
                        {displayValue}
                    </a>
                ) : (
                    <Link to={getLink()} target="_blank">
                        {displayValue}
                    </Link>
                )
            ) : (
                <Button label={displayValue} onClick={() => navigate(getLink())} className="p-button-link" />
            );
        }

        return displayValue;
    }

    return null;
};
export default LoadingCellRenderer;
