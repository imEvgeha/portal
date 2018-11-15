import React from 'react';
import ReactDOM from 'react-dom';
import DragDropTable from '../../../components/table/DragDropTable';
import connect from 'react-redux/es/connect/connect';
import {dashboardService} from '../DashboardService';

import './AvailResultTable.scss';
import {resultPageUpdate, resultPageSort, resultPageSelect, resultPageLoading} from '../../../actions/dashboard';
import t from 'prop-types';
import config from 'react-global-configuration';
import moment from 'moment';
import {availDetailsModal} from './AvailDetailsModal';

const columns = [];

/**
 * Advance Search -
 * title, studio Vod Start Date, Vod End Date
 */
const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        availTabPageSort: state.dashboard.availTabPageSort,
        searchCriteria: state.dashboard.searchCriteria,
        useAdvancedSearch: state.dashboard.useAdvancedSearch,
        freeTextSearch: state.dashboard.freeTextSearch,
        availTabPageSelection: state.session.availTabPageSelection,
        availTabPageLoading: state.dashboard.availTabPageLoading,
        availsMapping: state.root.availsMapping,
    };
};

const mapDispatchToProps = {
    resultPageUpdate,
    resultPageSort,
    resultPageSelect,
    resultPageLoading
};

const scrollSliderLoadPercent = 0.5;

class AvailsResultTable extends React.Component {
    static propTypes = {
        availsMapping: t.any,
        availTabPage: t.object,
        availTabPageSort: t.array,
        searchCriteria: t.object,
        useAdvancedSearch: t.bool,
        freeTextSearch: t.object,
        availTabPageSelection: t.object,
        availTabPageLoading: t.bool,
        resultPageUpdate: t.func,
        resultPageSort: t.func,
        resultPageSelect: t.func,
        resultPageLoading: t.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            pageSize: config.get('avails.page.size'),
            requestLoading: false,
        };

        this.onLoadMoreItems = this.onLoadMoreItems.bind(this);
        this.onSortedChange = this.onSortedChange.bind(this);
        this.onSelection = this.onSelection.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.editAvail = this.editAvail.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.parseColumnsSchema = this.parseColumnsSchema.bind(this);

        if(columns.length==0){
            this.parseColumnsSchema();
        }
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        //ugly hack to change height once advanced filter finishes its transition (appearing or dissapearing)
        let elem = document.querySelector('.vu-advanced-search-panel');
        elem.addEventListener('transitionend', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        let offsetTop  = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        this.setState({ height: (window.innerHeight - offsetTop - 10) + 'px' });
    }

    parseColumnsSchema() {
        this.props.availsMapping.mappings.map(column => {
                let columnDef={};
                columnDef.accessor = column.javaVariableName;
                columnDef.Header =  <span id={`dashboard-result-table-header-${column.javaVariableName}`}>{column.displayName}</span>;
                if(column.dataType === 'date'){
                    columnDef.Cell = row => (<span>{row.value && moment(row.value).format('L')}</span>);
                }
                columns.push(columnDef);
            }
        );
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
                console.error('Unexpected error');
                console.error(error);
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
            console.error('Unexpected error');
            console.error(error);
        });
    }

    doSearch(page, pageSize, sortedParams) {
        if (this.props.useAdvancedSearch) {
            return dashboardService.advancedSearch(this.props.searchCriteria, page, pageSize, sortedParams);
        } else {
            return dashboardService.freeTextSearch(this.props.freeTextSearch, page, pageSize, sortedParams);
        }
    }

    onSelection(selected, selectAll) {
        this.props.resultPageSelect({selected, selectAll});
    }

    editAvail(newAvail) {
        let copiedAvails = this.props.availTabPage.avails.slice();
        let avail = copiedAvails.find(b => b.id === newAvail.id);
        if (avail) {
            for(let availField in newAvail) avail[availField] = newAvail[availField];
        }
        return copiedAvails;
    }

    onCellClick(row) {
        availDetailsModal.open(row, () => {
        }, () => {
        }, {onEdit: this.onEdit, availsMapping: this.props.availsMapping});
    }

    onDateEdit(availDetailModal){
        let updatedAvail = {...availDetailModal.state.avail, [editable.props.title]: editable.value};
    }

    onEdit(avail) {
        this.props.resultPageUpdate({
            pages: this.props.availTabPage.pages,
            avails: this.editAvail(avail),
            pageSize: this.props.availTabPage.pageSize,
            total: this.props.availTabPage.total
        });
    }

    render() {
        // This will force the table body to overflow and scroll, since there is not enough room
        let style = {height : this.state.height};
        
        return (
            <DragDropTable
                columns={columns}
                data={this.props.availTabPage.avails}
                pageSize={this.props.availTabPage.pageSize}
                style={style}
                scrollSliderLoadPercent={scrollSliderLoadPercent}
                loading={this.props.availTabPageLoading}
                selection={this.props.availTabPageSelection.selected}
                selectAll={this.props.availTabPageSelection.selectAll}

                sorted={this.props.availTabPageSort}

                onLoadMoreItems={this.onLoadMoreItems}
                onSortedChange={this.onSortedChange}
                onSelection={this.onSelection}
                onCellClick={this.onCellClick}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailsResultTable);