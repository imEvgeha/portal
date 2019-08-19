import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import withRedux from '../../../components/avails/SaveStateTable';
import withColumnsReorder from '../../../components/avails/ColumnsReorderTable';
import withServerSorting from '../../../components/avails/ServerSortingTable';
import ResultsTable from '../../../components/common/ResultsTable';
import withFilteredRights from '../../../components/DOP/withFilteredRights';
import withSelectIgnoreMark from '../../../components/DOP/SelectIgnoreMarkTable';
import {fetchAvailMapping, fetchAvailConfiguration} from '../availActions';
import withSelectRightHeader from '../../../components/DOP/SelectRightsTableHeader';

// we could use here react functional componenent with 'useState()' hook instead of react class component
class SelectRightsPlanning extends Component {
    static propTypes =  {
        availsMapping: PropTypes.object,
        reports: PropTypes.array,
        fetchAvailMapping: PropTypes.func.isRequired,
        fetchAvailConfiguration: PropTypes.func.isRequired,
    };

    static defaultProps = {
        availsMapping: null,
        reports: null,
    };

    componentDidMount() {
        const {availsMapping, reports, fetchAvailMapping, fetchAvailConfiguration} = this.props;
        if (!availsMapping) {
            fetchAvailMapping();
        }
        if (!reports) {
            fetchAvailConfiguration();
        }
    }

    render() {
        const {availsMapping} = this.props;
        const RightsResultsTable = compose(
            withSelectRightHeader,
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
    reports: root.reports,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload)),
    fetchAvailConfiguration: payload => dispatch(fetchAvailConfiguration(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightsPlanning);
