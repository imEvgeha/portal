import React from 'react';
import {connect} from 'react-redux';
import {updatePromotedRights} from '../../stores/actions/DOP';
import {defaultSelectionColDef, SelectionTable} from '../common/SelectionTable';
import CheckBoxHeaderInternal from './elements/CheckBoxHeaderInternal';
import selectIgnoreCell from './elements/SelectIgnoreCell';
import SelectPlanTerritoryRenderer from './elements/SelectPlanTerritoryRenderer';
import SelectPlanTerritoryEditor from './elements/SelectPlanTerritoryEditor';

export default function withSelectIgnoreMark(WrappedComponent) {
    // anti-pattern: we should use composition not inheritance inside React apps
    class ComposedComponent extends SelectionTable {
        static propTypes = {
            ...WrappedComponent.propTypes,
        }

        static defaultProps = {
            ...WrappedComponent.propTypes,
        }

        constructor(props) {
            super(props);
            const {rowsProps, availTabPageSelection, columns} = props;
            const updatedColumns = ['checkbox_sel', 'select_ignore_sel', 'plan_territory', ...columns];
            const uniqueColumnsSet = new Set(updatedColumns);
            this.state = {
                rowsProps,
                table: null,
                colDef: [],
                selected: availTabPageSelection.selected || [],
                selectAll: availTabPageSelection.selectAll,
                selectNone: availTabPageSelection.selectNone || true,
                columns: [...uniqueColumnsSet],
            };
        }

        // TODO - create HOC to dynamically add column (including it position inside table) 
        // Bug - this method is called twice 
        refreshColumns() {
            const {updatePromotedRights} = this.props;
            const colDef = {
                checkbox_sel: {...defaultSelectionColDef, headerComponentFramework: CheckBoxHeaderInternal},
                select_ignore_sel: {
                    headerName: '',
                    width: 200,
                    pinned: 'left',
                    suppressResize: true,
                    suppressSizeToFit: true,
                    suppressMovable: true,
                    lockPosition: true,
                    cellRenderer: 'selectIgnoreMarkCell',
                    suppressSorting: true
                },
                plan_territory: {
                    headerName: 'Plan Territory',
                    field: 'plan_territory',
                    pinned: 'left',
                    width: 200,
                    cellRenderer: 'selectPlanTerritory',
                    cellEditorFramework: SelectPlanTerritoryEditor,
                    cellEditorParams: {
                        getPromotedRights: this.getPromotedRights,
                        updatePromotedRights,
                    },
                    editable: true,
                },
            };
            this.setState({colDef});
        }

        onDataLoaded(response) {
            const {onDataLoaded} = this.props;
            if (typeof onDataLoaded === 'function') {
                onDataLoaded(response);
            }
        }

        getPromotedRights = () => {
            return this.props.promotedRights;
        }

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
                    suppressRowClickSelection={true}
                    onBodyScroll={this.onScroll}
                    staticDataLoaded={this.staticDataLoaded}
                    frameworkComponents={frameworkComponents}
                    singleClickEdit={true}
                />
            );
        }
    }

    const mapStateToProps = ({dopReducer}) => ({
        promotedRights: dopReducer.session.promotedRights,
    });

    const mapDispatchToProps = (dispatch) => ({
        updatePromotedRights: payload => dispatch(updatePromotedRights(payload)),
    });

    return connect(mapStateToProps, mapDispatchToProps)(ComposedComponent);
}
