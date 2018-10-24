import React from 'react';
import InfiniteScrollTable from '../../../components/table/InfiniteScrollTable';
import connect from 'react-redux/es/connect/connect';
import {dashboardService} from '../DashboardService';

import './AvailResultTable.scss';
import {resultPageUpdate, resultPageSort, resultPageSelect, resultPageLoading} from '../../../actions/dashboard';
import t from 'prop-types';
import {confirmModal} from '../../../components/share/ConfirmModal';

const columns = [
    {
        accessor: 'id',
        Header: <span id={'dashboard-result-table-header-id'}>ID</span>,
        Cell: row => (<span id={'dashboard-result-table-cell-' + row.value}>{row.value}</span>)
    },
    {accessor: 'title', Header: <span id={'dashboard-result-table-header-title'}>Title</span>},
    {accessor: 'studio', Header: <span id={'dashboard-result-table-header-studio'}>Studio</span>},
    {accessor: 'territory', Header: <span id={'dashboard-result-table-header-territory'}>Territory</span>},
    {accessor: 'genre', Header: <span id={'dashboard-result-table-header-genre'}>Genre</span>},
    {accessor: 'availStart', Header: <span id={'dashboard-result-table-header-avail-start-date'}>VOD Start</span>},
    {accessor: 'availEnd', Header: <span id={'dashboard-result-table-header-avail-end-date'}>VOD End</span>}
];

/**
 * Advance Search -
 * title, studio Avail Start Date, Avail End Date
 */
const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        availTabPageSort: state.dashboard.availTabPageSort,
        searchCriteria: state.dashboard.searchCriteria,
        useAdvancedSearch: state.dashboard.useAdvancedSearch,
        freeTextSearch: state.dashboard.freeTextSearch,
        availTabPageSelected: state.dashboard.availTabPageSelected,
        availTabPageLoading: state.dashboard.availTabPageLoading
    };
};

const mapDispatchToProps = {
    resultPageUpdate,
    resultPageSort,
    resultPageSelect,
    resultPageLoading
};

const scrollSliderLoadPercent = 0.5;
const style = {
    height: '500px' // This will force the table body to overflow and scroll, since there is not enough room
};

class AvailsResultTable extends React.Component {
    static propTypes = {
        availTabPage: t.object,
        availTabPageSort: t.array,
        searchCriteria: t.object,
        useAdvancedSearch: t.bool,
        freeTextSearch: t.object,
        availTabPageSelected: t.array,
        availTabPageLoading: t.bool,
        resultPageUpdate: t.func,
        resultPageSort: t.func,
        resultPageSelect: t.func,
        resultPageLoading: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            pageSize: 20,
            requestLoading: false,
        };

        this.onLoadMoreItems = this.onLoadMoreItems.bind(this);
        this.onSortedChange = this.onSortedChange.bind(this);
        this.onSelection = this.onSelection.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.editAvail = this.editAvail.bind(this);
    }

    onLoadMoreItems() {
        if (!this.state.requestLoading && this.props.availTabPage.avails.length < this.props.availTabPage.total) {
            this.setState({requestLoading: true});
            this.doSearch(this.props.availTabPage.pages, this.state.pageSize, this.props.availTabPageSort)
            .then(response => {
                this.addLoadedItems(response.data);
                this.setState({requestLoading: false});
            }).catch((error) => {
                this.setState({requestLoading: false});
                console.log('Unexpected error');
                console.log(error);
            });
        }
    }

    addLoadedItems(data) {
        let items = data.data;
        if (items.length > 0) {
            this.props.resultPageUpdate({
                pages: this.props.availTabPage.pages + 1,
                avails: this.props.availTabPage.avails.concat(items),
                pageSize: this.props.availTabPage.pageSize + items.length,
                total: data.total
            });
        }
    }

    onSortedChange(newSorted) {
        this.props.resultPageSort(newSorted);
        this.sortData(newSorted);
    }

    sortData(sortProps) {
        this.props.resultPageLoading(true);
        this.doSearch(0, this.state.pageSize, sortProps)
            .then(response => {
                this.props.resultPageUpdate({
                    pages: 1,
                    avails: response.data.data,
                    pageSize: response.data.data.length,
                    total: response.data.total
                });
                this.props.resultPageLoading(false);
            }).catch((error) => {
            this.props.resultPageLoading(false);
            console.log('Unexpected error');
            console.log(error);
        });
    }

    doSearch(page, pageSize, sortedParams) {
        if (this.props.useAdvancedSearch) {
            return dashboardService.advancedSearch(this.props.searchCriteria, page, pageSize, sortedParams);
        } else {
            return dashboardService.freeTextSearch(this.props.freeTextSearch, page, pageSize, sortedParams);
        }
    }

    onSelection(selected) {
        this.props.resultPageSelect(selected);
    }

    editAvail(newAvail) {
        let copiedAvails = this.props.availTabPage.avails.slice();
        let avail = copiedAvails.find(b => b.id === newAvail.id);
        if (avail) {
            for(let availField in newAvail) avail[availField] = newAvail[availField];
        }
        return copiedAvails;
    }

    onEdit(editable, availDetailModal) {
        let updatedAvail = {...availDetailModal.state.avail, [editable.props.title]: editable.value};
        dashboardService.updateAvails(updatedAvail)
            .then(res => {
                availDetailModal.setState({
                    avail: res,
                    errorMessage: ''
                });
                this.props.resultPageUpdate({
                    pages: this.props.availTabPage.pages,
                    avails: this.editAvail(res),
                    pageSize: this.props.availTabPage.pageSize,
                    total: this.props.availTabPage.total
                });
            })
            .catch(() => {
                editable.setState({availLastEditSucceed: false});
                availDetailModal.setState({
                    errorMessage: 'Avail edit failed'
                });
                editable.value = availDetailModal.state.avail[editable.props.title];
                editable.newValue = availDetailModal.state.avail[editable.props.title];
            });
    }

    render() {
        return (
            <InfiniteScrollTable
                columns={columns}
                data={this.props.availTabPage.avails}
                pageSize={this.props.availTabPage.pageSize}
                style={style}
                scrollSliderLoadPercent={scrollSliderLoadPercent}
                loading={this.props.availTabPageLoading}
                selection={this.props.availTabPageSelected}

                sorted={this.props.availTabPageSort}

                onLoadMoreItems={this.onLoadMoreItems}
                onSortedChange={this.onSortedChange}
                onSelection={this.onSelection}
                onEdit={this.onEdit}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailsResultTable);