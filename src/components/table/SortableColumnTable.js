import React from 'react';
import InfiniteScrollTable from "./InfiniteScrollTable";
import connect from "react-redux/es/connect/connect";
import {dashboardResultPageSort, dashboardResultPageUpdate} from "../../actions";
import {sortAvails} from "../../containers/dashboard/ServerSideSimulationService";

const mapState = state => {
    return {
        dashboardAvailTabPage: state.dashboardAvailTabPage,
        dashboardAvailTabPageSort: state.dashboardAvailTabPageSort
    };
};

const mapActions = {
    dashboardResultPageUpdate,
    dashboardResultPageSort
};

class SortableColumnTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };

        this.fetchData = this.fetchData.bind(this);
    }

    isTimeToSort(sortProps) {
        if (this.state.loading) {
            return false
        }
        if (sortProps.length < 1) {
            return false
        }
        let sortData = sortProps[0];
        return !(this.props.dashboardAvailTabPageSort.sortBy === sortData.id && this.props.dashboardAvailTabPageSort.desc === sortData.desc);
    }

    fetchData(state, instance) {
        console.log(state);
        if (state.sortable) {
            if (this.isTimeToSort(state.sorted)) {
                this.setState({loading: true});
                let sortData = state.sorted[0];
                this.props.dashboardResultPageSort({
                    sortBy: sortData.id,
                    desc: sortData.desc
                });
                this.props.renderData(0, this.props.pageSize)
                .then(response => {
                        this.props.dashboardResultPageUpdate({
                            pages: 1,
                            avails: response.data.data,
                            pageSize: response.data.data.length,
                        });
                        this.setState({loading: false});
                    }).catch((error) => {
                    this.setState({loading: false});
                    console.log("Unexpected error");
                    console.log(error);
                });
            }
        }
    }

    render() {
        return (
            <InfiniteScrollTable
                columns={this.props.columns}
                pageSize={this.props.pageSize}
                renderData={this.props.renderData}
                fetchData={this.fetchData}
                style={this.props.style ? this.props.style : {}}
                sortLoading={this.state.loading}
            />
        );
    }
}

export default connect(mapState, mapActions)(SortableColumnTable);