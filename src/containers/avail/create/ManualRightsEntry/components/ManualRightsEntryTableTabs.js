import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {ManualRightEntryTab, TabContainer} from '../../../../../ui-elements/nexus-table-tab/TableTab';

import {
    FATAL,
    TOTAL_RIGHTS
} from '../../../../../constants/avails/manualRightsEntryTabs';
import {updateManualRightEntrySelectedTab} from '../../../../../stores/actions/avail/manualRightEntry';
import {rightsService} from '../../../service/RightsService';

function ManualRightEntryTableTabs({selectedTab, updateManualRightEntrySelectedTab, getCustomSearchCriteria, fatalCount}) {

    const [totalRightsCount, setTotalRightsCount] = useState();
    // const [createdCount, setCreatedCount] = useState();
    // const [updatedCount, setUpdatedCount] = useState();
    // const [pendingCount, setPendingCount] = useState();
    // const [errorsCount, setErrorsCount] = useState();

    useEffect(() => {
        rightsService.advancedSearch(getCustomSearchCriteria(TOTAL_RIGHTS), 0, 1)
            .then(response => setTotalRightsCount(response.data.total));
        // rightsService.advancedSearch(getCustomSearchCriteria(CREATED), 0, 1)
        //     .then(response => setCreatedCount(response.data.total));
        // rightsService.advancedSearch(getCustomSearchCriteria(UPDATED), 0, 1)
        //     .then(response => setUpdatedCount(response.data.total));
        // rightsService.advancedSearch(getCustomSearchCriteria(PENDING), 0, 1)
        //     .then(response => setPendingCount(response.data.total));
        // rightsService.advancedSearch(getCustomSearchCriteria(ERRORS), 0, 1)
        //     .then(response => setErrorsCount(response.data.total));
    }, []);

    return (
        <TabContainer>
            <ManualRightEntryTab isActive={selectedTab === TOTAL_RIGHTS}
                                 onClick={() => updateManualRightEntrySelectedTab(TOTAL_RIGHTS)}>Total Rights
                ({totalRightsCount})</ManualRightEntryTab>
            {/*<ManualRightEntryTab isActive={selectedTab === CREATED}*/}
            {/*                     onClick={() => updateManualRightEntrySelectedTab(CREATED)}>Created*/}
            {/*    ({createdCount})</ManualRightEntryTab>*/}
            {/*<ManualRightEntryTab isActive={selectedTab === UPDATED}*/}
            {/*                     onClick={() => updateManualRightEntrySelectedTab(UPDATED)}>Updated*/}
            {/*    ({updatedCount})</ManualRightEntryTab>*/}
            {/*<ManualRightEntryTab isActive={selectedTab === PENDING}*/}
            {/*                     onClick={() => updateManualRightEntrySelectedTab(PENDING)}>Pending*/}
            {/*    ({pendingCount})</ManualRightEntryTab>*/}
            {/*<ManualRightEntryTab isActive={selectedTab === ERRORS}*/}
            {/*                     onClick={() => updateManualRightEntrySelectedTab(ERRORS)}>Errors*/}
            {/*    ({errorsCount})</ManualRightEntryTab>*/}
            <ManualRightEntryTab isActive={selectedTab === FATAL}
                                 onClick={() => updateManualRightEntrySelectedTab(FATAL)}>Fatal
                ({fatalCount})</ManualRightEntryTab>
        </TabContainer>
    );
}

ManualRightEntryTableTabs.propTypes = {
    selectedTab: PropTypes.string,
    updateManualRightEntrySelectedTab: PropTypes.func,
    promotedRightsCount: PropTypes.number,
    getCustomSearchCriteria: PropTypes.func.isRequired,
    fatalCount: PropTypes.number
};

const mapStateToProps = state => {
    return {
        selectedTab: state.manualRightsEntry.session.selectedTab,
    };
};

const mapDispatchToProps = {
    updateManualRightEntrySelectedTab: updateManualRightEntrySelectedTab
};

export default connect(mapStateToProps, mapDispatchToProps)(ManualRightEntryTableTabs);