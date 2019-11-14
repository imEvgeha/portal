import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {getDeepValue} from '../../util/Common';
import RightsURL from '../../containers/avail/util/RightsURL';
import LoadingGif from '../../img/loading.gif';
import {isObject} from '../../util/Common';

export default class RightsResultsTable extends React.Component {
    static propTypes = {
        nav: PropTypes.object,
        columnsSize: PropTypes.object,
        columns: PropTypes.array
    };

    static defaultProps = {
        nav: null,
        columnsSize: null,
        columns: null,
    };

    parseColumnsSchema(mappings){
        const colDef = {};
        let formatter = (column) => {
            switch (column.dataType) {
                case 'localdate' : return function(params){
                    if(params.data && params.data[column.javaVariableName]) {
                        return moment(params.data[column.javaVariableName]).format('L') + ' ' + moment(params.data[column.javaVariableName]).format('HH:mm');
                    }
                    return;
                };
                case 'date' : return function(params){
                    if((params.data && params.data[column.javaVariableName]) && moment(String(params.data[column.javaVariableName]).substr(0, 10)).isValid()) {
                        return moment(params.data[column.javaVariableName].toString().substr(0, 10)).format('L');
                    }
                    return;
                };
                case 'string' : if(column.javaVariableName === 'castCrew') return function(params){
                    if(params.data && params.data[column.javaVariableName]){
                        let data = params.data[column.javaVariableName];
                        data = data.map(({personType, displayName}) => personType + ': ' + displayName).join('; ');
                        return data;
                    }
                    return;
                }; else return null;
                case 'territoryType' : return function(params){
                    if(params.data && params.data[column.javaVariableName]) {
                        const cellValue = params.data[column.javaVariableName]
                        .map(e => String(e.country)).join(', ');
                        return cellValue;
                    }
                    return;
                };
                default: return null;
            }
        };
        mappings.filter(({dataType}) => dataType).map(column => colDef[column.javaVariableName] = {
            field:column.javaVariableName,
            headerName:column.displayName,
            cellRendererFramework: this.loadingRenderer,
            valueFormatter: formatter(column),
            width: this.props.columnsSize && this.props.columnsSize.hasOwnProperty(column.javaVariableName)? this.props.columnsSize[column.javaVariableName] : 250
        });

        return colDef;
    }

    refreshColumns(newColDef){
        let newCols= [];
        if(this.props.columns){
            this.props.columns.map(acc => {
                if(newColDef.hasOwnProperty(acc)){
                    newCols.push(newColDef[acc]);
                }
            });
        }else{
            newCols = Object.keys(newColDef).map((key) => newColDef[key]);
        }
        this.setState({colDef: newColDef, cols: newCols});
    }

