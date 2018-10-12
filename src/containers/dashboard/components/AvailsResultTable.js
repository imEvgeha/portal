import React from "react";
import SortableColumnTable from "../../../components/table/SortableColumnTable";
import connect from "react-redux/es/connect/connect";
import {dashboardService} from "../DashboardService";

import './AvailResultTable.scss'
import {dashboardResultPageUpdate} from "../../../actions";

const columns = [
    {accessor: 'id', Header: <span id={'dashboard-result-table-header-id'}>ID</span>, Cell: row => (<span id={'dashboard-result-table-cell-'+row.value}>{row.value}</span>)},
    {accessor: 'title', Header: <span id={'dashboard-result-table-header-title'}>Title</span>},
    {accessor: 'studio', Header: <span id={'dashboard-result-table-header-studio'}>Studio</span>},
    {accessor: 'territory', Header: <span id={'dashboard-result-table-header-territory'}>Territory</span>},
    {accessor: 'genre', Header: <span id={'dashboard-result-table-header-genre'}>Genre</span>},
    {accessor: 'availStart', Header: <span id={'dashboard-result-table-header-avail-start-date'}>Avail Start Date</span>},
    {accessor: 'availEnd', Header: <span id={'dashboard-result-table-header-avail-end-date'}>Avail End Date</span>}
];

/**
 * Advance Search -
 * title, studio Avail Start Date, Avail End Date
 */
const mapState = state => {
    return {
        dashboardAvailTabPage: state.dashboardAvailTabPage,
        dashboardAvailTabPageSort: state.dashboardAvailTabPageSort,
        dashboardSearchCriteria: state.dashboardSearchCriteria,
    };
};

const mapActions = {
    dashboardResultPageUpdate
};

class AvailsResultTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageSize: 20,
            scrollSliderLoadPercent: 0.5,
            style: {
                height: "500px" // This will force the table body to overflow and scroll, since there is not enough room
            },
            requestLoading: false
        };

        this.renderData = this.renderData.bind(this);
        this.onLoadMoreItems = this.onLoadMoreItems.bind(this);
    }

    onLoadMoreItems() {
        if(!this.state.requestLoading) {
            this.setState({requestLoading: true});
            dashboardService.getAvails(this.props.dashboardSearchCriteria, this.props.dashboardAvailTabPage.pages, this.state.pageSize, this.props.dashboardAvailTabPageSort)
                .then(response => {
                    console.log(response);
                    this.addLoadedItems(response.data.data);
                    this.setState({requestLoading: false});
                }).catch((error) => {
                this.setState({requestLoading: false});
                console.log("Unexpected error");
                console.log(error);
            });
        }
    }

    addLoadedItems(items) {
        if (items.length > 0) {
            this.props.dashboardResultPageUpdate({
                pages: this.props.dashboardAvailTabPage.pages + 1,
                avails: this.props.dashboardAvailTabPage.avails.concat(items),
                pageSize: this.props.dashboardAvailTabPage.pageSize + items.length,
            });
        }
    }

    renderData(page, pageSize) {
        return dashboardService.getAvails(this.props.dashboardSearchCriteria, page, pageSize, this.props.dashboardAvailTabPageSort);
    }

    render() {
        return (
            <div id="dashboard-result-table">
                <div className="row justify-content-between">
                    <span className="col-4 nx-container-margin" id={'dashboard-result-number'} style={{paddingTop: '10px'}}>
                        Results: {this.props.dashboardAvailTabPage.pageSize}
                    </span>
                    <div className="col-1">
                        <i className={'fas fa-filter table-top-icon'}> </i>
                        <i className={'fas fa-th table-top-icon'}> </i>
                        <i className={'fas fa-download table-top-icon'}> </i>
                    </div>
                </div>
                <SortableColumnTable
                    columns = {columns}
                    pageSize = {this.state.pageSize}
                    renderData = {this.renderData}
                    style = {this.state.style}
                    scrollSliderLoadPercent = {this.state.scrollSliderLoadPercent}

                    onLoadMoreItems={this.onLoadMoreItems}
                />
            </div>
        );
    }
}

export default connect(mapState, mapActions) (AvailsResultTable);