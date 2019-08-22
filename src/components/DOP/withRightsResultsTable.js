import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {getDeepValue} from '../../util/Common';
import {Link} from 'react-router-dom';
import RightsURL from '../../containers/avail/util/RightsURL';
import LoadingGif from '../../img/loading.gif';

// TODO - add better name for the component
const withRightsResultsTable = BaseComponent => {
    const ComposedComponent = props => {
        // parse colums schema
        const parseColumnsSchema = mappings => {
            const colDef = {};
            const formatter = (column) => {
                const {dataType, javaVariableName} = column;
                switch (dataType) {
                    case 'localdate': 
                        return (params) => {
                        const {data} = params;
                        if (data && data[javaVariableName]) {
                            return `${moment(data[javaVariableName]).format('L')} ${moment(data[javaVariableName]).format('HH:mm')}`;
                        }
                    };
                    case 'date': 
                        return (params) => {
                        const {data} = params;
                        if (data && data[column.javaVariableName]) {
                            return moment(data[javaVariableName].substr(0, 10)).format('L');
                        }
                    };
                    case 'territoryType':
                        return (params) => {
                            const {data} = params;
                            if(data && data[column.javaVariableName]) {
                                return data[column.javaVariableName].map(e => String(e.country)).join(', ');
                            }
                        };
                    case 'string': 
                        if (javaVariableName === 'castCrew') {
                        return (params) => {
                            const {data} = params;
                            if (data && data[javaVariableName]){
                                const result = data[javaVariableName]
                                .map(({personType, displayName}) => `${personType}: ${displayName}`)
                                .join('; ');
                                return result;
                            }
                        };
                    }
                    return;
                    default: return null;
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
                        width: columnsSize && columnsSize.hasOwnProperty(javaVariableName) ? columnsSize[javaVariableName] : 250
                    };
                });
            }

            return colDef;
        };

        // refresh columns
        const refreshColumns = colDef => {
            const {columns} = props;
            let cols= [];
            if (columns){
                columns.forEach(column => {
                    if (colDef.hasOwnProperty(column)){
                        cols.push(colDef[column]);
                    }
                });
            } else {
                cols = Object.keys(colDef).map((key) => colDef[key]);
            }

            return cols;
        };

        // loading renderer
        const loadingRenderer = params => {
            const {data, colDef, valueFormatted} = params;
            let error = null;
            if (data && data.validationErrors){
                data.validationErrors.forEach(({sourceDetails, fieldName, message}) => {
                    if (fieldName === colDef.field){
                        error = message;
                        if (sourceDetails){
                            if (sourceDetails.originalValue) {
                                error += ', original value:  \'' + sourceDetails.originalValue + '\'';
                            }
                            if (sourceDetails.fileName) {
                                error += ', in file ' + sourceDetails.fileName
                                + ', row number ' + sourceDetails.rowId
                                + ', column ' + sourceDetails.originalFieldName;
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
            if (val && val === Object(val) && !Array.isArray(val)){
                val = JSON.stringify(val);
            }
            if (Array.isArray(val) && val.length > 1){
                val = val.join(', ');
            }
            const content = error || valueFormatted || val;
            if (val) {
                if (content || content === false) {
                    let highlighted = false;
                    if (data && data.highlightedFields) {
                        highlighted = data.highlightedFields.indexOf(colDef.field) > -1;
                    }
                    return (
                        <Link to={RightsURL.getRightUrl(data.id, props.nav)}>
                            <div
                                title= {error}
                                className = {highlighted ? 'font-weight-bold' : ''}
                                style={{textOverflow: 'ellipsis', overflow: 'hidden', color: error ? '#a94442' : null}}>
                                {String(content)}
                            </div>
                            {highlighted && (
                                <div
                                    style={{position: 'absolute', top: '0px', right: '0px', lineHeight:'1'}}>
                                    <span title={'* fields in bold are original values provided by the studios'} style={{color: 'grey'}}><i className="far fa-question-circle"></i></span>
                                </div>
                            )}
                        </Link>
                    );
                }

                return val;
            } 

            return data ? '' : <img src={LoadingGif}/>;
        };

        // style cell
        const cellStyle = ({data, colDef}) => {
            let error = null;
            if(data && data.validationErrors){
                data.validationErrors.forEach(e => {
                    if (e.fieldName === colDef.field){
                        error = e;
                    }
                });
            }
            if (colDef.headerName !== '' && error) {
                return {backgroundColor: '#f2dede'};
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
    };

    ComposedComponent.defaultProps = {
        nav: null,
        columnsSize: null,
        columns: [],
    };

    return ComposedComponent;
};

export default withRightsResultsTable;