    loadingRenderer(params){
        let error = null;
        if(params.data && params.data.validationErrors){
            params.data.validationErrors.forEach( e => {
                if(params.colDef 
                    && ((e.fieldName === params.colDef.field) 
                    || (e.fieldName === '[start, availStart]' && params.colDef.field === 'start') 
                    || (e.fieldName === '[start, availStart]' && params.colDef.field === 'availStart'))) {
                    error = e.message;
                    if(e.sourceDetails){
                        if(e.sourceDetails.originalValue) error += ', original value:  \'' + e.sourceDetails.originalValue + '\'';
                        if(e.sourceDetails.fileName){
                            error += ', in file ' + e.sourceDetails.fileName
                                + ', row number ' + e.sourceDetails.rowId
                                + ', column ' + e.sourceDetails.originalFieldName;
                        }
                    }

                }
                return error;
            });
        }

        let val;
        if(params.data) {
            val = getDeepValue(params.data, params.colDef.field);
        }
        if(val && val === Object(val) && !Array.isArray(val)){
            val = JSON.stringify(val);
        }

        let arrayTypeFieldValue = null;

        if(Array.isArray(val)){
            const {colDef = {}} = params;
            const getComplexFieldValue = (field, element) => {
                switch (field) {
                    case 'territory':
                        return element.country;
                    case 'castCrew':
                        return `${element.displayName || ''}(${element.personType}`;
                    default:
                        return null;
                }
            };
            const filterFieldValues = (values, field) => {
                const result = values && values.map((el, index) => {
                    const updatedObject = {
                        type: field,
                        field,
                        id: index,
                        isValid: true,
                    };
                    if (isObject(el)) {
                        updatedObject.value = getComplexFieldValue(field, el) || el[Object.keys(el)[0]];
                    } else {
                        updatedObject.value = el;
                    }
                    return updatedObject;
                });

                return result || [];
            };

            const filterFieldErrors = (errors, type) => {
                const regForEror = /\[(.*?)\]/i;
                const result = Array.isArray(errors) && errors.filter(({fieldName}) => {
                    const complexFieldIndex = fieldName.indexOf('[');
                    if (complexFieldIndex > -1) {
                        const fieldNameBase = fieldName.slice(0, complexFieldIndex);
                        return fieldNameBase === type || type.includes(fieldNameBase);
                    }

                    return fieldName === type;
                })
                    .map(({sourceDetails, severityType, message}) => {
                        const matchObj = sourceDetails && sourceDetails.originalFieldName && sourceDetails.originalFieldName.match(regForEror);
                        return {
                            type: 'error',
                            value: (sourceDetails && sourceDetails.originalValue) || message,
                            field: sourceDetails && sourceDetails.originalFieldName,
                            severityType,
                            id: matchObj && Number(matchObj[1]),
                            isValid: false,
                        };
                    });

                return result || [];
            };

            const regForSubField = /.([A-Za-z]+)$/;
            const parsedFields = ['languageAudioTypes.languge', 'languageAudioTypes.audioType'];

            let errors = filterFieldErrors(params.data.validationErrors, colDef.field)
                .filter(error => {
                    const {field} = error || {};
                    const errorSubField = field && field.match(regForSubField) && field.match(regForSubField)[1];
                    return errorSubField && parsedFields.every(field => !field.includes(errorSubField));
                });

            let parsedFieldsErrors = filterFieldErrors(params.data.validationErrors, colDef.field)
                .filter(error => {
                    const {field} = error || {};
                    const errorSubField = field && field.match(regForSubField) && field.match(regForSubField)[1];
                    return errorSubField && parsedFields.some(field => field.includes(errorSubField));
                })
                .map(error => {
                    const errorSubField = error.field.match(regForSubField)[1];
                    error.subField = errorSubField;
                    return error;
                });

            const updatedValues = filterFieldValues(val, colDef.field).reduce((mergedValues, value) => {
                if (errors.some(el => el.id === value.id)) {
                    value.type = 'error';
                    value.isValid = false;
                    if (!value.value) {
                        const error = errors.find(({id}) => id === value.id);
                        value.value = error && error.value;
                    }
                } else if (parsedFieldsErrors.some(err => err.id === value.id)) {
                    const error = parsedFieldsErrors.find(err => value.field.includes(err.subField));
                    if (error) {
                        value.type = 'error';
                        value.isValid = false;
                        if (!value.value) {
                            value.value = error && error.value;
                        }
                    }
                }  
                return [...mergedValues, value];
            }, []);

            errors = errors.filter(el => updatedValues.every(value => value.id !== el.id));

            parsedFieldsErrors = parsedFieldsErrors.filter(el => updatedValues.every(value => value.id !== el.id));

            const mergedValues = [...updatedValues, ...errors, ...parsedFieldsErrors];

            const result = mergedValues
                .map((item, index, arr) => {
                    const style = item.type === 'error' ? {color: 'rgb(169, 68, 66)'} : {};
                    return (
                        <span key={index} style={style}>{`${item.value || 'N/A'}${index < arr.length - 1 ? ', ' : ' '}`}</span>
                    );
                });

            arrayTypeFieldValue = result;
        }
        const content = error || params.valueFormatted || val;
        if (val !== undefined) {
            if (content || content === false) {
                let highlighted = false;
                if(params.data && params.data.highlightedFields) {
                    highlighted = params.data.highlightedFields.indexOf(params.colDef.field) > -1;
                }
                return(
                    <Link to={RightsURL.getRightUrl(params.data.id, this.props.nav)}>
                        <div
                            title= {error}
                            className = {highlighted ? 'font-weight-bold' : ''}
                            style={{textOverflow: 'ellipsis', overflow: 'hidden', color: error ? '#a94442' : null}}>
                            {arrayTypeFieldValue || String(content)}
                        </div>
                        {highlighted &&
                        <div
                            style={{position: 'absolute', top: '0px', right: '0px', lineHeight:'1'}}>
                            <span title={'* fields in bold are original values provided by the studios'} style={{color: 'grey'}}><i className="far fa-question-circle"></i></span>
                        </div>
                        }
                    </Link>
                );
            }
            else return val;
        } else {
            if (params.data){
                return '';
            }
            return <img src={LoadingGif}/>;
        }
    }

    cellStyle(params) {
        let error = null;
        if(params.data && params.data.validationErrors){
            params.data.validationErrors.forEach( e => {
                if(e.fieldName === params.colDef.field 
                    || (e.fieldName.includes('territory') && !e.fieldName.includes('territoryExcluded') && params.colDef.field === 'territory') 
                    || (e.fieldName.includes('territoryExcluded') && params.colDef.field === 'territoryExcluded')
                    || (e.fieldName === '[start, availStart]' && params.colDef.field === 'start') 
                    || (e.fieldName === '[start, availStart]' && params.colDef.field === 'availStart')
                    || (e.fieldName.includes('affiliate') && params.colDef.field === 'affiliate')
                    || (e.fieldName.includes('affiliateExclude') && params.colDef.field === 'affiliateExclude')
                    || (e.fieldName.includes('castCrew') && params.colDef.field === 'castCrew')) {
                    error = e;
                }
            });
        }
        if (params.colDef.headerName !== '' && error) {
            return {backgroundColor: '#f2dede'};
        } else {
            return null;
        }
    }
}

