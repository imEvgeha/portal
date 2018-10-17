import React from "react";
import InfiniteScrollTable from "../../../components/table/InfiniteScrollTable";
import connect from "react-redux/es/connect/connect";
import {dashboardService} from "../DashboardService";
import {confirmModal} from "../../../components/share/ConfirmModal"

import './AvailResultTable.scss'
import {dashboardResultPageUpdate, dashboardResultPageSort, dashboardResultPageSelect, dashboardResultPageLoading} from "../../../actions";

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
        dashboardAvailTabPageSelected: state.dashboardAvailTabPageSelected,
        dashboardAvailTabPageLoading: state.dashboardAvailTabPageLoading
    };
};

const mapActions = {
    dashboardResultPageUpdate,
    dashboardResultPageSort,
    dashboardResultPageSelect,
    dashboardResultPageLoading
};

const scrollSliderLoadPercent = 0.5;
const style= {
    height: "500px" // This will force the table body to overflow and scroll, since there is not enough room
};

class AvailsResultTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageSize: 20,
            requestLoading: false,
        };

        this.onLoadMoreItems = this.onLoadMoreItems.bind(this);
        this.onSortedChange = this.onSortedChange.bind(this);
        this.onSelection = this.onSelection.bind(this);
    }

    onLoadMoreItems() {
        if(!this.state.requestLoading && this.props.dashboardAvailTabPage.avails.length < this.props.dashboardAvailTabPage.total) {
            this.setState({requestLoading: true});
            dashboardService.getAvails(this.props.dashboardSearchCriteria, this.props.dashboardAvailTabPage.pages, this.state.pageSize, this.props.dashboardAvailTabPageSort[0])
                .then(response => {
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

    onSortedChange(newSorted, column, shiftKey) {
        this.props.dashboardResultPageSort(newSorted);
        this.sortData(newSorted);
    }

    sortData(sortProps) {
        this.props.dashboardResultPageLoading(true);
        let sortData = sortProps[0];
        let sortParams = {
            sortBy: sortData.id,
            desc: sortData.desc
        };
        dashboardService.getAvails(this.props.dashboardSearchCriteria, 0, this.state.pageSize, sortParams)
            .then(response => {
                this.props.dashboardResultPageUpdate({
                    pages: 1,
                    avails: response.data.data,
                    pageSize: response.data.data.length,
                });
                this.props.dashboardResultPageLoading(false);
            }).catch((error) => {
            this.props.dashboardResultPageLoading(false);
            console.log("Unexpected error");
            console.log(error);
        })
    }

    onSelection(selected) {
        this.props.dashboardResultPageSelect(selected);
    }

    exportAvails = () => {
        confirmModal.open("Confirm export",
            () => {},
            () => {},
            {description: `You have select ${this.props.dashboardAvailTabPageSelected.length} avails.`});
    };

    render() {
        return (
            <div id="dashboard-result-table">
                <div className={'container-fluid'}>
                    <div className="row justify-content-between">
                        <div className="col-4 align-bottom">
                            <span className="table-top-text" id={'dashboard-result-number'} style={{paddingTop: '10px'}}>
                                Results: {this.props.dashboardAvailTabPage.total}
                            </span>
                            <span className={'nx-container-margin table-top-text'} id={'dashboard-result-number'}>
                                Selected items: {this.props.dashboardAvailTabPageSelected.length}
                            </span>
                        </div>
                        <div className="col-2">
                            <i className={'fas fa-download table-top-icon float-right'}  onClick={this.exportAvails}> </i>
                            <i className={'fas fa-th table-top-icon float-right'}> </i>
                            <i className={'fas fa-filter table-top-icon float-right'}> </i>
                        </div>
                    </div>
                </div>
                <InfiniteScrollTable
                    columns = {columns}
                    data = {this.props.dashboardAvailTabPage.avails}
                    pageSize = {this.props.dashboardAvailTabPage.pageSize}
                    style = {style}
                    scrollSliderLoadPercent = {scrollSliderLoadPercent}
                    loading = {this.props.dashboardAvailTabPageLoading}
                    selection = {this.props.dashboardAvailTabPageSelected}

                    sorted={this.props.dashboardAvailTabPageSort}

                    onLoadMoreItems = {this.onLoadMoreItems}
                    onSortedChange = {this.onSortedChange}
                    onSelection = {this.onSelection}
                />
            </div>
        );
    }
}

export default connect(mapState, mapActions) (AvailsResultTable);