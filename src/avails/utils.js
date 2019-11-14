import React from 'react';
import createValueFormatter from '../ui-elements/nexus-grid/elements/value-formatter/createValueFormatter';
import Constants from './title-matching/titleMatchingConstants';
import CustomActionsCellRenderer from '../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {getDeepValue, isObject} from '../util/Common';
import loadingGif from '../img/loading.gif';

export function createColumnDefs(payload) {
    return payload.reduce((columnDefs, column) => {
        const {javaVariableName, displayName, id} = column;
        const columnDef = {
            field: javaVariableName,
            headerName: displayName,
            colId: id,
            cellRenderer: createCellRenderer,
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

export function createCellRenderer(params, isLink = false) {
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
        return isLink ? 
         `<a href=${'/metadata/detail/' + data.id} target="_blank" />
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
            </a>`
            :
            `<div class="nexus-c-create-loading-cell-renderer">
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
    }
    return null;
}