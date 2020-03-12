import React from 'react';
import withRedux from '../../../components/avails/SaveStateTable';
import withColumnsReorder from '../../../components/avails/ColumnsReorderTable';
import withServerSorting from '../../../components/avails/ServerSortingTable';
import ResultsTable from '../../../components/common/ResultsTable';
import withRights from '../../../components/avails/ServerRightsResultsTable';
import t from 'prop-types';
import {connect} from 'react-redux';
import {profileService} from '../service/ProfileService';
import {configurationService} from '../service/ConfigurationService';
import RightsURL from '../util/RightsURL';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
import {
    searchFormSetAdvancedSearchCriteria,
} from '../../../stores/actions/avail/dashboard';
import DOP from '../../../util/DOP';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import { RIGHTS_FIX } from '../../../constants/breadcrumb';


let mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
    };
};

const mapDispatchToProps = {
    searchFormSetAdvancedSearchCriteria,
};

FixRights.propTypes = {
    availsMapping: t.object,
    searchFormSetAdvancedSearchCriteria: t.func,
    location: t.object,
    match: t.object
};

FixRights.contextTypes = {
    router: t.object
};

class FixRights extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            availHistoryId: this.props.match.params.availHistoryIds
        };
    }

    componentDidMount() {
        if (this.props.location && this.props.location.search) {
            const sparams = new URLSearchParams(this.props.location.search);
            const availHistoryIds = sparams.get('availHistoryIds');
            if (availHistoryIds) {
                sparams.delete('availHistoryIds');
                this.context.router.history.replace('/avails/history/' + availHistoryIds + '/fix-errors?' + sparams.toString());
                return;
            }
        }
        NexusBreadcrumb.set(RIGHTS_FIX);
        profileService.initAvailsMapping();
        configurationService.initConfiguration();

        this.getSearchCriteriaFromURL();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.availsMapping !== this.props.availsMapping) {
            this.getSearchCriteriaFromURL();
        }
    }

    getSearchCriteriaFromURL(){
        if(!this.props.availsMapping) {
            return;
        }
        const params = RightsURL.URLtoArray(this.props.location.search, this.props.match.params);
        params.push('invalid=true');
        let criteria = RightsURL.ArraytoFilter(params);
        this.props.searchFormSetAdvancedSearchCriteria(criteria);
        rightSearchHelper.advancedSearch(criteria, false);
    }

    parseLoadedData(response){
        if(response && response.data && response.data.data){
            DOP.setErrorsCount(response.data.total);
        }
    }

    render(){
        const RightsResultsTable = withRedux(withColumnsReorder(withServerSorting(withRights(ResultsTable))));
        return (
            <div>
                {this.props.availsMapping && (
                <RightsResultsTable
                    availsMapping={this.props.availsMapping}
                    onDataLoaded={this.parseLoadedData}
                    nav={{ back: 'fix-errors', params: { availHistoryId: this.state.availHistoryId } }}
                />
              )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FixRights);