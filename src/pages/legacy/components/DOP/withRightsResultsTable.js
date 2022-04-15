import React from 'react';
import PropTypes from 'prop-types';
import {Link, useParams} from 'react-router-dom';
import RightsURL from '../../containers/avail/util/RightsURL';
import {getDeepValue} from '@vubiquity-nexus/portal-utils/lib/Common';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import LoadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';

// TODO - add better name for the component
const withRightsResultsTable = BaseComponent => {
    const errorCellColor = '#f2dede';
    const readyNewCellColor = '#FFFFFF';
    const readyCellColor = '#D3D3D3';
    const selectedColor = '#808080';
    const defaultCellColor = '#ededed';

    // const defaultMode = 'defaultMode';
    const selectRightMode = 'selectRightsMode';

    const ComposedComponent = props => {
        const routeParams = useParams();
        // parse columns schema
        const parseColumnsSchema = mappings => {
            const colDef = {};
            const formatter = column => {
                const {dataType, javaVariableName} = column;
                switch (dataType) {
                    case DATETIME_FIELDS.TIMESTAMP:
                    case DATETIME_FIELDS.BUSINESS_DATETIME:
                    case DATETIME_FIELDS.REGIONAL_MIDNIGHT:
                        return params => {
                            const {data} = params;
                            if (data && data[javaVariableName]) {
                                return ISODateToView(data[javaVariableName], dataType);
                            }
                        };
                    case 'priceType':
                        return params => {
                            const {data} = params;
                            if (data && Array.isArray(data[column.javaVariableName])) {
                                return data[column.javaVariableName]
                                    .map(e => String(`${e.priceType} ${e.priceValue}`))
                                    .join(', ');
                            }
                        };
                    case 'territoryType':
                    case 'audioLanguageType':
                        return params => {
                            const {data} = params;
                            if (data && Array.isArray(data[column.javaVariableName])) {
                                return data[column.javaVariableName]
                                    .map(e => String(e.country || `${e.language || '-'}/${e.audioType || '-'}`))
                                    .join(', ');
                            }
                        };
                    case 'string':
                        if (javaVariableName === 'castCrew') {
                            return params => {
                                const {data} = params;
                                if (data && data[javaVariableName]) {
                                    const result = data[javaVariableName]
                                        .map(({personType, displayName}) => `${personType}: ${displayName}`)
                                        .join('; ');
                                    return result;
                                }
                            };
                        }
                        return;
                    default:
                        return null;
                }
            };

            if (Array.isArray(mappings)) {
                mappings.forEach(column => {
                    const {javaVariableName, displayName} = column;
                    const {columnsSize} = props;
                    colDef[javaVariableName] = {
                        field: javaVariableName,
                        headerName: displayName,
                        cellRendererFramework: loadingRenderer,
                        valueFormatter: formatter(column),
                        width:
                            columnsSize && columnsSize.hasOwnProperty(javaVariableName)
                                ? columnsSize[javaVariableName]
                                : 300,
                    };
                });
            }

            return colDef;
        };

        // refresh columns
        const refreshColumns = colDef => {
            const {columns} = props;
            let cols = [];
            if (columns) {
                columns.forEach(column => {
                    if (colDef.hasOwnProperty(column)) {
                        cols.push(colDef[column]);
                    }
                });
            } else {
                cols = Object.keys(colDef).map(key => colDef[key]);
            }

            return cols;
        };

        // loading renderer
        const loadingRenderer = params => {
            const {data, colDef, valueFormatted} = params;
            let error = null;
            if (data && data.validationErrors) {
                data.validationErrors.forEach(({sourceDetails, fieldName, message}) => {
                    if (
                        colDef &&
                        (fieldName === colDef.field ||
                            (fieldName === '[start, availStart]' && colDef.field === 'start') ||
                            (fieldName === '[start, availStart]' && colDef.field === 'availStart'))
                    ) {
                        error = message;
                        if (sourceDetails) {
                            if (sourceDetails.originalValue) {
                                error += ", original value:  '" + sourceDetails.originalValue + "'";
                            }
                            if (sourceDetails.fileName) {
                                error +=
                                    ', in file ' +
                                    sourceDetails.fileName +
                                    ', row number ' +
                                    sourceDetails.rowId +
                                    ', column ' +
                                    sourceDetails.originalFieldName;
                            }
                        }
                    }
                    return error;
                });
            }

            let val;
            if (data) {
                val = getDeepValue(data, colDef.field);
            }
            if (val && val === Object(val) && !Array.isArray(val)) {
                val = JSON.stringify(val);
            }
            if (Array.isArray(val) && val.length > 1) {
                val = val.join(', ');
            }
            const content = error || valueFormatted || val;
            if (val) {
                if (content || content === false) {
                    let highlighted = false;
                    if (data && data.highlightedFields) {
                        highlighted = data.highlightedFields.indexOf(colDef.field) > -1;
                    }
                    const cellVisualContent = (
                        <>
                            <div
                                title={error}
                                className={highlighted ? 'font-weight-bold' : ''}
                                style={{
                                    whiteSpace: 'pre',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    color: error ? '#a94442' : null,
                                }}
                            >
                                {String(content)}
                            </div>
                            {highlighted && (
                                <div style={{position: 'absolute', top: '0px', right: '0px', lineHeight: '1'}}>
                                    <span
                                        title="Fields in bold are original values provided by the studios"
                                        style={{color: 'grey'}}
                                    >
                                        <i className="far fa-question-circle" />
                                    </span>
                                </div>
                            )}
                        </>
                    );
                    if (props.disableEdit) {
                        return <div> {cellVisualContent} </div>;
                    } else {
                        return (
                            <Link to={RightsURL.getRightUrl(data.id, props.nav, routeParams.realm)}>
                                {cellVisualContent}
                            </Link>
                        );
                    }
                }

                return val;
            }

            return data ? '' : <img src={LoadingGif} />;
        };

        // style cell
        const cellStyle = ({data, colDef, node}) => {
            let error = null;
            if (data && data.validationErrors) {
                data.validationErrors.forEach(e => {
                    if (
                        e.fieldName === colDef.field ||
                        (e.fieldName.includes('country') && colDef.field === 'territory') ||
                        (e.fieldName.includes('territoryExcluded') && colDef.field === 'territoryExcluded') ||
                        (e.fieldName === '[start, availStart]' && colDef.field === 'start') ||
                        (e.fieldName === '[start, availStart]' && colDef.field === 'availStart')
                    ) {
                        error = e;
                    }
                });
            }

            if (colDef.headerName !== '' && error) {
                return {backgroundColor: errorCellColor};
            } else if (props.mode === selectRightMode) {
                if (node.selected === true) {
                    return {backgroundColor: selectedColor};
                } else if (data && data.status === 'ReadyNew') {
                    return {backgroundColor: readyNewCellColor};
                } else if (data && data.status === 'Ready') {
                    return {backgroundColor: readyCellColor};
                } else {
                    return {backgroundColor: defaultCellColor};
                }
            }
        };

        return (
            <BaseComponent
                {...props}
                parseColumnsSchema={parseColumnsSchema}
                refreshColumns={refreshColumns}
                cellStyle={cellStyle}
                loadingRenderer={loadingRenderer}
            />
        );
    };

    ComposedComponent.propTypes = {
        nav: PropTypes.object,
        columnsSize: PropTypes.object,
        columns: PropTypes.array,
        disableEdit: PropTypes.bool,
    };

    ComposedComponent.defaultProps = {
        nav: null,
        columnsSize: null,
        columns: [],
    };

    return ComposedComponent;
};

export default withRightsResultsTable;
