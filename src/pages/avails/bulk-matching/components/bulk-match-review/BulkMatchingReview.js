import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import MatchedCombinedTitlesTable from '../../../matched-combined-titles-table/MatchedCombinedTitlesTable';
import './BulkMatchingReview.scss';
import BonusRightsReview from '../bonus-rights-review/BonusRightsReview';

const BulkMatchingReview = ({combinedTitle, matchedTitles, onDone, bonusRights, existingBonusRights}) => {
    return (
        <div className="nexus-c-bulk-matching-review">
            <div className="nexus-c-bulk-matching-review__matched">Matched Titles</div>
            <MatchedCombinedTitlesTable data={matchedTitles} />
            <div className="nexus-c-bulk-matching-review__combined">Combined Title</div>
            <MatchedCombinedTitlesTable data={combinedTitle} />
            {bonusRights && <BonusRightsReview bonusRights={bonusRights} existingBonusRights={existingBonusRights} />}
            <Button
                label="Done"
                className="p-button-outlined p-button-secondary nexus-c-bulk-matching-review__btn"
                onClick={onDone}
            />
        </div>
    );
};

BulkMatchingReview.propTypes = {
    combinedTitle: PropTypes.array,
    matchedTitles: PropTypes.array,
    onDone: PropTypes.func,
    bonusRights: PropTypes.array,
    existingBonusRights: PropTypes.array,
};

BulkMatchingReview.defaultProps = {
    combinedTitle: [],
    matchedTitles: [],
    onDone: () => null,
    bonusRights: null,
    existingBonusRights: [],
};

export default BulkMatchingReview;
