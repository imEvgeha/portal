import React from 'react';
import {isEqual} from 'lodash';

export default function withColumnsReorder(WrappedComponent) {
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
                columnsSize: {},
            };
        }

        componentDidMount() {
            if (this.props.availsMapping) {
                this.refreshColumns();
            }
        }

        componentDidUpdate(prevProps) {
            const {availsMapping, columnsOrder} = this.props;
            if (Array.isArray(prevProps.availsMapping) && !isEqual(prevProps.availsMapping, availsMapping)) {
                this.refreshColumns();
            }

            if (Array.isArray(prevProps.columnsOrder) && !isEqual(prevProps.columnsOrder, columnsOrder)) {
                this.setState({columns: columnsOrder});
            }
        }

        onColumnReordered(e) {
            const {updateColumnsOrder} = this.props;
            const columns = [];
            e.columnApi.getAllGridColumns().forEach(({colDef}) => {
                if (colDef && colDef.field) {
                    columns.push(colDef.field);
                }
            });
            this.setState({columns});
            if (typeof updateColumnsOrder === 'function') {
                updateColumnsOrder(columns);
            }
        }

        onColumnResized(e) {
            if (e.finished) {
                this.setState({
                    columnsSize: {...this.state.columnsSize, [e.column.colDef.field]: e.column.actualWidth},
                });
            }
        }

        refreshColumns() {
            const {columnsOrder, availsMapping, updateColumnsOrder} = this.props;
            if (!columnsOrder) {
                const columns = availsMapping.mappings
                    .filter(({dataType}) => dataType)
                    .map(({javaVariableName}) => javaVariableName);
                this.setState({columns});
                if (updateColumnsOrder) {
                    updateColumnsOrder(columns);
                }
            }
        }

        setTable(element) {
            if (element) {
                this.setState({table: element});
                if (this.props.setTable) {
                    this.props.setTable(element);
                }
            }
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    defaultColDef={{...this.props.defaultColDef, resizable: true}}
                    setTable={this.setTable}
                    columns={this.state.columns}
                    columnsSize={this.state.columnsSize}
                    suppressDragLeaveHidesColumns={true}
                    onDragStopped={this.onColumnReordered}
                    onColumnResized={this.onColumnResized}
                />
            );
        }
    };
}
