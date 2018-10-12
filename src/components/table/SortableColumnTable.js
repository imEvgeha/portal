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

                onLoadMoreItems={this.props.onLoadMoreItems}
            />
        );
    }
}

export default connect(mapState, mapActions)(SortableColumnTable);