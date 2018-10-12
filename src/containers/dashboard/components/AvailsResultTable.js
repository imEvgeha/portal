import React from "react";
import InfiniteScrollTable from "../../../components/table/InfiniteScrollTable";
import connect from "react-redux/es/connect/connect";
import {dashboardService} from "../DashboardService";

import './AvailResultTable.scss'
import {dashboardResultPageUpdate, dashboardResultPageSort, dashboardResultPageSelect} from "../../../actions";

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
        dashboardAvailTabPageSelected: state.dashboardAvailTabPageSelected
    };
};

const mapActions = {
    dashboardResultPageUpdate,
    dashboardResultPageSort,
    dashboardResultPageSelect
};

class AvailsResultTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageSize: 20,
            scrollSliderLoadPercent: 0.8,
            style: {
                height: "500px" // This will force the table body to overflow and scroll, since there is not enough room
            },
            requestLoading: false,
            sortLoading: false
        };

        this.renderData = this.renderData.bind(this);
        this.onLoadMoreItems = this.onLoadMoreItems.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onSelection = this.onSelection.bind(this);
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

    onSort(sortProps) {
        if (this.isTimeToSort(sortProps)) {
            this.setState({sortLoading: false});
            let dashboardAvailTabPageSort = {
                sortBy: sortProps.id,
                desc: sortProps.desc
            };
            this.props.dashboardResultPageSort(dashboardAvailTabPageSort);

            dashboardService.getAvails(this.props.dashboardSearchCriteria, 0, this.state.pageSize, dashboardAvailTabPageSort)
                .then(response => {
                    this.props.dashboardResultPageUpdate({
                        pages: 1,
                        avails: response.data.data,
                        pageSize: response.data.data.length,
                    });
                    this.setState({sortLoading: false});
                }).catch((error) => {
                this.setState({sortLoading: false});
                console.log("Unexpected error");
                console.log(error);
            })
        }
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

    onSelection(selected) {
        this.props.dashboardResultPageSelect(selected);
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
                <InfiniteScrollTable
                    columns = {columns}
                    data = {this.props.dashboardAvailTabPage.avails}
                    pageSize = {this.props.dashboardAvailTabPage.pageSize}
                    renderData = {this.renderData}
                    style = {this.state.style}
                    scrollSliderLoadPercent = {this.state.scrollSliderLoadPercent}
                    sortLoading = {this.state.sortLoading}
                    selection = {this.props.dashboardAvailTabPageSelected}

                    onLoadMoreItems = {this.onLoadMoreItems}
                    onSort = {this.onSort}
                    onSelection = {this.onSelection}
                />
            </div>
        );
    }
}

export default connect(mapState, mapActions) (AvailsResultTable);