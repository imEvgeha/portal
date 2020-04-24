import './DashboardContainer.scss';

import React from 'react';
import {connect} from 'react-redux';
import FreeTextSearch from './components/FreeTextSearch';
import AdvancedSearchPanel from './components/AdvancedSearchPanel';
import {
    searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    resultPageSelect,
    searchFormShowSearchResults,
    searchFormShowAdvancedSearch,
    searchFormSetAdvancedSearchCriteria
} from '../../../stores/actions/metadata/index';
import DashboardTab from './DashboardTab';
import t from 'prop-types';
import {titleSearchHelper} from '../dashboard/TitleSearchHelper';
import moment from 'moment';
import {configService} from '../service/ConfigService';
import TitleResultTable from './components/table/TitleResultTable';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        selected: state.titleReducer.session.titleTabPageSelection.selected,
        showAdvancedSearch: state.titleReducer.session.showAdvancedSearch,
        showSearchResults: state.titleReducer.session.showSearchResults,
        searchCriteria: state.titleReducer.session.advancedSearchCriteria,
        useAdvancedSearch: state.titleReducer.session.useAdvancedSearch,
    };
};

const mapDispatchToProps = {
    searchFormUseAdvancedSearch,
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    resultPageSelect,
    searchFormShowAdvancedSearch,
    searchFormShowSearchResults,
    searchFormSetAdvancedSearchCriteria
};

class DashboardContainer extends React.Component {
    fromHistory = false;

    constructor(props) {
        super(props);
        this.state = {};
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.handleTitleFreeTextSearch = this.handleTitleFreeTextSearch.bind(this);
        this.handleTitleAdvancedSearch = this.handleTitleAdvancedSearch.bind(this);
        this.handleBackToDashboard = this.handleBackToDashboard.bind(this);
        this.cleanSelection = this.cleanSelection.bind(this);
    }

    componentDidMount() {
        configService.initConfigMapping();
        
        if (this.props.location && this.props.location.state) {
            const state = this.props.location.state;
            if (state.titleHistory) {
                const subTitle = state.titleHistory.ingestType + ', ' + (state.titleHistory.provider ? state.titleHistory.provider + ', ' : '') + moment(state.titleHistory.received).format('llll');
                const criteria = {titleHistoryIds: {value: state.titleHistory.id, subTitle}};
                if (state.rowInvalid !== undefined) {
                    criteria.rowInvalid = {value: state.rowInvalid};
                }
                this.props.searchFormShowAdvancedSearch(true);
                this.props.searchFormSetAdvancedSearchCriteria(criteria);
                this.handleTitleAdvancedSearch(criteria);
                this.fromHistory = true;
            } else if (state.back) {
                this.handleBackToDashboard();
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchCriteria.titleHistoryIds && this.props.showSearchResults && this.props.useAdvancedSearch && !this.fromHistory) {
            this.fromHistory = true;
        }
    }

    handleBackToDashboard() {
        this.props.searchFormShowAdvancedSearch(false);
        this.props.searchFormShowSearchResults(false);
    }

    toggleAdvancedSearch() {
        this.props.searchFormShowAdvancedSearch(!this.props.showAdvancedSearch);
    }

    handleTitleFreeTextSearch(searchCriteria) {
        // this.props.searchFormUseAdvancedSearch(false);
        this.props.searchFormShowSearchResults(true);
        titleSearchHelper.freeTextSearch(searchCriteria);
        this.cleanSelection();
    }

    handleTitleAdvancedSearch(searchCriteria) {
        this.props.searchFormUseAdvancedSearch(true);
        this.props.searchFormShowSearchResults(true);
        titleSearchHelper.advancedSearch(searchCriteria);
        this.cleanSelection();
    }

    cleanSelection() {
        const titleTabPageSelection = {
            selected: this.props.selected,
            selectAll: false
        };
        this.props.resultPageSelect(titleTabPageSelection);
    }

    render() {
        return (
            <div>
                <div className={'container-fluid vu-free-text-search ' + (this.props.showAdvancedSearch ? 'hide': '')}>
                    <div>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch
                                            disabled={this.props.showAdvancedSearch}
                                            containerId="dashboard-title"
                                            onSearch={this.handleTitleFreeTextSearch}
                                        />
                                    </td>
                                    <td style={{width: '20px', height: '30px', paddingLeft: '8px'}}>
                                        <button
                                            className="btn btn-outline-secondary advanced-search-btn"
                                            style={{height: '40px'}}
                                            title="Advanced search"
                                            id="dashboard-title-advanced-search-btn"
                                            onClick={this.toggleAdvancedSearch}
                                        >
                                            <i className="fas fa-filter table-top-icon" style={{fontSize: '1.25em', marginLeft: '-3px', marginTop: '6px', padding: '0px'}}> </i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <AdvancedSearchPanel hide={!this.props.showAdvancedSearch} onSearch={this.handleTitleAdvancedSearch} onToggleAdvancedSearch={this.toggleAdvancedSearch} />
                <DashboardTab />
                <div id="dashboard-result-table">
                    <div className="container-fluid">
                        Title Records
                        <TitleResultTable />
                    </div>
                </div>
            </div>
        );
    }
}

DashboardContainer.propTypes = {
    searchCriteria: t.any,
    searchFormUseAdvancedSearch: t.func,
    resultPageSelect: t.func,
    searchFormShowAdvancedSearch: t.func,
    searchFormShowSearchResults: t.func,
    searchFormSetAdvancedSearchCriteria: t.func,
    selected: t.array,
    showAdvancedSearch: t.bool,
    showSearchResults: t.bool,
    useAdvancedSearch: t.bool,
    location: t.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);