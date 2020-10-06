import React from 'react';
import {Link} from 'react-router-dom';
import loadingGif from '../../../../../assets/img/loading.gif';
import {getDeepValue, isObject} from '../../../../../util/Common';
import './LoadingCellRenderer.scss';

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

    const linkTo = link && `${link}${data[linkId] || data.id || data[colId]}`;

    let value = getDeepValue(data, field);
    if (isObject(value)) {
        value = JSON.stringify(value);
    }
    if (Array.isArray(value) && value.length > 1) {
        value = value.join(', ');
    }
    const content = valueFormatted || value;
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

        return link ? (
            newTab ? (
                <a href={linkTo} target="_blank">
                    {displayValue}
                </a>
            ) : (
                <Link to={linkTo}>{displayValue}</Link>
            )
        ) : (
            displayValue
        );
    }

    return null;
};
export default LoadingCellRenderer;
