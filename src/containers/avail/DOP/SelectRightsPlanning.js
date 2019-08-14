import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import withRedux from '../../../components/avails/SaveStateTable';
import withColumnsReorder from '../../../components/avails/ColumnsReorderTable';
import withServerSorting from '../../../components/avails/ServerSortingTable';
import ResultsTable from '../../../components/common/ResultsTable';
import withFilteredRights from '../../../components/avails/withFilteredRights';
import {fetchAvailMapping, fetchAvailConfiguration} from '../availActions';
import withSelectIgnoreMark from '../../../components/DOP/SelectIgnoreMarkTable';

// we could use here react functional componenent with 'useState()' hook instead of react class component
class SelectRightsPlanning extends Component {
    static propTypes =  {
        availsMapping: PropTypes.object,
        fetchAvailMapping: PropTypes.func.isRequired,
        fetchAvailConfiguration: PropTypes.func.isRequired,
    };

    static defaultProps = {
        availsMapping: null,
    };

    componentDidMount() {
        const {fetchAvailMapping, fetchAvailConfiguration} = this.props;
        fetchAvailMapping();
        fetchAvailConfiguration();
    }

    render() {
        const {availsMapping} = this.props;
        const RightsResultsTable = compose(
            withRedux,
            withColumnsReorder,
            withSelectIgnoreMark,
            withServerSorting,
            withFilteredRights({status:'Ready,ReadyNew'}),
        )(ResultsTable);

        return (
            <div>
                {availsMapping && (
                    <RightsResultsTable availsMapping = {availsMapping}/>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({root}) => ({
    availsMapping: root.availsMapping,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload)),
    fetchAvailConfiguration: payload => dispatch(fetchAvailConfiguration(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightsPlanning);
