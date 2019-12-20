import React from 'react';
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

// rule for row (disable unselect, add strike through line) on matching rights
const applyRowRule = (params = {}, constants) => {
    const {UNSELECTED_STATUSES, MIN_SELECTED_ROWS} = constants;
    const {node, data, api} = params || {};
    const selectedRows = api.getselectedrows() || [];
    const selectedIds = selectedRows.map(el => el.id);

    if (node.selected) {
        let rowClass = '';

        if (UNSELECTED_STATUSES.includes(data.status)
            && selectedIds[selectedIds.length - 1] !== data.id
            && selectedIds[0] !== data.id
        ) {
            rowClass = `${rowClass} nexus-c-nexus-grid__unselected`;
        }

        if (selectedIds.length <= MIN_SELECTED_ROWS) {
            rowClass = `${rowClass} nexus-c-nexus-grid__selected--disabled`;
        }

        return rowClass;
    }
};

// rule for column coloring
const applyColumnRule = ({node, data, colDef, api, value}, rightList, ref, constants) => {
    const {FIELDS_WITHOUT_COLOURING, UNSELECTED_STATUSES} = constants;
    const selectedRows = api.getselectedrows() || [];
    const selectedIds = selectedRows.map(el => el.id);

    if (selectedIds.includes(data.id)
        && !FIELDS_WITHOUT_COLOURING.includes(colDef.field)
        && !(UNSELECTED_STATUSES.includes(data.status)
            && (selectedIds[selectedIds.length - 1] !== data.id && selectedIds[0] !== data.id)
        )
    ) {
        const columnValuesCounter = rightList
            .map(el => el[colDef.field])
            .filter(Boolean)
            .reduce((object, value) => {
                const val = JSON.stringify(value);
                object[val] = (object[val] || 0) + 1;
                return object;
            }, {});

        const sortByOccurrence = Object.keys(columnValuesCounter).sort((a, b) => {
            return columnValuesCounter[a] < columnValuesCounter[b];
        }) || [];

        const numberOfMaxValues = Object.values(columnValuesCounter)
            .filter(el => sortByOccurrence && el === columnValuesCounter[sortByOccurrence[0]]) || [];

        if (!sortByOccurrence.length || sortByOccurrence.length === 1) {
            return;
        } else if (!isEqual(JSON.stringify(value), sortByOccurrence[0]) || numberOfMaxValues.length > 1) {
            ref.current = [...ref.current, colDef.field];
            return 'nexus-c-match-right-view__grid-column--highlighted';
        }
    }
};

