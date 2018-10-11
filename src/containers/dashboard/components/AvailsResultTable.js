import React from "react";
import SortableColumnTable from "../../../components/table/SortableColumnTable";
import connect from "react-redux/es/connect/connect";
import {dashboardService} from "../DashboardService";

import './AvailResultTable.scss'

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

class AvailsResultTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageSize: 20,
            scrollSliderLoadPercent: 0.5,
            style: {
                height: "500px" // This will force the table body to overflow and scroll, since there is not enough room
            }
        };

        this.renderData = this.renderData.bind(this);
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
                />
            </div>
        );
    }
}

export default connect(mapState)(AvailsResultTable);