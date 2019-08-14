import React from 'react';
import withRedux from '../../../components/avails/SaveStateTable';
import withColumnsReorder from '../../../components/avails/ColumnsReorderTable';
import withServerSorting from '../../../components/avails/ServerSortingTable';
import ResultsTable from '../../../components/common/ResultsTable';
import withRights from '../../../components/avails/ServerRightsResultsTable';
import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {profileService} from '../service/ProfileService';
import {configurationService} from '../service/ConfigurationService';
import withSelect from '../../../components/common/SelectionTable';
// import NexusBreadcrumb from '../../NexusBreadcrumb';
import RightsURL from '../util/RightsURL';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
import {
    searchFormSetAdvancedSearchCriteria,
} from '../../../stores/actions/avail/dashboard';

let mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
    };
};

const mapDispatchToProps = {
    searchFormSetAdvancedSearchCriteria,
};

class FixRights extends React.Component {

    static propTypes = {
        availsMapping: t.object,
        searchFormSetAdvancedSearchCriteria: t.func,
        location: t.object,
        match: t.object
    };

    static contextTypes = {
        router: t.object
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // NexusBreadcrumb.set(AVAILS_DASHBOARD);
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
        let criteria = RightsURL.ArraytoFilter(params);
        this.props.searchFormSetAdvancedSearchCriteria(criteria);
        rightSearchHelper.advancedSearch(criteria);
    }

    render(){
        const RightsResultsTable = withRedux(withColumnsReorder(withSelect(withServerSorting(withRights(ResultsTable)))));
        return (
            <div>
                {this.props.availsMapping &&
                <RightsResultsTable availsMapping = {this.props.availsMapping}/>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FixRights);