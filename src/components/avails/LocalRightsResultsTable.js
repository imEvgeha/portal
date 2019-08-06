import React from 'react';
import config from 'react-global-configuration';

import RightsResultsTable from './RightsResultsTable';
import {nextFrame} from '../../util/Common';

export default function withLocalRights(WrappedComponent) {
    return (props) => <LocalRightsResultsTable WrappedComponent={WrappedComponent} {...props} />;
}

class LocalRightsResultsTable extends RightsResultsTable {

    static defaultProps = {
        autoRefresh: 0
    }

    constructor(props) {
        super(props);

        this.loadingRenderer = this.loadingRenderer.bind(this);
        this.refreshColumns = this.refreshColumns.bind(this);
        this.setTable = this.setTable.bind(this);
        this.selectAll = this.selectAll.bind(this);

        let originalColDef = this.parseColumnsSchema(this.props.availsMapping ? this.props.availsMapping.mappings : []);
        let colDef = {...this.props.colDef, ...originalColDef};

        let rowsProps = {defaultColDef: {cellStyle: this.cellStyle}};

        rowsProps = {
            ...rowsProps,
            rowBuffer: '0',
            onFirstDataRendered: this.props.staticDataLoaded
        };

        this.state = {
            originalData: this.props.availTabPageSelection.selected.slice(0),
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

        if(prevProps.hidden !== this.props.hidden && !this.props.hidden){
            this.setState({originalData: this.props.availTabPageSelection.selected.slice(0)});
            nextFrame(this.selectAll);
        }
    }

    selectAll(){
        if(!this.state.table) return;
        this.state.table.api.deselectAll();
        this.state.table.api.forEachNode(rowNode => {
            if(rowNode.data && this.props.availTabPageSelection.selected.filter(sel => (sel.id === rowNode.data.id)).length > 0){
                rowNode.setSelected(true);
            }
        });
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
        const {WrappedComponent} = this.props;
        return <WrappedComponent
            {...this.props}
            {...this.state.rowsProps}
            colDef = {this.state.cols}
            setTable={this.setTable}
            getRowNodeId={data => data.id}
            rowData= {this.state.originalData}
        />;
    }
}