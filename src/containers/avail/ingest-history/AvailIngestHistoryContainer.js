import React from 'react';

import AvailsIngestHistoryTable from './components/AvailsIngestHistoryTable';
import AdvancedHistorySearchPanel from './components/AdvancedHistorySearchPanel';
import {advancedHistorySearchHelper} from './AdvancedHistorySearchHelper';
import connect from 'react-redux/es/connect/connect';
import {updateBreadcrumb} from '../../../stores/actions/index';
import t from 'prop-types';
import {AVAILS_HISTORY} from '../../../constants/breadcrumb';


const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = {
    updateBreadcrumb,
};


class AvailIngestHistoryContainer extends React.Component {
    static propTypes = {
        updateBreadcrumb: t.func,
    };

    constructor(props) {
        super(props);
    }

    handleHistoryAdvancedSearch(searchCriteria) {
        advancedHistorySearchHelper.advancedSearch(searchCriteria);
    }

    componentDidMount() {
        this.props.updateBreadcrumb([AVAILS_HISTORY]);
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

export default connect(mapStateToProps, mapDispatchToProps)(AvailIngestHistoryContainer);