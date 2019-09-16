import React from 'react';
import moment from 'moment';
import {getDeepValue} from '../../util/Common';
import {Link} from 'react-router-dom';
import RightsURL from '../../containers/avail/util/RightsURL';
import LoadingGif from '../../img/loading.gif';
import t from 'prop-types';

export default class RightsResultsTable extends React.Component {

    static propTypes = {
        nav: t.object,
        columnsSize: t.object,
        columns: t.array
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
        mappings.map(column => colDef[column.javaVariableName] = {
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

        if(Array.isArray(val)){
            const {colDef = {}} = params;
            if (colDef.field === 'territory') {
                const countries = val.filter(el => el.country).map(el => {
                    return {
                        type: 'country',
                        name: el.country,
                    };
                });

                const errors = params.data.validationErrors
                    .filter(el => el.fieldName.includes('country'))
                    .map(el => {
                        return {
                            type: 'error',
                            name: el.sourceDetails.originalValue || el.message,
                        };
                    });

                const result = [...countries, ...errors]
                    .map((item, index, arr) => {
                        const style = item.type === 'error' ? {color: 'rgb(169, 68, 66)'} : {};
                        return (
                           <span key={index} style={style}>{`${item.name}${index < arr.length - 1 ? ', ' : ' '}`}</span>
                        );
                    });

                return (
                    <Link to={RightsURL.getRightUrl(params.data.id, this.props.nav)}>{result}</Link>
                );
            }

            if (colDef.field === 'territoryExcluded') {
                const countries = val.filter(el => el).map(el => {
                    return {
                        type: 'country',
                        name: el,
                    };
                });

                const errors = params.data.validationErrors
                .filter(el => el.fieldName.includes('territoryExcluded'))
                .map(el => {
                    return {
                        type: 'error',
                        name: el.sourceDetails.originalValue || el.message,
                    };
                });

                const result = [...countries, ...errors]
                    .map((item, index, arr) => {
                        const style = item.type === 'error' ? {color: 'rgb(169, 68, 66)'} : {};
                        return (
                            <span key={index} style={style}>{`${item.name}${index < arr.length - 1 ? ', ' : ' '}`}</span>
                        );
                    });

                return (
                    <Link to={RightsURL.getRightUrl(params.data.id, this.props.nav)}>{result}</Link>
                );
            }

            if (colDef.field === 'affiliate') {
                const affiliate = val.filter(el => el).map(el => {
                    return {
                        type: 'affiliate',
                        name: el,
                    };
                });

                const errors = params.data.validationErrors
                .filter(el => el.fieldName.includes('affiliate') && !el.fieldName.includes('affiliateExclude'))
                .map(el => {
                    return {
                        type: 'error',
                        name: el.sourceDetails.originalValue || el.message,
                    };
                });

                const result = [...affiliate, ...errors]
                .map((item, index, arr) => {
                    const style = item.type === 'error' ? {color: 'rgb(169, 68, 66)'} : {};
                    return (
                        <span key={index} style={style}>{`${item.name}${index < arr.length - 1 ? ', ' : ' '}`}</span>
                    );
                });

                return (
                    <Link to={RightsURL.getRightUrl(params.data.id, this.props.nav)}>{result}</Link>
                );
            }

            if (colDef.field === 'affiliateExclude') {
                const affiliateExclude = val.filter(el => el).map(el => {
                    return {
                        type: 'affiliateExclude',
                        name: el,
                    };
                });

                const errors = params.data.validationErrors
                .filter(el => el.fieldName.includes('affiliateExclude'))
                .map(el => {
                    return {
                        type: 'error',
                        name: el.sourceDetails.originalValue || el.message,
                    };
                });

                const result = [...affiliateExclude, ...errors]
                .map((item, index, arr) => {
                    const style = item.type === 'error' ? {color: 'rgb(169, 68, 66)'} : {};
                    return (
                        <span key={index} style={style}>{`${item.name}${index < arr.length - 1 ? ', ' : ' '}`}</span>
                    );
                });

                return (
                    <Link to={RightsURL.getRightUrl(params.data.id, this.props.nav)}>{result}</Link>
                );
            }

            if (colDef.field === 'castCrew') {
                const castCrew = val.filter(el => el).map(el => {
                    return {
                        type: 'castCrew',
                        name: `${el.displayName || ''} (${el.personType})`,
                    };
                });

                const errors = params.data.validationErrors
                .filter(el => el.fieldName.includes('castCrew'))
                .map(el => {
                    return {
                        type: 'error',
                        name: el.sourceDetails.originalValue || el.message,
                    };
                });

                const result = [...castCrew, ...errors]
                .map((item, index, arr) => {
                    const style = item.type === 'error' ? {color: 'rgb(169, 68, 66)'} : {};
                    return (
                        <span key={index} style={style}>{`${item.name}${index < arr.length - 1 ? ', ' : ' '}`}</span>
                    );
                });

                return (
                    <Link to={RightsURL.getRightUrl(params.data.id, this.props.nav)}>{result}</Link>
                );
            }
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
                            {String(content)}
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
