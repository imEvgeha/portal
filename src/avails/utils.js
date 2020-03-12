import React from 'react';
import cloneDeep from 'lodash.clonedeep';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import get from 'lodash.get';
import createValueFormatter from '../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import CustomActionsCellRenderer from '../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import createLoadingCellRenderer from '../ui/elements/nexus-grid/elements/cell-renderer/createLoadingCellRenderer';
import Constants from './title-matching/titleMatchingConstants';
import TitleSystems from '../constants/metadata/systems';
import {getDeepValue, isObject} from '../util/Common';
import loadingGif from '../assets/img/loading.gif';

export function createColumnDefs(payload) {
    return payload.reduce((columnDefs, column) => {
        const {javaVariableName, displayName, dataType} = column;
        const columnDef = {
            field: javaVariableName,
            headerName: displayName,
            colId: javaVariableName,
            cellRenderer: createLoadingCellRenderer,
            valueFormatter: createValueFormatter(column),
            width: (dataType === 'datetime') ? 235 : 150,
        };
        return [...columnDefs, columnDef];
    }, []);
}

export function getRepositoryName(id) {
    const {NEXUS, MOVIDA, VZ} = TitleSystems;
    if (id && id.startsWith('movtitl_')) {
        return MOVIDA;
    } else if (id && id.startsWith('vztitl_')) {
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

export const getRepositoryCell = ({headerName = 'Repository'} = {}) => {
    return {
        ...Constants.ADDITIONAL_COLUMN_DEF,
        colId: 'repository',
        field: 'repository',
        headerName,
        width: 150,
        cellRendererFramework: repositoryCell
    };
};

export function createLinkableCellRenderer(params, location = '/metadata/detail/') {
    const {data, colDef, valueFormatted} = params;
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

export const createColumnSchema = (list, field) => {
    const majorityRule = (occurence, total) => occurence > (total / 2); 
    const destructedField = field.split('.');
    const values = list.map(el => {
        // TODO: we have as avails map languageAudioTypes.language and languageAudioTypes.audoType
        // and data consists as field languageAudioTypes {Array of objects {language, audioType} )
        if (destructedField.includes('languageAudioTypes') && Array.isArray(el['languageAudioTypes'])) {
            return el['languageAudioTypes'].map(el => el[destructedField[1]]).filter(Boolean);
        }
        return get(el, destructedField, {});
    });

    const occurence = values.reduce((o, v) => {
        const value = JSON.stringify(v);
        o[value] = (o[value] || 0) + 1;
        return o;
    }, {});

    const sortedValuesEntries = Object.entries(occurence).sort((a, b) => b[1] - a[1]);

    const getMostCommonValue = (entries) => {
        if (entries.length) {
            const mostCommonValue = entries
            .filter(([key, value], i) => majorityRule(value, list.length))
            .map(([key, value]) => key);

            return mostCommonValue[0];
        }
    };

    return {
        field,
        values: sortedValuesEntries.reduce((o, [key, value], i) => (o[key] = value, o), {}),
        mostCommonValue: getMostCommonValue(sortedValuesEntries),
    };
}; 

export const createSchemaForColoring = (list, columnDefs) => {
    const schema = cloneDeep(columnDefs).reduce((acc, {field}) => {
        const fieldValue = createColumnSchema(list, field);
        acc[field] = fieldValue;

        return acc;
    }, {});

    return schema;
};

export const HIGHLIGHTED_CELL_CLASS = 'nexus-c-match-right-view__grid-column--highlighted';

const isMajorValue = (majorityValue, value) => {
    const EXCLUDES_VALUES = [{}, '{}', [], '[]', false, 'false', null, 'null', ''];
    return (EXCLUDES_VALUES.includes(majorityValue)
        && EXCLUDES_VALUES.includes(value))
        || isEqual(majorityValue, value);
};

export const addCellClass = ({field, value, schema, cellClass = HIGHLIGHTED_CELL_CLASS}) => {
    const fieldValues = get(schema, ['values'], {});
    const mostCommonValue = get(schema, ['mostCommonValue'], null);

    if (Object.keys(fieldValues).length && !isMajorValue(mostCommonValue, JSON.stringify(value))) {
        return cellClass;
    };
};

