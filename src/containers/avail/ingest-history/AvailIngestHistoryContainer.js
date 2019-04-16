import React from 'react';

import AvailsIngestHistoryTable from './components/AvailsIngestHistoryTable';
import AdvancedHistorySearchPanel from './components/AdvancedHistorySearchPanel';
import {advancedHistorySearchHelper} from './AdvancedHistorySearchHelper';
import {AVAILS_DASHBOARD, AVAILS_HISTORY_SEARCH_RESULTS} from '../../../constants/breadcrumb';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import HistoryURL from '../util/HistoryURL';
import t from 'prop-types';
import {
    searchFormSetAdvancedHistorySearchCriteria,
    searchFormSetHistorySearchCriteria
} from '../../../stores/actions/avail/history';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        searchCriteria: state.history.session.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    searchFormSetAdvancedHistorySearchCriteria,
    searchFormSetHistorySearchCriteria
};

class AvailIngestHistoryContainer extends React.Component {
    static propTypes = {
        location: t.object,
        searchFormSetAdvancedHistorySearchCriteria: t.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        NexusBreadcrumb.set([AVAILS_DASHBOARD, AVAILS_HISTORY_SEARCH_RESULTS]);
        this.getSearchCriteriaFromURL();
    }

    componentWillUnmount() {
        NexusBreadcrumb.pop();
    }

    getSearchCriteriaFromURL(){
        const params = HistoryURL.URLtoArray(this.props.location.search);
        const criteria = HistoryURL.ArraytoFilter(params);
        this.props.searchFormSetAdvancedHistorySearchCriteria(criteria);
        this.handleHistoryAdvancedSearch(criteria);
    }

    handleHistoryAdvancedSearch(searchCriteria) {
        advancedHistorySearchHelper.advancedSearch(searchCriteria);
    }

    render() {
        return (
            <div>
                <HistoryURL/>
                {<AdvancedHistorySearchPanel onSearch={this.handleHistoryAdvancedSearch}/>}
                <div id="avail-ingest-history-result-table">
                    <div className={'container-fluid'}>
                        <AvailsIngestHistoryTable/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailIngestHistoryContainer);
