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
import withSelectIgnoreMark from '../../../components/DOP/SelectIgnoreMarkTable';

let mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
    };
};

class SelectRightsPlanning extends React.Component {

    static propTypes = {
        availsMapping: t.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        configurationService.initConfiguration();
    }

    render(){
        const RightsResultsTable = withRedux(withColumnsReorder(withSelectIgnoreMark(withServerSorting(withRights(ResultsTable)))));
        return (
            <div>
            {this.props.availsMapping &&
                    <RightsResultsTable availsMapping = {this.props.availsMapping}/>
            }
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(SelectRightsPlanning);