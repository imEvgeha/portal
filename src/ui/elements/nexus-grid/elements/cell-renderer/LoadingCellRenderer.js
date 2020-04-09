import React from 'react';
import {getDeepValue, isObject} from '../../../../../util/Common';
import './LoadingCellRenderer.scss';
import loadingGif from '../../../../../assets/img/loading.gif';

const LoadingCellRenderer = (params) => {
    const {data, colDef, valueFormatted, link = null} = params;
    if (!data && colDef !== 'actions') {
        return (<img src={loadingGif} alt='loadingSpinner' />);
    }
    let value = getDeepValue(data, colDef.field);
    if (isObject(value)) {
        value = JSON.stringify(value);
    }
    if (Array.isArray(value) && value.length > 1){
        value = value.join(', ');
    }
    const content = valueFormatted || value;
    if (content !== undefined && content !== null || content === false) {
        let highlighted = false;
        if (data && data.highlightedFields) {
            highlighted = data.highlightedFields.indexOf(colDef.field) > -1;
        }
        const displayValue = (
            <div className="nexus-c-loading-cell-renderer">
                <div className={`nexus-c-loading-cell-renderer__value ${highlighted ? 'font-weight-bold' : ''}`}>
                    {String(content)}
                </div>
                {
                    highlighted ? (
                        <span
                            title='* fields in bold are original values provided by the studios'
                            className="nexus-c-loading-cell-renderer__highlighted"
                        >
                            <i className="far fa-question-circle nexus-c-loading-cell-renderer__icon"></i>
                        </span>
                    ) : ''
                }
            </div>
        );
        return (
            link ? (
                <a href={`${link}${data.id}`} target="_blank">
                    {displayValue}
                </a>
            ) : (displayValue)
        );
    }
    return null;
};
export default LoadingCellRenderer;
