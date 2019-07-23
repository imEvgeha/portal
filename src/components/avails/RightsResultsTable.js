import React from 'react';
import t from 'prop-types';
import moment from 'moment';
import {Link} from 'react-router-dom';
import config from 'react-global-configuration';

import {getDeepValue} from '../../util/Common';
import RightsURL from '../../containers/avail/util/RightsURL';
import {rightServiceManager} from '../../containers/avail/service/RightServiceManager';

// image import
import LoadingGif from '../../img/loading.gif';

export default function withRights(WrappedComponent){
    return class extends React.Component {

        static propTypes = {
            nav: t.object
        };

        static defaultProps = {
            autoload: true,
            autoRefresh: 0
        }

        constructor(props) {
            super(props);

            this.loadingRenderer = this.loadingRenderer.bind(this);
            this.refreshColumns = this.refreshColumns.bind(this);
            this.getRows = this.getRows.bind(this);
            this.setTable = this.setTable.bind(this);
            this.parseServerResponse = this.parseServerResponse.bind(this);

            let originalColDef = this.parseColumnsSchema(this.props.availsMapping ? this.props.availsMapping.mappings : []);

            let rowsProps = {defaultColDef: {cellStyle: this.cellStyle}};
            if(this.props.fromServer) {
                rowsProps = {
                    ...rowsProps,
                    rowBuffer: '50',
                    rowModelType: 'infinite',
                    paginationPageSize: config.get('avails.page.size'),
                    infiniteInitialRowCount: '0',
                    cacheOverflowSize: '2',
                    maxConcurrentDatasourceRequests: '1',
                    datasource: this.props.autoload ? { rowCount: null, getRows: this.getRows} : null,
                };
            } else {
                rowsProps = {
                    ...rowsProps,
                    rowBuffer: '0',
//                    rowData: this.state.originalData,
                    onFirstDataRendered: this.props.staticDataLoaded
                };
            }

            let colDef = {...this.props.colDef, ...originalColDef};
            this.state = {
                originalColDef: originalColDef,
                colDef: colDef,
                cols: [],
                pageSize: config.get('avails.page.size'),
                table: null,
                rowsProps: {...this.props.rowsProps, ...rowsProps}
            };
        }

        componentDidMount() {
            let newColDef = {...this.props.colDef, ...this.state.originalColDef};
            this.refreshColumns(newColDef);
        }

        componentDidUpdate(prevProps) {
            if(prevProps.colDef !== this.props.colDef || prevProps.cols !== this.props.cols || prevProps.columns !== this.props.columns){
                let newColDef = {...this.props.colDef, ...this.state.originalColDef};
                this.refreshColumns(newColDef);
            }
        }

        parseColumnsSchema(mappings){
            const colDef = {};
            let formatter = (column) => {
                switch (column.dataType) {
                    case 'localdate' : return function(params){
                        if(params.data && params.data[column.javaVariableName]) return moment(params.data[column.javaVariableName]).format('L') + ' ' + moment(params.data[column.javaVariableName]).format('HH:mm');
                        else return undefined;
                    };
                    case 'date' : return function(params){
                        if(params.data && params.data[column.javaVariableName]) return moment(params.data[column.javaVariableName].substr(0, 10)).format('L');
                        else return undefined;
                    };
                    case 'string' : if(column.javaVariableName === 'castCrew') return function(params){
                        if(params.data && params.data[column.javaVariableName]){
                            let data = params.data[column.javaVariableName];
                            data = data.map(({personType, displayName}) => personType + ': ' + displayName).join('; ');
                            return data;
                        } else return undefined;
                    }; else return null;
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

        doSearch(page, pageSize, sortedParams) {
            return rightServiceManager.doSearch(page, pageSize, sortedParams);
        }

        getRows(params){
            if(this.state.table && this.state.table.api.getDisplayedRowCount() === 0 && !this.props.autoRefresh){
                this.state.table.api.showLoadingOverlay();
            }
            this.doSearch(Math.floor(params.startRow/this.state.pageSize), this.state.pageSize, this.props.sort)
               .then(response => {this.parseServerResponse(response, params);})
               .catch((error) => {
                   console.error('Unexpected error');
                   console.error(error);
                   params.failCallback();
               });
            }

        parseServerResponse(response, callback){
            if(response && response.data.total > 0){
                // if on or after the last page, work out the last row.
                let lastRow = -1;
                if ((response.data.page + 1) * response.data.size >= response.data.total) {
                    lastRow = response.data.total;
                }
                if(this.state.table){
                    callback.successCallback(response.data.data, lastRow);
                    this.state.table.api.hideOverlay();
                    if(this.props.onDataLoaded){
                        this.props.onDataLoaded();
                    }
                }
            }else{
                if(this.state.table){
                    this.state.table.api.showNoRowsOverlay();
                }
            }
        }

        loadingRenderer(params){
            let error = null;
            if(params.data && params.data.validationErrors){
                params.data.validationErrors.forEach( e => {
                    if(e.fieldName === params.colDef.field){
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
            if(Array.isArray(val) && val.length > 1){
                val = val.join(', ');
            }
            const content = error || params.valueFormatted || val;
            if (val !== undefined) {
                if (content || content === false) {
                    let highlighted = false;
                    if(params.data && params.data.highlightedFields) {
                        highlighted = params.data.highlightedFields.indexOf(params.colDef.field) > -1;
                    }
                    return(
                        <Link to={RightsURL.getRightUrl(params.data.id/*, this.props.nav*/)}>
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
                if(params.data){
                    return '';
                }else {
                    return <img src={LoadingGif}/>;
                }
            }
        }

         cellStyle(params) {
            let error = null;
            if(params.data && params.data.validationErrors){
                params.data.validationErrors.forEach( e => {
                 if(e.fieldName === params.colDef.field){
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

        setTable(element){
            if(element){
                element.api.showLoadingOverlay();
                this.setState({table:element});
                if(this.props.setTable){
                    this.props.setTable(element);
                }
            }
        }

        render(){
            return <WrappedComponent
                {...this.props}
                {...this.state.rowsProps}
                colDef = {this.state.cols}
                setTable={this.setTable}
                getRowNodeId={data => data.id}
            />;
        }
    };
}