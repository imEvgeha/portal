import React from 'react';

import AvailsIngestHistoryTable from './components/AvailsIngestHistoryTable';
import AdvancedHistorySearchPanel from './components/AdvancedHistorySearchPanel';
import {advancedHistorySearchHelper} from './AdvancedHistorySearchHelper';
import {AVAILS_DASHBOARD, AVAILS_HISTORY_SEARCH_RESULTS} from '../../../constants/breadcrumb';
import NexusBreadcrumb from '../../NexusBreadcrumb';

class AvailIngestHistoryContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    handleHistoryAdvancedSearch(searchCriteria) {
        advancedHistorySearchHelper.advancedSearch(searchCriteria);
    }

    componentDidMount() {
        NexusBreadcrumb.set([AVAILS_DASHBOARD, AVAILS_HISTORY_SEARCH_RESULTS]);
    }

    componentWillUnmount() {
        NexusBreadcrumb.pop();
    }

    render() {
        return (
            <div>
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

export default AvailIngestHistoryContainer;
