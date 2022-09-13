import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@portal/portal-auth/authSelectors';
import {connect} from 'react-redux';
import {fetchIngests} from '../ingest-panel/ingestActions';
import {getFiltersToSend} from '../ingest-panel/utils';
import PreplanRightsTable from '../preplan-rights-table/PreplanRightsTable';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import {
    createAvailsMappingSelector,
    createRightMatchingColumnDefsSelector,
} from '../right-matching/rightMatchingSelectors';
import RightsRepositoryTable from '../rights-repository-table/RightsRepositoryTable';
import SelectedForPlanning from '../selected-for-planning/SelectedForPlanning';
import StatusLogRightsTable from '../status-log-rights-table/StatusLogRightsTable';
import RightsRepositoryHeader from './components/RightsRepositoryHeader/RightsRepositoryHeader';
import {PRE_PLAN_TAB, RIGHTS_TAB, SELECTED_FOR_PLANNING_TAB, STATUS_TAB} from './constants';
import './RightsRepository.scss';

const RightsRepository = ({columnDefs, createRightMatchingColumnDefs, mapping, username, onFiltersChange}) => {
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [rightsRepoGridApi, setRightsRepoGridApi] = useState(undefined);
    const [rightsRepoColumnApi, setRightsRepoColumnApi] = useState(undefined);
    const [persistedSelectedPPRights, setPersistedSelectedPPRights] = useState([]);

    // update periodically the list of ingests
    useEffect(() => {
        const timer = setInterval(() => {
            onFiltersChange(getFiltersToSend());
        }, 50000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!columnDefs.length || !mapping) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, mapping]);

    // useEffect(() => {
    //     if (selectedGridApi && selectedRepoRights.length > 0) {
    //         const updatedPrePlanRights = [...currentUserPrePlanRights];
    //         selectedRepoRights?.forEach(selectedRight => {
    //             const index = currentUserPrePlanRights?.findIndex(right => right.id === selectedRight.id);
    //             if (index >= 0) {
    //                 updatedPrePlanRights[index] = {
    //                     ...currentUserPrePlanRights[index],
    //                     coreTitleId: selectedRight.coreTitleId,
    //                 };
    //             }
    //         });
    //         updatedPrePlanRights.length && setPreplanRights({[username]: updatedPrePlanRights});
    //     }
    // }, [selectedRepoRights, selectedGridApi]);

    return (
        <div className="nexus-c-rights-repository">
            <RightsRepositoryHeader
                gridApi={rightsRepoGridApi}
                columnApi={rightsRepoColumnApi}
                username={username}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
            />
            {activeTab === RIGHTS_TAB && (
                <RightsRepositoryTable
                    setRightsRepoGridApi={setRightsRepoGridApi}
                    setRightsRepoColumnApi={setRightsRepoColumnApi}
                />
            )}

            {activeTab === PRE_PLAN_TAB && (
                <PreplanRightsTable
                    mapping={mapping}
                    persistSelectedPPRights={setPersistedSelectedPPRights}
                    persistedSelectedRights={persistedSelectedPPRights}
                />
            )}

            {activeTab === STATUS_TAB && <StatusLogRightsTable />}
            {activeTab === SELECTED_FOR_PLANNING_TAB && <SelectedForPlanning />}
        </div>
    );
};

RightsRepository.propTypes = {
    columnDefs: PropTypes.array.isRequired,
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    mapping: PropTypes.array,
    username: PropTypes.string.isRequired,
    onFiltersChange: PropTypes.func,
};

RightsRepository.defaultProps = {
    mapping: [],
    onFiltersChange: () => null,
};

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();
    const availsMappingSelector = createAvailsMappingSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        username: getUsername(state),
    });
};

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    onFiltersChange: payload => dispatch(fetchIngests(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);
