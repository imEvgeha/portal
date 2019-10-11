import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
import './MatchRightsView.scss';
import * as selectors from '../rightMatchingSelectors';
import {
    createRightMatchingColumnDefs,
    fetchCombinedRight,
    fetchAndStoreFocusedRight,
    fetchMatchedRight,
    saveCombinedRight
} from '../rightMatchingActions';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import BackNavigationByUrl from '../../../ui-elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {URL} from '../../../util/Common';

function MatchRightView({
    history, 
    match, 
    focusedRight,
    matchedRight, 
    combinedRight, 
    fetchFocusedRight, 
    fetchMatchedRight, 
    fetchCombinedRight,
    createRightMatchingColumnDefs, 
    columnDefs, 
    mapping
}) {
    useEffect(() => {
        if (!columnDefs.length && mapping) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [columnDefs, mapping]);

    useEffect(() => {
        const {params} = match || {};
        const {rightId, matchedRightId} = params || {};
        if (rightId && matchedRightId) {
            if (focusedRight && focusedRight.id !== rightId) {
                fetchFocusedRight(rightId);
            }
            fetchMatchedRight(matchedRightId);
            // matchedRightId from url should be correct one.
            fetchCombinedRight(rightId, matchedRightId);
        }
    },[match]);

    // we should this via router Link
    const navigateToMatchPreview = () => {
        const {params} = match || {};
        const {availHistoryIds, rightId} = params || {};
        history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching/${rightId}`));
    };

    // Sorted by start field. desc
    const matchedRightRowData = [focusedRight, matchedRight].sort((a,b) => a && b && moment.utc(b.originallyReceivedAt).diff(moment.utc(a.originallyReceivedAt)));

    return (
        <div className='nexus-c-match-right'>
            <BackNavigationByUrl
                title={'Rights Matching Preview'}
                onNavigationClick={navigateToMatchPreview}
            />
            <div className='nexus-c-match-right__matched'>
                <NexusTitle>Matched Rights</NexusTitle>
                <NexusGrid
                    columnDefs={columnDefs}
                    rowData={matchedRightRowData}
                />
            </div>
            <div className='nexus-c-match-right__combined'>
                <NexusTitle>Combined Rights</NexusTitle>
                <NexusGrid
                    columnDefs={columnDefs}
                    rowData={[combinedRight]}
                />
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
    mapping: PropTypes.object,
    fetchFocusedRight: PropTypes.func,
    fetchMatchedRight: PropTypes.func,
    fetchCombinedRight: PropTypes.func,
    saveCombinedRight: PropTypes.func,
    createRightMatchingColumnDefs: PropTypes.func,
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
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const matchedRightSelector = selectors.createMatchedRightSelector();
    const combinedRightSelector = selectors.createCombinedRightSelector();
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();
    return (state, props) => ({
        focusedRight: focusedRightSelector(state, props),
        matchedRight: matchedRightSelector(state, props),
        combinedRight: combinedRightSelector(state, props),
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchAndStoreFocusedRight(payload)),
    fetchMatchedRight: payload => dispatch(fetchMatchedRight(payload)),
    fetchCombinedRight: (focusedRightId, matchedRightId) => dispatch(fetchCombinedRight(focusedRightId, matchedRightId)),
    saveCombinedRight:(focusedRightId, matchedRightId, combinedRight) => dispatch(saveCombinedRight(focusedRightId, matchedRightId, combinedRight)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(MatchRightView); // eslint-disable-line
