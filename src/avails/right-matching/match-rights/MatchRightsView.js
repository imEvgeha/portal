import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './MatchRightsView.scss';
import * as selectors from '../rightMatchingSelectors';
import {
    createRightMatchingColumnDefs,
    fetchCombinedRight,
    fetchFocusedRight,
    fetchMatchedRight,
    saveCombinedRight
} from '../rightMatchingActions';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import BackNavigationByUrl from '../../../ui-elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {URL} from '../../../util/Common';
import moment from 'moment';

function MatchRightView({history, match, focusedRight, matchedRight, combinedRight, fetchFocusedRight, fetchMatchedRight, fetchCombinedRight, createRightMatchingColumnDefs, columnDefs, mapping}) {

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [columnDefs, mapping]);

    useEffect(() => {
        if (match && match.params.rightId && match.params.matchedRightId) {
            fetchFocusedRight(match.params.rightId);
            fetchMatchedRight(match.params.matchedRightId);
            // matchedRightId from url should be correct one.
            fetchCombinedRight(match.params.rightId, match.params.matchedRightId);
        }
    }, match);

    const navigateToMatchPreview = () => {
        const indexToRemove = location.pathname.lastIndexOf('/match/');
        history.push(URL.keepEmbedded(`${location.pathname.substr(0, indexToRemove)}`));
    };

    // Sorted by start field. desc
    const matchedRightRowData = [focusedRight, matchedRight].sort((a,b) => moment.utc(b.start).diff(moment.utc(a.start)));

    return (
        <div className='nexus-c-match-right'>
            <BackNavigationByUrl
                title={'Rights Matching Preview'}
                onNavigationClick={navigateToMatchPreview}
            />
            <div className='nexus-c-match-right-matched'>
                <NexusTitle>Matched Rights</NexusTitle>
                <NexusGrid
                    columnDefs={columnDefs}
                    rowData={matchedRightRowData}
                />
            </div>
            <div className='nexus-c-match-right-combined'>
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
    createRightMatchingColumnDefs: PropTypes.func
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
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
    fetchMatchedRight: payload => dispatch(fetchMatchedRight(payload)),
    fetchCombinedRight: (focusedRightId, matchedRightId) => dispatch(fetchCombinedRight(focusedRightId, matchedRightId)),
    saveCombinedRight:(focusedRightId, matchedRightId, combinedRight) => dispatch(saveCombinedRight(focusedRightId, matchedRightId, combinedRight)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(MatchRightView); // eslint-disable-line