import React from 'react';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import {updatePromotedRights, updatePromotedRightsFullData} from '../../stores/actions/DOP';
import {defaultSelectionColDef, SelectionTable} from '../common/SelectionTable';
import CheckBoxHeaderInternal from './elements/CheckBoxHeaderInternal';
import selectIgnoreCell from './elements/SelectIgnoreCell';
import SelectPlanTerritoryRenderer from './elements/SelectPlanTerritoryRenderer';
import SelectPlanTerritoryEditor from './elements/SelectPlanTerritoryEditor';
import withRightsResultsTable from './withRightsResultsTable';
import {CHECKBOX_HEADER, PLAN_TERRITORY_HEADER, SELECT_IGNORE_HEADER} from '../../constants/customColumnHeaders';

export default function withSelectIgnoreMark(WrappedComponent) {
    // anti-pattern: we should use composition not inheritance inside React apps
    class ComposedComponent extends SelectionTable {
        static getDerivedStateFromProps(props, state) {
            if (Array.isArray(props.columns) && props.columns.length !== state.columns.length) {
                return {
                    ...state,
                    columns: [
                        ...new Set([CHECKBOX_HEADER, SELECT_IGNORE_HEADER, PLAN_TERRITORY_HEADER, ...props.columns]),
                    ],
                };
            }
            if (!isEqual(props.columns, state.columns)) {
                return {
                    ...state,
                    columns: props.columns,
                };
            }
            return null;
        }

        constructor(props) {
            super(props);
            const {rowsProps, columns} = props;
            const updatedColumns = [CHECKBOX_HEADER, SELECT_IGNORE_HEADER, PLAN_TERRITORY_HEADER, ...columns];
            const uniqueColumnsSet = new Set(updatedColumns);
            this.state = {
                rowsProps,
                table: null,
                colDef: [],
                selected: [],
                selectAll: false,
                selectNone: true,
                columns: [...uniqueColumnsSet],
            };
        }

        // TODO - create HOC to dynamically add column (including it position inside table)
        // Bug - this method is called twice
        refreshColumns() {
            const {
                updatePromotedRights,
                updatePromotedRightsFullData,
                parseColumnsSchema,
                availsMapping,
                selectedTerritories,
                useSelectedTerritories,
            } = this.props;
            const originalColDef = parseColumnsSchema((availsMapping && availsMapping.mappings) || []);
            const colDef = {
                checkbox_sel: {
                    ...defaultSelectionColDef,
                    headerComponentFramework: CheckBoxHeaderInternal,
                    lockVisible: true,
                },
                select_ignore_sel: {
                    headerName: '',
                    field: SELECT_IGNORE_HEADER,
                    width: 200,
                    pinned: 'left',
                    resizable: false,
                    suppressSizeToFit: true,
                    suppressMovable: true,
                    lockPosition: true,
                    cellRenderer: 'selectIgnoreMarkCell',
                    sortable: false,
                    lockVisible: true,
                },
                plan_territory: {
                    headerName: 'Plan Territory',
                    field: PLAN_TERRITORY_HEADER,
                    width: 250,
                    cellRenderer: 'selectPlanTerritory',
                    cellEditorFramework: SelectPlanTerritoryEditor,
                    cellEditorParams: {
                        getPromotedRights: this.getPromotedRights,
                        getPromotedRightsFullData: this.getPromotedRightsFullData,
                        updatePromotedRights,
                        updatePromotedRightsFullData,
                        selectedTerritories,
                        useSelectedTerritories,
                    },
                    cellStyle: {height: '100%'},
                    editable: true,
                },
                ...originalColDef,
            };
            this.setState({colDef});
        }

        onSelectionChangedProcess() {
            this.registeredOnSelect = false;
            if (!this.state.table) return;

            let selected = this.state.table.api.getSelectedRows().slice(0);
            if (this.state.table.api.getDisplayedRowCount() > 0) {
                this.state.selected.map(sel => {
                    if (
                        selected.find(rec => sel.id === rec.id) === null &&
                        this.state.table.api.getRowNode(sel.id) === null
                    ) {
                        selected.push(sel);
                    }
                });
            } else {
                if (this.state.selected && this.state.selected.length > 0)
                    selected = selected.concat(this.state.selected);
            }

            const nodesToUpdate = selected
                .filter(x => !this.state.selected.includes(x))
                .concat(this.state.selected.filter(x => !selected.includes(x)))
                .map(i => this.state.table.api.getRowNode(i.id));

            this.state.table.api.redrawRows({rowNodes: nodesToUpdate});

            this.setState({
                selected: selected,
                selectNone: !this.isOneVisibleSelected(),
                selectAll: this.areAllVisibleSelected(),
            });
        }

        onDataLoaded(response) {
            const {onDataLoaded} = this.props;
            if (typeof onDataLoaded === 'function') {
                onDataLoaded(response);
            }
        }

        getPromotedRights = () => {
            return this.props.promotedRights;
        };

        getPromotedRightsFullData = () => {
            return this.props.promotedRightsFullData;
        };

        render() {
            const {colDef, columns} = this.state;
            const frameworkComponents = {
                ...this.props.frameworkComponents,
                selectIgnoreMarkCell: selectIgnoreCell,
                selectPlanTerritory: SelectPlanTerritoryRenderer,
            };

            return (
                <WrappedComponent
                    {...this.props}
                    colDef={colDef}
                    columns={columns}
                    setTable={this.setTable}
                    onDataLoaded={this.onDataLoaded}
                    rowSelection="multiple"
                    onSelectionChanged={this.onSelectionChanged}
                    suppressRowClickSelection={true}
                    onBodyScroll={this.onScroll}
                    staticDataLoaded={this.staticDataLoaded}
                    frameworkComponents={frameworkComponents}
                    singleClickEdit={true}
                />
            );
        }
    }
    ComposedComponent.propTypes = {
        ...WrappedComponent.propTypes,
    };

    ComposedComponent.defaultProps = {
        ...WrappedComponent.propTypes,
    };
    const mapStateToProps = ({dopReducer, root}) => ({
        availsMapping: root.availsMapping,
        promotedRights: dopReducer.session.promotedRights,
        promotedRightsFullData: dopReducer.session.promotedRightsFullData,
        selectedTerritories: dopReducer.session.selectedTerritories,
        useSelectedTerritories: dopReducer.session.useSelectedTerritories,
    });

    const mapDispatchToProps = dispatch => ({
        updatePromotedRights: payload => dispatch(updatePromotedRights(payload)),
        updatePromotedRightsFullData: payload => dispatch(updatePromotedRightsFullData(payload)),
    });

    return connect(mapStateToProps, mapDispatchToProps)(withRightsResultsTable(ComposedComponent));
}
