import React from 'react';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import {get, isEqual, cloneDeep} from 'lodash';
import CustomActionsCellRenderer from '../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import createValueFormatter from '../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import TitleSystems from '../legacy/constants/metadata/systems';
import Constants from './title-matching/titleMatchingConstants';

const COLUMN_WIDTH_WIDE = 235;
const COLUMN_WIDTH_DEFAULT = 150;

export const createColumnDefs = payload => {
    return payload
        .filter(column => column.dataType && column.displayName)
        .reduce((columnDefs, column) => {
            const {javaVariableName, displayName, dataType, queryParamName, sortParamName} = column;
            const isColumnLocked = ['id'].includes(javaVariableName);
            const hasLink = ['id', 'title'].includes(javaVariableName);
            const columnDef = {
                field: javaVariableName,
                headerName: displayName,
                colId: sortParamName || queryParamName,
                cellRenderer: hasLink ? 'loadingCellRenderer' : null,
                cellRendererParams: hasLink
                    ? {
                          link: '/avails/rights/',
                      }
                    : {},
                valueFormatter: createValueFormatter(column),
                width: ['businessDateTime', 'timestamp'].includes(dataType) ? COLUMN_WIDTH_WIDE : COLUMN_WIDTH_DEFAULT,
                lockPosition: isColumnLocked,
                lockVisible: isColumnLocked,
                lockPinned: isColumnLocked,
                pinned: isColumnLocked && 'left',
                type: Object.values(DATETIME_FIELDS).includes(dataType) ? 'dateColumn' : '',
            };
            return [...columnDefs, columnDef];
        }, []);
};

export const getRepositoryName = id => {
    const {NEXUS, MOVIDA, VZ} = TitleSystems;
    if (id && id.startsWith('movtitl_')) {
        return MOVIDA;
    } else if (id && id.startsWith('vztitl_')) {
        return VZ;
    }
    return NEXUS;
};

// eslint-disable-next-line
const repositoryCell = ({data}) => {
    const {id} = data || {};
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
        cellRendererFramework: repositoryCell,
    };
};

export const createColumnSchema = (list, field) => {
    // eslint-disable-next-line no-magic-numbers
    const majorityRule = (occurence, total) => occurence > total / 2;
    const destructedField = field.split('.');
    const values = list.map(el => {
        return get(el, destructedField, {});
    });

    const occurence = values.reduce((o, v) => {
        const value = JSON.stringify(v);
        o[value] = (o[value] || 0) + 1;
        return o;
    }, {});

    const sortedValuesEntries = Object.entries(occurence).sort((a, b) => b[1] - a[1]);

    const getMostCommonValue = entries => {
        if (entries.length) {
            const mostCommonValue = entries.filter(([, value]) => majorityRule(value, list.length)).map(([key]) => key);

            return mostCommonValue[0];
        }
    };

    return {
        field,
        values: sortedValuesEntries.reduce((o, [key, value]) => {
            o[key] = value;
            return o;
        }, {}),
        mostCommonValue: getMostCommonValue(sortedValuesEntries),
    };
};

export const createSchemaForColoring = (list, columnDefs) => {
    return cloneDeep(columnDefs).reduce((acc, {field}) => {
        acc[field] = createColumnSchema(list, field);
        return acc;
    }, {});
};

export const HIGHLIGHTED_CELL_CLASS = 'nexus-c-match-right-view__grid-column--highlighted';

const isMajorValue = (majorityValue, value) => {
    const EXCLUDES_VALUES = [{}, '{}', [], '[]', false, 'false', null, 'null', ''];
    return (
        (EXCLUDES_VALUES.includes(majorityValue) && EXCLUDES_VALUES.includes(value)) || isEqual(majorityValue, value)
    );
};

export const addCellClass = ({value, schema, cellClass = HIGHLIGHTED_CELL_CLASS}) => {
    const fieldValues = get(schema, ['values'], {});
    const mostCommonValue = get(schema, ['mostCommonValue'], null);

    if (Object.keys(fieldValues).length && !isMajorValue(mostCommonValue, JSON.stringify(value))) {
        return cellClass;
    }
};
