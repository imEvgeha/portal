import React from "react";
import InfiniteScrollTable from "../../../components/table/InfiniteScrollTable";

const columns = [
    {accessor: 'id', Header: 'id', Cell: row => (<span id={'dashboard-result-table-cell-'+row.value}>{row.value}</span>)},
    {accessor: 'brand', Header: 'brand'},
    {accessor: 'model', Header: 'model'},
    {accessor: 'vin', Header: 'vin'},
    {accessor: 'owner', Header: 'owner'}
    ];

const columnsOriginal = [
    {accessor: 'id', Header: 'ID'},
    {accessor: 'title', Header: 'title'},
    {accessor: 'studio', Header: 'studio'},
    {accessor: 'territory', Header: 'territory'},
    {accessor: 'genre', Header: 'genre'},
    {accessor: 'availStartDate', Header: 'Avail Start Date'},
    {accessor: 'availEndDate', Header: 'Avail End Date'}
];

/**
 * Advance Search -
 * title, studio Avail Start Date, Avail End Date
 */

let data;

class AvailsResultTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startPageSize: 50,
            pageIncrement: 30,
            scrollSliderLoadPercent: 0.5,
            style: {
                height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
            }
        };
        data = this.makeData();
    }

    range = len => {
        const arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        return arr;
    };

    makeData(len = 150) {
        return this.range(len).map(d => {
            return  {id: d, brand: 'Test' + d, model: 'Test', vin: 'Test', owner: 'Test'};
        });
    }

    renderData(page, startPageSize, pageSizeIncrement) {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                let from;
                let to;
                if(page === 0) {
                    from = 0;
                    to = startPageSize;
                } else {
                    from = startPageSize + (page - 1) * pageSizeIncrement;
                    to = from + pageSizeIncrement;
                }
                console.log("From: " + from + " To: " + to);
                resolve(data.slice(from, to));
            }, 2000);
        })
    }

    render() {
        return (
            <div id="dashboard-result-table">
                Search result: {this.state.startPageSize}
                <InfiniteScrollTable
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

export default AvailsResultTable;