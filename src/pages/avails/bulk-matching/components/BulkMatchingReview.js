import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import MatchedCombinedTitlesTable from '../../matched-combined-titles-table/MatchedCombinedTitlesTable';
import './BulkMatchingReview.scss';

const BulkMatchingReview = ({combinedTitle, matchedTitles, onDone}) => {
    return (
        <div className="nexus-c-bulk-matching-review">
            <div className="nexus-c-bulk-matching-review__matched">
                Matched Titles
            </div>
            <MatchedCombinedTitlesTable data={matchedTitles} />
            <div className="nexus-c-bulk-matching-review__combined">
                Combined Title
            </div>
            <MatchedCombinedTitlesTable data={combinedTitle} />
            <Button
                className="nexus-c-bulk-matching-review__btn"
                onClick={onDone}
                appearance="primary"
            >
                Done
            </Button>
        </div>
    );
};

BulkMatchingReview.propTypes = {
    combinedTitle: PropTypes.array,
    matchedTitles: PropTypes.array,
    onDone: PropTypes.func,
};

BulkMatchingReview.defaultProps = {
    combinedTitle: [],
    matchedTitles: [],
    onDone: () => null,
};

export default BulkMatchingReview;
