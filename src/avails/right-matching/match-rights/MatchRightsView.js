import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
import './MatchRightsView.scss';
import * as selectors from '../rightMatchingSelectors';
import {
    createRightMatchingColumnDefs,
    fetchAndStoreFocusedRight,
    fetchCombinedRight,
    fetchMatchedRight,
    saveCombinedRight,
    setCombinedSavedFlag
} from '../rightMatchingActions';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import BackNavigationByUrl from '../../../ui-elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {URL} from '../../../util/Common';
import withEditableColumns from '../../../ui-elements/nexus-grid/hoc/withEditableColumns';
import BottomButtons from '../components/bottom-buttons/BottomButons';

const EditableNexusGrid = withEditableColumns(NexusGrid);

function MatchRightView({
    history,
    match,
    focusedRight,
    matchedRight,
    combinedRight,
    fetchFocusedRight,
    fetchMatchedRight,
    fetchCombinedRight,
    saveCombinedRight,
    createRightMatchingColumnDefs, 
    columnDefs, 
    mapping,
    setCombinedSavedFlag,
    isCombinedRightSaved,
}) {
    const rowDataRef = useRef([]);
    const [saveButtonDisabled, setSaveButtonDisabled] =  useState(false);

    useEffect(() => {
        setCombinedSavedFlag({isCombinedRightSaved: false});
    }, []);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [columnDefs, mapping]);

    useEffect(() => {
        const {params} = match || {};
        const {rightId, matchedRightId} = params || {};
        if (rightId && matchedRightId && columnDefs.length) {
            if (!focusedRight || (focusedRight.id !== rightId)) {
                fetchFocusedRight(rightId);
            }
            fetchMatchedRight(matchedRightId);
            // matchedRightId from url should be correct one.
            fetchCombinedRight(rightId, matchedRightId);
        }
    },[match.params.matchedRightId, match.params.rightId, columnDefs.length]);

    useEffect(() => {
        setSaveButtonDisabled(false);
        if(isCombinedRightSaved) {
            const {params} = match || {};
            const {availHistoryIds} = params || {};
            history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching`));
        }
    }, [isCombinedRightSaved]);

    // TODO:  we should handle this via router Link
    const navigateToMatchPreview = () => {
        const {params} = match || {};
        const {availHistoryIds, rightId} = params || {};
        history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching/${rightId}`));
    };

    // TODO:  we should handle this via router Link
    const onCancel = () => {
        const {params} = match || {};
        const {rightId, availHistoryIds} = params || {};
        history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching/${rightId}`));
    };

    const onSaveCombinedRight = () => {
        const {params} = match || {};
        const {rightId, matchedRightId} = params || {};
        setSaveButtonDisabled(true);
        // TODO: fix this
        if (Array.isArray(rowDataRef.current) && rowDataRef.current.length) {
            const updateCombinedRight = rowDataRef.current[0]; 
            saveCombinedRight(rightId, matchedRightId, updateCombinedRight);
            return;
        }
        saveCombinedRight(rightId, matchedRightId, combinedRight);
    };

    // Sorted by start field. desc
    const matchedRightRowData = [focusedRight, matchedRight].sort((a,b) => a && b && moment.utc(b.originallyReceivedAt).diff(moment.utc(a.originallyReceivedAt)));

    const handleGridEvent = ({type, api}) => {
        let result = [];
        // TODO: add all grid event to constant
        if (type === 'cellValueChanged') {
            api.forEachNode(({data}) => result.push(data));
            rowDataRef.current = result;
        }
    };

    return (
        <div className='nexus-c-match-right'>
            <BackNavigationByUrl
                title={'Rights Matching Preview'}
                onNavigationClick={navigateToMatchPreview}
            />
            <div className='nexus-c-match-right__matched'>
                <NexusTitle>Matched Rights</NexusTitle>
                {!!columnDefs && (
                    <NexusGrid
                        columnDefs={columnDefs}
                        rowData={matchedRightRowData}
                        domLayout='autoHeight'
                    />
                )}
            </div>
            <div className='nexus-c-match-right__combined'>
                <NexusTitle>Combined Rights</NexusTitle>
                {!!columnDefs && (
                    <EditableNexusGrid
                        columnDefs={columnDefs}
                        rowData={[combinedRight]}
                        onGridEvent={handleGridEvent}
                        domLayout='autoHeight'
                    />
                )}
            </div>
            <div className='nexus-c-match-right__buttons'>
                <BottomButtons buttons={[
                    {
                        name: 'Cancel',
                        onClick: onCancel
                    },
                    {
                        name: 'Save',
                        onClick: onSaveCombinedRight,
                        isDisabled: saveButtonDisabled || !focusedRight.id || !matchedRight.id || !combinedRight.id,
                        appearance: 'primary'
                    }
                ]}/>
            </div>
        </div>
    );
}

MatchRightView.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    focusedRight: PropTypes.object,
    matchedRight: PropTypes.object,
    combinedRight: PropTypes.object,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    fetchFocusedRight: PropTypes.func,
    fetchMatchedRight: PropTypes.func,
    fetchCombinedRight: PropTypes.func,
    saveCombinedRight: PropTypes.func,
    createRightMatchingColumnDefs: PropTypes.func,
    setCombinedSavedFlag: PropTypes.func,
    isCombinedRightSaved: PropTypes.bool,
};

MatchRightView.defaultProps = {
    history: null,
    match: null,
    focusedRight: null,
    matchedRight: null,
    combinedRight: null,
    columnDefs: [],
    mapping: null,
    fetchFocusedRight: null,
    fetchMatchedRight: null,
    fetchCombinedRight: null,
    saveCombinedRight: null,
    createRightMatchingColumnDefs: null,
    isCombinedRightSaved: false
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const matchedRightSelector = selectors.createMatchedRightSelector();
    const combinedRightSelector = selectors.createCombinedRightSelector();
    const combinedRightSavedFlagSelector = selectors.createCombinedRightSavedFlagSelector();
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();

    return (state, props) => ({
        focusedRight: focusedRightSelector(state, props),
        matchedRight: matchedRightSelector(state, props),
        combinedRight: combinedRightSelector(state, props),
        isCombinedRightSaved: combinedRightSavedFlagSelector(state, props),
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchAndStoreFocusedRight(payload)),
    fetchMatchedRight: payload => dispatch(fetchMatchedRight(payload)),
    fetchCombinedRight: (focusedRightId, matchedRightId) => dispatch(fetchCombinedRight(focusedRightId, matchedRightId)),
    saveCombinedRight:(focusedRightId, matchedRightId, combinedRight) => dispatch(saveCombinedRight(focusedRightId, matchedRightId, combinedRight)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    setCombinedSavedFlag: payload => dispatch(setCombinedSavedFlag(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(MatchRightView); // eslint-disable-line
