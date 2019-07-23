import React from 'react';

export default function withServerSorting(WrappedComponent){
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.setTable = this.setTable.bind(this);
            this.onSortChanged = this.onSortChanged.bind(this);
            this.refreshSort = this.refreshSort.bind(this);

            this.state = {
                table: null,
                sort: []
            };
        }

        refreshSort(){
            if(!this.state.table) return;
            let sortModel=[];
            this.state.sort.map(sortCriteria=>{
                sortModel.push({colId:this.props.availsMapping.mappings.find(({queryParamName}) => queryParamName === sortCriteria.id).javaVariableName, sort:sortCriteria.desc ? 'desc' : 'asc'});
            });

            let currentSortModel=this.state.table.api.getSortModel();
            let toChangeSortModel=false;

            if(currentSortModel.length !== sortModel.length) toChangeSortModel=true;

            for(let i=0; i < sortModel.length && !toChangeSortModel; i++){
                if(sortModel[i].colId !== currentSortModel[i].colId) toChangeSortModel = true;
                if(sortModel[i].sortCriteria !== currentSortModel[i].sortCriteria) toChangeSortModel = true;
            }

            if(toChangeSortModel){
                this.state.table.api.setSortModel(sortModel);
            }
        }

        onSortChanged(e) {
            let sortParams = e.api.getSortModel();
            let newSort = [];
            if(sortParams.length > 0){
                sortParams.map(criteria =>{
                    newSort.push({id : this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === criteria.colId).queryParamName , desc: criteria.sort === 'desc'});
                });
            }
            this.setState({sort:newSort});
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
                enableSorting={true}
                enableServerSideSorting={true}
                onSortChanged={this.onSortChanged}
                sort={this.state.sort}
            />;
        }
    };
}