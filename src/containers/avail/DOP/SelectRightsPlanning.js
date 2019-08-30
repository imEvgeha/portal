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
import SelectRightsDOPConnector from './SelectRightsDOPConnector';


// we could use here react functional componenent with 'useState()' hook instead of react class component
class SelectRightsPlanning extends Component {
    static propTypes =  {
        availsMapping: PropTypes.object,
        fetchAvailMapping: PropTypes.func.isRequired,
        fetchAvailConfiguration: PropTypes.func.isRequired,
    };

    static defaultProps = {
        availsMapping: null
    };

    componentDidMount() {
        const {availsMapping, fetchAvailMapping, fetchAvailConfiguration} = this.props;
        if (!availsMapping) {
            fetchAvailMapping();
        }
        fetchAvailConfiguration();
    }

    render() {
        const {availsMapping} = this.props;

        const RightsResultsTable = compose(
            withSelectRightHeader,
            withRedux,
            withColumnsReorder,
            withSelectIgnoreMark,
            withServerSorting,
            withFilteredRights({status:'Ready,ReadyNew', invalid:'false'}),
        )(ResultsTable);

        return (
            <div>
                <SelectRightsDOPConnector/>
                {availsMapping && (
                    <RightsResultsTable
                        availsMapping={availsMapping}
                        mode={'selectRightsMode'}
                        disableEdit={true}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = ({root}) => ({
    availsMapping: root.availsMapping
});

const mapDispatchToProps = (dispatch) => ({
    fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload)),
    fetchAvailConfiguration: payload => dispatch(fetchAvailConfiguration(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightsPlanning);
