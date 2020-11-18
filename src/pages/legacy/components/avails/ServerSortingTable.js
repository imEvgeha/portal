import React from 'react';
import {nextFrame} from '@vubiquity-nexus/portal-utils/lib/Common';

export default function withServerSorting(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.setTable = this.setTable.bind(this);
            this.onSortChanged = this.onSortChanged.bind(this);
            this.refreshSort = this.refreshSort.bind(this);

            this.state = {
                table: null,
                sort: this.props.availTabPageSort ? this.props.availTabPageSort : [],
            };
        }

        componentDidUpdate(prevProps) {
            if (prevProps.availTabPageSort !== this.props.availTabPageSort) {
                this.setState({sort: this.props.availTabPageSort});
                nextFrame(this.refreshSort);
            }
        }

        refreshSort() {
            if (!this.state.table) return;
            const sortModel = [];
            this.state.sort.map(sortCriteria => {
                sortModel.push({
                    colId: this.props.availsMapping.mappings.find(
                        ({queryParamName}) => queryParamName === sortCriteria.id
                    ).javaVariableName,
                    sort: sortCriteria.desc ? 'desc' : 'asc',
                });
            });

            const currentSortModel = this.state.table.api.getSortModel();
            let toChangeSortModel = false;

            if (currentSortModel.length !== sortModel.length) toChangeSortModel = true;

            for (let i = 0; i < sortModel.length && !toChangeSortModel; i++) {
                if (sortModel[i].colId !== currentSortModel[i].colId) toChangeSortModel = true;
                if (sortModel[i].sortCriteria !== currentSortModel[i].sortCriteria) toChangeSortModel = true;
            }

            if (toChangeSortModel) {
                this.state.table.api.setSortModel(sortModel);
            }
        }

        onSortChanged(e) {
            const sortParams = e.api.getSortModel();
            const newSort = [];
            if (sortParams.length > 0) {
                sortParams.map(criteria => {
                    const availMapping = this.props.availsMapping.mappings.find(
                        ({javaVariableName}) => javaVariableName === criteria.colId
                    );
                    newSort.push({
                        id: availMapping.sortParamName || availMapping.queryParamName,
                        desc: criteria.sort === 'desc',
                    });
                });
            }
            this.setState({sort: newSort});
            if (this.props.resultPageSort) {
                this.props.resultPageSort(newSort);
            }
        }

        setTable(element) {
            if (element) {
                this.setState({table: element});
                if (this.props.setTable) {
                    this.props.setTable(element);
                }
                nextFrame(this.refreshSort);
            }
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    defaultColDef={{...this.props.defaultColDef, sortable: true}}
                    setTable={this.setTable}
                    onSortChanged={this.onSortChanged}
                    sort={this.state.sort}
                />
            );
        }
    };
}
