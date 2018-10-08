import React from "react";
import SortableColumnTable from "../../../components/table/SortableColumnTable";
import {getAvails} from "../ServerSideSimulationService";
import connect from "react-redux/es/connect/connect";

const columns = [
    {accessor: 'id', Header: 'ID', Cell: row => (<span id={'dashboard-result-table-cell-'+row.value}>{row.value}</span>)},
    {accessor: 'title', Header: 'Title'},
    {accessor: 'studio', Header: 'Studio'},
    {accessor: 'territory', Header: 'Territory'},
    {accessor: 'genre', Header: 'Genre'},
    {accessor: 'availStartDate', Header: 'Avail Start Date'},
    {accessor: 'availEndDate', Header: 'Avail End Date'}
];

/**
 * Advance Search -
 * title, studio Avail Start Date, Avail End Date
 */
const mapState = state => {
    return {
        dashboardAvailTabPage: state.dashboardAvailTabPage,
        dashboardAvailTabPageSort: state.dashboardAvailTabPageSort
    };
};

class AvailsResultTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startPageSize: 50,
            pageIncrement: 30,
            scrollSliderLoadPercent: 0.5,
            style: {
                height: "500px" // This will force the table body to overflow and scroll, since there is not enough room
            }
        };

        this.renderData = this.renderData.bind(this);
    }

    renderData(page, startPageSize, pageSizeIncrement) {
        return getAvails(page, startPageSize, pageSizeIncrement, this.props.dashboardAvailTabPageSort);
    }

    render() {
        return (
            <div id="dashboard-result-table">
                <span className={'nx-container-margin'} id={'dashboard-result-number'}>
                    Results: {this.props.dashboardAvailTabPage.pageSize}
                </span>
                <SortableColumnTable
                    columns = {columns}
                    startPageSize = {this.state.startPageSize}
                    pageIncrement = {this.state.pageIncrement}
                    renderData = {this.renderData}
                    style = {this.state.style}
                    scrollSliderLoadPercent = {this.state.scrollSliderLoadPercent}
                />
            </div>
        );
    }
}

export default connect(mapState)(AvailsResultTable);