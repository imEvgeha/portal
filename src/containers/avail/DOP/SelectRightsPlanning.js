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
import {fetchAvailConfiguration, fetchAvailMapping} from '../availActions';
import withSelectRightHeader from '../../../components/DOP/SelectRightsTableHeader';
import SelectRightsDOPConnector from './SelectRightsDOPConnector';
import {PENDING_SELECTION} from '../../../constants/DOP/selectedTab';
import {tabFilter} from '../../../constants/DOP/tabFilter';
import withLocalRights, {DOP_SELECTION} from '../../../components/avails/LocalRightsResultsTable';

// we could use here react functional componenent with 'useState()' hook instead of react class component
class SelectRightsPlanning extends Component {
    static propTypes =  {
        availsMapping: PropTypes.object,
        fetchAvailMapping: PropTypes.func.isRequired,
        fetchAvailConfiguration: PropTypes.func.isRequired,
        selectedTerritoriesTab: PropTypes.string.isRequired
    };

    static defaultProps = {
        availsMapping: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isPendingSelectionHide: true,
            rightsFilteredBy: {}
        };
    }

    componentDidMount() {
        const {availsMapping, fetchAvailMapping, fetchAvailConfiguration} = this.props;
        if (!availsMapping) {
            fetchAvailMapping();
        }
        fetchAvailConfiguration();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.selectedTerritoriesTab !== this.props.selectedTerritoriesTab) {
            this.renderTableFilter();
        }
    }

    renderTableFilter = () => {
        const {selectedTerritoriesTab} = this.props;
        const filterBy = tabFilter.get(selectedTerritoriesTab);

        if (selectedTerritoriesTab !== PENDING_SELECTION) {
            this.setState({
                isPendingSelectionHide: true,
                rightsFilteredBy: filterBy
            });
        } else {
            this.setState({
                isPendingSelectionHide: false
            });
        }
    };

    render() {
        const {availsMapping} = this.props;

        const RightsResultsTable = compose(
            withSelectRightHeader,
            withRedux,
            withColumnsReorder,
            withSelectIgnoreMark,
            withServerSorting,
            withFilteredRights(this.state.rightsFilteredBy),
        )(ResultsTable);

        const SelectedRightsResultsTable = compose(
            withRedux,
            withColumnsReorder,
            withSelectIgnoreMark,
            withServerSorting,
            withLocalRights(DOP_SELECTION))(ResultsTable);

        return (
            <div>
                <SelectRightsDOPConnector/>
                {availsMapping && (
                    <RightsResultsTable
                        availsMapping={availsMapping}
                        mode={'selectRightsMode'}
                        disableEdit={true}
                        hidden={this.props.selectedTerritoriesTab === PENDING_SELECTION}
                    />
                )}
                {availsMapping && (
                    <SelectedRightsResultsTable availsMapping = {this.props.availsMapping}
                                                hidden={this.props.selectedTerritoriesTab !== PENDING_SELECTION}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = ({root, dopReducer}) => ({
    availsMapping: root.availsMapping,
    selectedTerritoriesTab: dopReducer.session.selectedTerritoriesTab,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload)),
    fetchAvailConfiguration: payload => dispatch(fetchAvailConfiguration(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightsPlanning);
