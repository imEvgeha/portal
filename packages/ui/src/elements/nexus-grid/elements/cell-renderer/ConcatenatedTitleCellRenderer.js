import React from 'react';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {getDeepValue, isObject, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Link} from 'react-router-dom';
import {renderTitleName} from '../../../../../../../src/pages/legacy/containers/metadata/dashboard/components/utils/utils';

const ConcatenatedTitleCellRenderer = params => {
    const {
        data,
        colDef: {field},
        newTab = true,
    } = params;
    if (!data) {
        return <img src={loadingGif} alt="loadingSpinner" />;
    }
    const linkTo = URL.keepEmbedded(`/metadata/detail/${data.id}`);

    let value = getDeepValue(data, field);
    if (isObject(value)) {
        value = JSON.stringify(value);
    }

    const {title, episodic, contentType} = data;
    const content = episodic
        ? renderTitleName(title, contentType, episodic.seasonNumber, episodic.episodeNumber, episodic.seriesTitleName)
        : value;
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

        return newTab ? (
            <a href={linkTo} target="_blank">
                {displayValue}
            </a>
        ) : (
            <Link to={linkTo}>{displayValue}</Link>
        );
    }

    return null;
};
export default ConcatenatedTitleCellRenderer;
