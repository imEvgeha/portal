import cloneDeep from 'lodash.clonedeep';
import createValueFormatter from '../ui-elements/nexus-grid/elements/value-formatter/createValueFormatter';
import Constants from './title-matching/titleMatchingConstants';
import CustomActionsCellRenderer from '../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {getDeepValue, isObject} from '../util/Common';
import loadingGif from '../img/loading.gif';
import createLoadingCellRenderer from '../ui-elements/nexus-grid/elements/cell-renderer/createLoadingCellRenderer';

export function createColumnDefs(payload) {
    return payload.reduce((columnDefs, column) => {
        const {javaVariableName, displayName} = column;
        const columnDef = {
            field: javaVariableName,
            headerName: displayName,
            colId: javaVariableName,
            cellRenderer: createLoadingCellRenderer,
            valueFormatter: createValueFormatter(column),
            width: 150,
        };
        return [...columnDefs, columnDef];
    }, []);
}

export function getRepositoryName(id) {
    const {NEXUS, MOVIDA, VZ} = Constants.repository;
    if(id.startsWith('movtitl_')) {
        return MOVIDA;
    }
    else if(id.startsWith('vztitl_')) {
        return VZ;
    }
    return NEXUS;
}

const repositoryCell = ({data}) => {// eslint-disable-line
    const { id } = data || {};
    return (
        <CustomActionsCellRenderer id={id}>
            <div className="nexus-c-custom-actions-cell-renderer">{getRepositoryName(id).toUpperCase()}</div>
        </CustomActionsCellRenderer>
    );
};

export const getRepositoryCell = () => {
    return {
        ...Constants.ADDITIONAL_COLUMN_DEF,
        colId: 'repository',
        field: 'repository',
        headerName: 'Repository',
        cellRendererFramework: repositoryCell,
    };
};

export function createLinkableCellRenderer(params, location = '/metadata/detail/') {
    const {data, colDef, valueFormatted} = params;
    if (!data && colDef !== 'actions') {
        return `<img src=${loadingGif} alt='loadingSpinner' />`;
    }
    let value = getDeepValue(data, colDef.field);
    if (typeof value === 'boolean') {
        return `<span>${value ? 'Yes' : 'No'}</span>`;
    }
    if (isObject(value)) {
        value = JSON.stringify(value);
    }
    if (Array.isArray(value) && value.length > 1){
        value = value.join(', ');
    }
    const content = valueFormatted || value;
    if (content) {
        let highlighted = false;
        if (data && data.highlightedFields) {
            highlighted = data.highlightedFields.indexOf(colDef.field) > -1;
        }
        let displayValue = `
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
        </div>`;
        return `
            <a href=${location + data.id} target="_blank" />
                ${displayValue}
            </a>`;
    }
    return null;
}

export const createSchemaForColoring = (rightList, columnDefs) => {
    const schema = cloneDeep(columnDefs).reduce((acc, {field}) => {
        const values = rightList.map(el => el[field]);
        const occurence = values.reduce((o, v) => {
            const value = JSON.stringify(v);
            o[value] = (o[value] || 0) + 1;
            return o;
        }, {});

        const sortByOccurrence = Object.keys(occurence).sort((a, b) => {
            return occurence[a] < occurence[b];
        }) || [];

        const sortedValues = sortByOccurrence.reduce((o, v) => {
            o[v] = occurence[v];
            return o;
        }, {});

        // additonal rules
        if (Object.values(sortedValues).length > 1 
            && Object.values(sortedValues).filter((el, i, arr) => el === arr[0]).length > 1
        ) {
            acc[field] = {
                field,
                occurence: sortedValues,
            };
        }

        return acc;

    }, {});

    return schema;
};

