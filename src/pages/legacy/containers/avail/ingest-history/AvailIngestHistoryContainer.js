import React from 'react';

import AvailsIngestHistoryTable from './components/AvailsIngestHistoryTable';
import AdvancedHistorySearchPanel from './components/AdvancedHistorySearchPanel';
import {advancedHistorySearchHelper} from './AdvancedHistorySearchHelper';
import HistoryURL from '../util/HistoryURL';
import PropTypes from 'prop-types';
import {
    searchFormSetAdvancedHistorySearchCriteria,
    searchFormSetHistorySearchCriteria,
} from '../../../stores/actions/avail/history';
import {connect} from 'react-redux';
import moment from 'moment';

const mapStateToProps = state => {
    return {
        searchCriteria: state.history.session.advancedSearchCriteria,
    };
};

const mapDispatchToProps = {
    searchFormSetAdvancedHistorySearchCriteria,
    searchFormSetHistorySearchCriteria,
};

class AvailIngestHistoryContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSearchCriteriaFromURL();
    }

    getSearchCriteriaFromURL() {
        const params = HistoryURL.URLtoArray(this.props.location.search);
        const criteria = HistoryURL.ArraytoFilter(params);
        if (criteria.received) {
            if (criteria.received.from && criteria.received.from.indexOf('Z') > -1) {
                criteria.received.from = moment.utc(criteria.received.from).local().format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            }
            if (criteria.received.to && criteria.received.to.indexOf('Z') > -1) {
                criteria.received.to = moment
                    .utc(criteria.received.to)
                    .local()
                    .startOf('day')
                    .format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            }
        }
        this.props.searchFormSetAdvancedHistorySearchCriteria(criteria);
        this.handleHistoryAdvancedSearch(criteria);
    }

    handleHistoryAdvancedSearch(searchCriteria) {
        advancedHistorySearchHelper.advancedSearch(searchCriteria);
    }

    render() {
        return (
            <div>
                <HistoryURL />
                <AdvancedHistorySearchPanel onSearch={this.handleHistoryAdvancedSearch} />
                <div id="avail-ingest-history-result-table">
                    <div className="container-fluid">
                        <AvailsIngestHistoryTable />
                    </div>
                </div>
            </div>
        );
    }
}

AvailIngestHistoryContainer.propTypes = {
    location: PropTypes.object,
    searchFormSetAdvancedHistorySearchCriteria: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AvailIngestHistoryContainer);
