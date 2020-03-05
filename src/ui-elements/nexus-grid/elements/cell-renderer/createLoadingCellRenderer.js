import {getDeepValue, isObject} from '../../../../util/Common';
import './createLoadingCellRenderer.scss';
import loadingGif from '../../../../img/loading.gif';

export default function createLoadingCellRenderer(params) {
    const {data, colDef, valueFormatted} = params;
    console.log(params, 'create')
    if (!data && colDef !== 'actions') {
        return `<img src=${loadingGif} alt='loadingSpinner' />`;
    }
    let value = getDeepValue(data, colDef.field);
    if (isObject(value)) {
        value = JSON.stringify(value);
    }
    if (Array.isArray(value) && value.length > 1){
        value = value.join(', ');
    }
    const content = valueFormatted || value;
    if (content !== undefined && content !== null) {
        let highlighted = false;
        if (data && data.highlightedFields) {
            highlighted = data.highlightedFields.indexOf(colDef.field) > -1;
        }
        return ` 
            <div class="nexus-c-create-loading-cell-renderer">
                <div class="nexus-c-create-loading-cell-renderer__value ${highlighted ? 'font-weight-bold' : ''}">
                    ${String(content)}
                </div>
                ${highlighted ? `
                    <span 
                        title='* fields in bold are original values provided by the studios'
                        class="nexus-c-create-loading-cell-renderer__highlighted"
                    >
                        <i class="far fa-question-circle nexus-c-cerate-loading-cell-renderer__icon"></i>
                    </span>
                ` : ''}
            </div>
        `;
    }
    return null;
}

