import React from 'react';
import config from 'react-global-configuration';

import RightsResultsTable from './RightsResultsTable';
import {nextFrame} from '../../util/Common';

export const AVAILS_SELECTION = 'AVAILS_SELECTION';
export const DOP_SELECTION = 'DOP_SELECTION';

const withLocalRights = (selectedType) => WrappedComponent => {

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
                originalData: this.getSelectedRights().slice(0),
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
            if (prevProps.colDef !== this.props.colDef || prevProps.cols !== this.props.cols || prevProps.columns !== this.props.columns) {
                let newColDef = {...this.props.colDef, ...this.state.originalColDef};
                this.refreshColumns(newColDef);
            }

            if (prevProps.hidden !== this.props.hidden && !this.props.hidden && selectedType === AVAILS_SELECTION) {
                this.setState({originalData: this.getSelectedRights().slice(0)});
                nextFrame(this.selectAll);
            }
        }

        getSelectedRights = () => {
            let selectedRights = this.props.availTabPageSelection.selected;
            if (selectedType === DOP_SELECTION) {
                selectedRights = this.props.promotedRightsFullData;
            }

            return selectedRights;
        };

        selectAll() {
            if (!this.state.table) return;
            this.state.table.api.deselectAll();
            this.state.table.api.forEachNode(rowNode => {
                if (rowNode.data && this.getSelectedRights().filter(sel => (sel.id === rowNode.data.id)).length > 0) {
                    rowNode.setSelected(true);
                }
            });
        }

        setTable(element) {
            if (element) {
                element.api.showLoadingOverlay();
                this.setState({table: element});
                if (this.props.setTable) {
                    this.props.setTable(element);
                }
            }
        }

        render() {
            return <WrappedComponent
                {...this.props}
                {...this.state.rowsProps}
                colDef={this.state.cols}
                setTable={this.setTable}
                getRowNodeId={data => data.id}
                rowData={this.state.originalData}
            />;
        }
    }

    return LocalRightsResultsTable;
};

export default withLocalRights;