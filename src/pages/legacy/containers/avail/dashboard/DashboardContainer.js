import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './DashboardContainer.scss';
import FreeTextSearch from './components/FreeTextSearch';
import AdvancedSearchPanel from './components/AdvancedSearchPanel';
import {
    searchFormShowSearchResults,
    searchFormShowAdvancedSearch,
    searchFormSetAdvancedSearchCriteria,
    resultPageShowSelected,
    searchFormUpdateTextSearch,
} from '../../../stores/actions/avail/dashboard';
import DashboardTab from './DashboardTab';
import SearchResultsTab from './SearchResultsTab';
import {profileService} from '../service/ProfileService';
import {rightSearchHelper} from './RightSearchHelper';
import {configurationService} from '../service/ConfigurationService';
import {isObjectEmpty} from '@vubiquity-nexus/portal-utils/lib/Common';
import RightsURL from '../util/RightsURL';

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        showAdvancedSearch: state.dashboard.session.showAdvancedSearch,
        showSearchResults: state.dashboard.session.showSearchResults,
        searchCriteria: state.dashboard.session.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    searchFormShowAdvancedSearch,
    searchFormShowSearchResults,
    searchFormSetAdvancedSearchCriteria,
    resultPageShowSelected,
    searchFormUpdateTextSearch,
};

class DashboardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.handleAvailsFreeTextSearch = this.handleAvailsFreeTextSearch.bind(this);
        this.handleAvailsAdvancedSearch = this.handleAvailsAdvancedSearch.bind(this);
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        configurationService.initConfiguration();

        this.getSearchCriteriaFromURL();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.availsMapping !== this.props.availsMapping) {
            this.getSearchCriteriaFromURL();
        }
    }

    getSearchCriteriaFromURL() {
        if (this.props.location && this.props.location.search) {
            const sparams = new URLSearchParams(this.props.location.search);
            const dest = sparams.get('back');
            if (dest) {
                if (['manual-rights-entry', 'fix-errors'].includes(dest)) {
                    sparams.delete('back');
                    const availHistoryId = sparams.get('availHistoryId');
                    sparams.delete('availHistoryId');
                    this.props.searchFormShowSearchResults(false);
                    this.context.router.history.push(
                        '/avails/history/' + availHistoryId + '/' + dest + '?' + sparams.toString()
                    );
                }
                return;
            }
        }

        if (!this.props.availsMapping) {
            return;
        }

        if (this.props.match.path === RightsURL.availsDashboardUrl) {
            this.props.searchFormShowSearchResults(false);
        } else {
            const params = RightsURL.URLtoArray(this.props.location.search, this.props.match.params);
            let criteria = {text: ''};
            if (!isObjectEmpty(this.props.match.params) || RightsURL.isAdvancedFilter(this.props.location.search)) {
                criteria = RightsURL.ArraytoFilter(params);
                this.props.searchFormShowAdvancedSearch(true);
                this.props.searchFormSetAdvancedSearchCriteria(criteria);
                this.handleAvailsAdvancedSearch(criteria);
            } else {
                const simpleFilter = params.find(param => param.split('=')[0] === 'text');
                if (simpleFilter && simpleFilter.split('=').length === 2) {
                    criteria = {text: decodeURIComponent(simpleFilter.split('=')[1])};
                    this.props.searchFormShowAdvancedSearch(false);
                }
                this.props.searchFormUpdateTextSearch(criteria);
                this.handleAvailsFreeTextSearch(criteria);
            }
        }
    }

    toggleAdvancedSearch() {
        this.props.searchFormShowAdvancedSearch(!this.props.showAdvancedSearch);
    }

    handleAvailsFreeTextSearch(searchCriteria) {
        this.props.resultPageShowSelected(false);
        this.props.searchFormShowSearchResults(true);
        rightSearchHelper.freeTextSearch(searchCriteria);
    }

    handleAvailsAdvancedSearch(searchCriteria) {
        this.props.resultPageShowSelected(false);
        this.props.searchFormShowSearchResults(true);

        rightSearchHelper.advancedSearch(searchCriteria);
    }

    render() {
        return (
            <div>
                <RightsURL />
                <div className={'container-fluid vu-free-text-search ' + (this.props.showAdvancedSearch ? 'hide' : '')}>
                    <div>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch
                                            disabled={this.props.showAdvancedSearch}
                                            containerId="dashboard-avails"
                                            onSearch={this.handleAvailsFreeTextSearch}
                                        />
                                    </td>
                                    <td style={{width: '20px', height: '30px', paddingLeft: '8px'}}>
                                        <button
                                            className="btn btn-outline-secondary advanced-search-btn"
                                            style={{height: '40px'}}
                                            title="Advanced search"
                                            id="dashboard-avails-advanced-search-btn"
                                            onClick={this.toggleAdvancedSearch}
                                        >
                                            <i
                                                className="fas fa-filter table-top-icon"
                                                style={{
                                                    fontSize: '1.25em',
                                                    marginLeft: '-3px',
                                                    marginTop: '6px',
                                                    padding: '0px',
                                                }}
                                            >
                                                {' '}
                                            </i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <AdvancedSearchPanel
                    location={this.props.location}
                    hide={!this.props.showAdvancedSearch}
                    onSearch={this.handleAvailsAdvancedSearch}
                    onToggleAdvancedSearch={this.toggleAdvancedSearch}
                />
                {!this.props.showSearchResults && <DashboardTab />}
                {this.props.showSearchResults && this.props.availsMapping && <SearchResultsTab />}
            </div>
        );
    }
}

DashboardContainer.propTypes = {
    availsMapping: PropTypes.any,
    searchCriteria: PropTypes.any,
    searchFormUpdateTextSearch: PropTypes.func,
    searchFormShowAdvancedSearch: PropTypes.func,
    searchFormShowSearchResults: PropTypes.func,
    searchFormSetAdvancedSearchCriteria: PropTypes.func,
    showAdvancedSearch: PropTypes.bool,
    showSearchResults: PropTypes.bool,
    location: PropTypes.object,
    match: PropTypes.object,
    resultPageShowSelected: PropTypes.func,
};

DashboardContainer.contextTypes = {
    router: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
