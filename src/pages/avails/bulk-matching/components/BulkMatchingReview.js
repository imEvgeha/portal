import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import TitleMatchingRightsTable from '../../title-matching-rights-table/TitleMatchingRightsTable';
import './BulkMatchingReview.scss';

const BulkMatchingReview = ({combinedTitle, matchedTitles}) => {
    return (
        <div className="nexus-c-bulk-matching-review">
            <div className="nexus-c-bulk-matching-review__matched">
                Matched Titles
            </div>
            <TitleMatchingRightsTable data={matchedTitles} />
            <div className="nexus-c-bulk-matching-review__combined">
                Combined Title
            </div>
            <TitleMatchingRightsTable data={combinedTitle} />
            <Button
                className="nexus-c-bulk-matching-review__btn"
                onClick={() => null}
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
};

BulkMatchingReview.defaultProps = {
    combinedTitle: [],
    matchedTitles: [],
};

export default BulkMatchingReview;
