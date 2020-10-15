import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {isEqual} from 'lodash';
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
import withLocalRights, {DOP_SELECTION} from '../../../components/avails/LocalRightsResultsTable';
import SearchComponent from './search/SearchComponent';
import {updateRightsFilter} from '../../../stores/actions/DOP';
import {initialTabFilter} from '../../../constants/DOP/tabFilter';

// we could use here react functional componenent with 'useState()' hook instead of react class component
class SelectRightsPlanning extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {availsMapping, fetchAvailMapping, fetchAvailConfiguration} = this.props;
        if (!availsMapping) {
            fetchAvailMapping();
        }
        fetchAvailConfiguration();
        this.renderInitialTabFilter();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedTerritoriesTab !== this.props.selectedTerritoriesTab) {
            this.renderInitialTabFilter();
        }
    }

    renderInitialTabFilter = () => {
        const {updateRightsFilter, tabFilter} = this.props;

        if (!isEqual(tabFilter, initialTabFilter)) {
            updateRightsFilter(initialTabFilter);
        }
    };

    onFilterChange = searchBy => {
        const {tabFilter, selectedTerritoriesTab, updateRightsFilter} = this.props;
        if (selectedTerritoriesTab !== PENDING_SELECTION) {
            let tabFilterCopy = JSON.parse(JSON.stringify(tabFilter));
            delete tabFilterCopy[selectedTerritoriesTab].titleMatch;
            if (searchBy) {
                tabFilterCopy[selectedTerritoriesTab].titleMatch = searchBy;
            }
            updateRightsFilter(tabFilterCopy);
        }
    };

    render() {
        const {availsMapping, tabFilter, selectedTerritoriesTab} = this.props;

        const RightsResultsTable = compose(
            withSelectRightHeader,
            withRedux,
            withColumnsReorder,
            withSelectIgnoreMark,
            withServerSorting,
            withFilteredRights(tabFilter[selectedTerritoriesTab])
        )(ResultsTable);

        const SelectedRightsResultsTable = compose(
            withSelectRightHeader,
            withRedux,
            withColumnsReorder,
            withSelectIgnoreMark,
            withServerSorting,
            withLocalRights(DOP_SELECTION)
        )(ResultsTable);

        return (
            <div>
                <SelectRightsDOPConnector />
                {availsMapping && (
                    <>
                        <SearchComponent onFilterChange={this.onFilterChange} />
                        <RightsResultsTable
                            availsMapping={availsMapping}
                            mode="selectRightsMode"
                            disableEdit={true}
                            hidden={this.props.selectedTerritoriesTab === PENDING_SELECTION}
                        />
                        <SelectedRightsResultsTable
                            availsMapping={this.props.availsMapping}
                            hidden={this.props.selectedTerritoriesTab !== PENDING_SELECTION}
                            disableEdit={true}
                        />
                    </>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({root, dopReducer}) => ({
    availsMapping: root.availsMapping,
    selectedTerritoriesTab: dopReducer.session.selectedTerritoriesTab,
    tabFilter: dopReducer.session.tabFilter,
});

const mapDispatchToProps = dispatch => ({
    fetchAvailMapping: payload => dispatch(fetchAvailMapping(payload)),
    fetchAvailConfiguration: payload => dispatch(fetchAvailConfiguration(payload)),
    updateRightsFilter: payload => dispatch(updateRightsFilter(payload)),
});

SelectRightsPlanning.propTypes = {
    availsMapping: PropTypes.object,
    fetchAvailMapping: PropTypes.func.isRequired,
    fetchAvailConfiguration: PropTypes.func.isRequired,
    selectedTerritoriesTab: PropTypes.string.isRequired,
    updateRightsFilter: PropTypes.func.isRequired,
    tabFilter: PropTypes.object.isRequired,
};

SelectRightsPlanning.defaultProps = {
    availsMapping: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightsPlanning);
