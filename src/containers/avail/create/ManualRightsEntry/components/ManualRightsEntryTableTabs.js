import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {ManualRightEntryTab, TabContainer} from '../../../../../ui-elements/nexus-table-tab/TableTab';

import {
    FATAL,
    TOTAL_RIGHTS,
    PENDING,
    ERRORS,
    SUCCESS
} from '../../../../../constants/avails/manualRightsEntryTabs';
import {updateManualRightEntrySelectedTab} from '../../../../../stores/actions/avail/manualRightEntry';
import {rightsService} from '../../../service/RightsService';

function ManualRightEntryTableTabs({selectedTab, updateManualRightEntrySelectedTab, getCustomSearchCriteria, createdCount, updatedCount, fatalCount}) {

    const [totalRightsCount, setTotalRightsCount] = useState();
    const [successCount, setSuccessCount] = useState();
    const [pendingCount, setPendingCount] = useState();
    const [errorsCount, setErrorsCount] = useState();

    useEffect(() => {
        rightsService.advancedSearch(getCustomSearchCriteria(TOTAL_RIGHTS), 0, 1)
            .then(response => setTotalRightsCount(response.data.total));
        rightsService.advancedSearch(getCustomSearchCriteria(SUCCESS), 0, 1)
            .then(response => setSuccessCount(response.data.total));
        rightsService.advancedSearch(getCustomSearchCriteria(PENDING), 0, 1)
            .then(response => setPendingCount(response.data.total));
        rightsService.advancedSearch(getCustomSearchCriteria(ERRORS), 0, 1)
            .then(response => setErrorsCount(response.data.total));
    }, []);

    const getCustomTotalCount = () => {
        if(totalRightsCount && fatalCount) {
            return `${totalRightsCount}/${totalRightsCount + fatalCount}`;
        }
    };

    return (
        <TabContainer>
            <ManualRightEntryTab isActive={selectedTab === TOTAL_RIGHTS}
                                 onClick={() => updateManualRightEntrySelectedTab(TOTAL_RIGHTS)}>Total Rights
                ({getCustomTotalCount()})</ManualRightEntryTab>
            <ManualRightEntryTab isNotClickable={true}>Created ({createdCount})</ManualRightEntryTab>
            <ManualRightEntryTab isNotClickable={true}>Updated ({updatedCount})</ManualRightEntryTab>
            <ManualRightEntryTab isActive={selectedTab === SUCCESS}
                                 onClick={() => updateManualRightEntrySelectedTab(SUCCESS)}>Success
                ({successCount})</ManualRightEntryTab>
            <ManualRightEntryTab isActive={selectedTab === PENDING}
                                 onClick={() => updateManualRightEntrySelectedTab(PENDING)}>Unmatched
                ({pendingCount})</ManualRightEntryTab>
            <ManualRightEntryTab isActive={selectedTab === ERRORS}
                                 onClick={() => updateManualRightEntrySelectedTab(ERRORS)}>Errors
                ({errorsCount})</ManualRightEntryTab>
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
    fatalCount: PropTypes.number.isRequired,
    createdCount: PropTypes.number,
    updatedCount: PropTypes.number
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