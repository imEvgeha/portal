import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import config from 'react-global-configuration';
import {ManualRightEntryTab, TabContainer} from '../../../../../../../ui/elements/nexus-table-tab/TableTab';

import {
    FATAL,
    TOTAL_RIGHTS,
    UNMATCHED,
    ERRORS,
    SUCCESS
} from '../../../../../constants/avails/manualRightsEntryTabs';
import {updateManualRightEntrySelectedTab} from '../../../../../stores/actions/avail/manualRightEntry';
import {rightsService} from '../../../service/RightsService';

const ManualRightEntryTableTabs = ({
    selectedTab,
    updateManualRightEntrySelectedTab,
    getCustomSearchCriteria,
    createdCount,
    updatedCount,
    fatalCount,
    historyData,
    availHistoryId
}) => {
    // Flag that tells if a component is mounted or not and is used as a failsafe in async requests
    // if component gets unmounted during call execution to prevent setting state on an unmounted component
    const ref = useRef(false);
    const [isMounted, setIsMounted] = useState(false);

    const [totalRightsCount, setTotalRightsCount] = useState();
    const [successCount, setSuccessCount] = useState();
    const [pendingCount, setPendingCount] = useState();
    const [errorsCount, setErrorsCount] = useState();

    // Effect hook that acts as a componentDidMount and componentWillUnmount, to set the _isMounted flag accordingly
    useEffect(() => {
        ref.current = true;
        setIsMounted(true);
        return () => (ref.current = false);
    }, []);

    useEffect(() => {
        rightsService.advancedSearch(getCustomSearchCriteria(TOTAL_RIGHTS), 0, 1)
            .then(response => isMounted && setTotalRightsCount(response.data.total));
        rightsService.advancedSearch(getCustomSearchCriteria(SUCCESS), 0, 1)
            .then(response => isMounted && setSuccessCount(response.data.total));
        rightsService.advancedSearch(getCustomSearchCriteria(UNMATCHED), 0, 1)
            .then(response => isMounted && setPendingCount(response.data.total));
        rightsService.advancedSearch(getCustomSearchCriteria(ERRORS), 0, 1)
            .then(response => isMounted && setErrorsCount(response.data.total));
    }, [historyData]);

    const getCustomTotalCount = () => {
        if(!isNaN(totalRightsCount) && !isNaN(fatalCount)) {
            return `${totalRightsCount}/${totalRightsCount + fatalCount}`;
        }
    };

    const viewJSON = () => {
        const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/avails/ingest/history/${availHistoryId}?appendErrorReports=true`;
        window.open( url, '_blank');
    };

    return (
        <TabContainer>
            <ManualRightEntryTab
                isActive={selectedTab === TOTAL_RIGHTS}
                onClick={() => updateManualRightEntrySelectedTab(TOTAL_RIGHTS)}
            >
                Total Rights ({getCustomTotalCount()})
            </ManualRightEntryTab>
            <ManualRightEntryTab isNotClickable={true}>
                New ({createdCount})
            </ManualRightEntryTab>
            <ManualRightEntryTab isNotClickable={true}>
                Updated ({updatedCount})
            </ManualRightEntryTab>
            <ManualRightEntryTab
                isActive={selectedTab === FATAL}
                onClick={() => updateManualRightEntrySelectedTab(FATAL)}
            >
                Fatal ({fatalCount})
            </ManualRightEntryTab>
            <ManualRightEntryTab
                isActive={selectedTab === SUCCESS}
                onClick={() => updateManualRightEntrySelectedTab(SUCCESS)}
            >
                Success ({successCount})
            </ManualRightEntryTab>
            <ManualRightEntryTab
                isActive={selectedTab === UNMATCHED}
                onClick={() => updateManualRightEntrySelectedTab(UNMATCHED)}
            >
                Unmatched ({pendingCount})
            </ManualRightEntryTab>
            <ManualRightEntryTab
                isActive={selectedTab === ERRORS}
                onClick={() => updateManualRightEntrySelectedTab(ERRORS)}
            >
                Errors ({errorsCount})
            </ManualRightEntryTab>
            <ManualRightEntryTab
                onClick={() => viewJSON()}
            >
                View JSON
            </ManualRightEntryTab>
        </TabContainer>
    );
};

ManualRightEntryTableTabs.propTypes = {
    selectedTab: PropTypes.string,
    updateManualRightEntrySelectedTab: PropTypes.func,
    getCustomSearchCriteria: PropTypes.func.isRequired,
    fatalCount: PropTypes.number,
    createdCount: PropTypes.number,
    updatedCount: PropTypes.number,
    historyData: PropTypes.object,
    availHistoryId:  PropTypes.string,
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