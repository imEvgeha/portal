import './DashboardContainer.scss';

import React from 'react';
import {connect} from 'react-redux';
import FreeTextSearch from './components/FreeTextSearch';
import {
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    resultPageSelect,
    searchFormShowSearchResults,
} from '../../../stores/actions/metadata/index';
import DashboardTab from './DashboardTab';
import PropTypes from 'prop-types';
import {titleSearchHelper} from '../dashboard/TitleSearchHelper';
import moment from 'moment';
import {configService} from '../service/ConfigService';
import TitleResultTable from './components/table/TitleResultTable';

const mapStateToProps = state => {
    return {
        profileInfo: state.profileInfo,
        selected: state.titleReducer.session.titleTabPageSelection.selected,
        showSearchResults: state.titleReducer.session.showSearchResults,
        searchCriteria: state.titleReducer.session.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    resultPageLoading,
    resultPageSort,
    resultPageUpdate,
    resultPageSelect,
    searchFormShowSearchResults,
};

class DashboardContainer extends React.Component {
    fromHistory = false;

    constructor(props) {
        super(props);
        this.state = {};
        this.handleTitleFreeTextSearch = this.handleTitleFreeTextSearch.bind(this);
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
        
        this.props.searchFormShowSearchResults(false);
    }



    handleTitleFreeTextSearch(searchCriteria) {
        
        this.props.searchFormShowSearchResults(true);
        titleSearchHelper.freeTextSearch(searchCriteria);
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
                <div className={'container-fluid vu-free-text-search'}>
                    <div>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch
                                            disabled={false}
                                            containerId="dashboard-title"
                                            onSearch={this.handleTitleFreeTextSearch}
                                        />
                                    </td>  
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            
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
    searchCriteria: PropTypes.any,
    searchFormUseAdvancedSearch: PropTypes.func,
    resultPageSelect: PropTypes.func,
    searchFormShowAdvancedSearch: PropTypes.func,
    searchFormShowSearchResults: PropTypes.func,
    searchFormSetAdvancedSearchCriteria: PropTypes.func,
    selected: PropTypes.array,
    showAdvancedSearch: PropTypes.bool,
    showSearchResults: PropTypes.bool,
    useAdvancedSearch: PropTypes.bool,
    location: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
