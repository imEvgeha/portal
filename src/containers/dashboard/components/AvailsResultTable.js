import React from "react";
import SortableColumnTable from "../../../components/table/SortableColumnTable";
import {getAvails} from "../ServerSideSimulationService";
import connect from "react-redux/es/connect/connect";
import {dashboardService} from "../DashboardService";
import {confirmModal} from "../../../components/share/ConfirmModal"

const columns = [
    {accessor: 'id', Header: <span id={'dashboard-result-table-header-id'}>ID</span>, Cell: row => (<span id={'dashboard-result-table-cell-'+row.value}>{row.value}</span>)},
    {accessor: 'title', Header: <span id={'dashboard-result-table-header-title'}>Title</span>},
    {accessor: 'studio', Header: <span id={'dashboard-result-table-header-studio'}>Studio</span>},
    {accessor: 'territory', Header: <span id={'dashboard-result-table-header-territory'}>Territory</span>},
    {accessor: 'genre', Header: <span id={'dashboard-result-table-header-genre'}>Genre</span>},
    {accessor: 'availStartDate', Header: <span id={'dashboard-result-table-header-avail-start-date'}>Avail Start Date</span>},
    {accessor: 'availEndDate', Header: <span id={'dashboard-result-table-header-avail-end-date'}>Avail End Date</span>}
];

/**
 * Advance Search -
 * title, studio Avail Start Date, Avail End Date
 */
const mapState = state => {
    return {
        dashboardAvailTabPage: state.dashboardAvailTabPage,
        dashboardAvailTabPageSort: state.dashboardAvailTabPageSort,
        dashboardResultPageSelected: state.dashboardAvailTabPageSelected
    };
};

class AvailsResultTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageSize: 50,
            scrollSliderLoadPercent: 0.5,
            style: {
                height: "500px" // This will force the table body to overflow and scroll, since there is not enough room
            }
        };

        this.renderData = this.renderData.bind(this);
    }

    renderData(page, pageSize) {
        // return dashboardService.getAvails(page, pageSize, this.props.dashboardAvailTabPageSort);
        return getAvails(page, pageSize, this.props.dashboardAvailTabPageSort);
    }

    exportAvails = () => {
        confirmModal.open("Confirm export",
            () => {},
            () => {},
            {description: `You have select ${this.props.dashboardResultPageSelected.length} avails.`});
    };

    render() {
        return (
            <div id="dashboard-result-table">
                <span className={'nx-container-margin'} id={'dashboard-result-number'}>
                    Results: {this.props.dashboardAvailTabPage.pageSize}
                </span>
                <span className={'nx-container-margin'} id={'dashboard-result-number'}>
                    Selected items: {this.props.dashboardResultPageSelected.length}
                </span>
                <button className="btn btn-primary " onClick={this.exportAvails}>Export</button>
                <SortableColumnTable
                    columns = {columns}
                    pageSize = {this.state.pageSize}
                    renderData = {this.renderData}
                    style = {this.state.style}
                    scrollSliderLoadPercent = {this.state.scrollSliderLoadPercent}
                    selection={this.state.selection}
                    setSelection={this.setSelection}
                />
            </div>
        );
    }
}

export default connect(mapState)(AvailsResultTable);