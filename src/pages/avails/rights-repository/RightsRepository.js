import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
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

const RightsRepository = ({
    columnDefs,
    createRightMatchingColumnDefs,
    mapping,
    username,
    onFiltersChange,
    location,
}) => {
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [isPlanningTabRefreshed, setIsPlanningTabRefreshed] = useState(false);
    const [rightsRepoGridApi, setRightsRepoGridApi] = useState(undefined);
    const [rightsRepoColumnApi, setRightsRepoColumnApi] = useState(undefined);

    const selectedPPRights = useRef([]);

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

    const persistSelectedPPRights = rights => {
        selectedPPRights.current = [...rights];
    };

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
                    location={location}
                    setRightsRepoGridApi={setRightsRepoGridApi}
                    setRightsRepoColumnApi={setRightsRepoColumnApi}
                />
            )}

            {activeTab === PRE_PLAN_TAB && (
                <PreplanRightsTable
                    mapping={mapping}
                    persistSelectedPPRights={persistSelectedPPRights}
                    persistedSelectedRights={selectedPPRights.current}
                />
            )}

            {activeTab === STATUS_TAB && <StatusLogRightsTable activeTab={activeTab} />}
            {activeTab === SELECTED_FOR_PLANNING_TAB && (
                <SelectedForPlanning activeTab={activeTab} isPlanningTabRefreshed={isPlanningTabRefreshed} />
            )}
        </div>
    );
};

RightsRepository.propTypes = {
    columnDefs: PropTypes.array.isRequired,
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    mapping: PropTypes.array,
    username: PropTypes.string.isRequired,
    onFiltersChange: PropTypes.func,
    location: PropTypes.object.isRequired,
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
