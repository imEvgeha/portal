import React from 'react';

export default function withColumnsReorder(WrappedComponent){
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.setTable = this.setTable.bind(this);
            this.onColumnReordered = this.onColumnReordered.bind(this);
            this.onColumnResized = this.onColumnResized.bind(this);
            this.refreshColumns = this.refreshColumns.bind(this);

            this.state = {
                table: null,
                columns: this.props.columnsOrder ? this.props.columnsOrder : [],
                cols: [],
                columnsSize: {}
            };
        }

        componentDidMount() {
            if(this.props.availsMapping) {
                this.refreshColumns();
            }
        }

        componentDidUpdate(prevProps) {
            if(prevProps.availsMapping !== this.props.availsMapping){
                this.refreshColumns();
            }
            if(prevProps.columnsOrder !== this.props.columnsOrder){
                this.setState({columns: this.props.columnsOrder});
            }
        }

        onColumnReordered(e) {
            let cols = [];
            e.columnApi.getAllGridColumns().map(column => {
                if(column.colDef.headerName !== '') cols.push(column.colDef.field);
            });
            this.setState({columns: cols});
            if(this.props.updateColumnsOrder){
                this.props.updateColumnsOrder(cols);
            }
        }

        onColumnResized(e) {
            if(e.finished){
                this.setState({columnsSize:{...this.state.columnsSize, [e.column.colDef.field] : e.column.actualWidth}});
            }
        }

        refreshColumns(){
            if(!this.props.columnsOrder){
                let columns = this.props.availsMapping.mappings.map(({javaVariableName}) => javaVariableName);
                this.setState({ columns: columns});
                if(this.props.updateColumnsOrder){
                    this.props.updateColumnsOrder(columns);
                }
            }
        }

        setTable(element){
            if(element){
                this.setState({table:element});
                if(this.props.setTable){
                    this.props.setTable(element);
                }
            }
        }

        render(){
            return <WrappedComponent
                {...this.props}
                setTable={this.setTable}
                columns={this.state.columns}
                columnsSize={this.state.columnsSize}
                suppressDragLeaveHidesColumns= {true}
                enableColResize= {true}
                onDragStopped = {this.onColumnReordered}
                onColumnResized = {this.onColumnResized}
            />;
        }
    };
}