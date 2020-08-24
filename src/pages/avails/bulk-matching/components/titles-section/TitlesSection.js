import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import Spinner from '@atlaskit/spinner';
import classNames from 'classnames';
import MatchedCombinedTitlesTable from '../../../matched-combined-titles-table/MatchedCombinedTitlesTable';
import RightsMatchingTitlesTable from '../../../rights-matching-titles-table/RightsMatchingTitlesTable';
import BulkMatchingActionsBar from '../actions-bar/BulkMatchingActionsBar';
import './TitlesSection.scss';

const TitlesSection = ({
    isTitlesTableLoading,
    restrictedCoreTitleIds,
    onMatchAndCreate,
    closeDrawer,
    contentType,
    isMatchLoading,
    isMatchAndCreateLoading,
    onMatch,
    selectionList,
}) => {
    const [titlesTableIsReady, setTitlesTableIsReady] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedActive, setSelectedActive] = useState(false);

    const {matchList, handleMatchClick, duplicateList, handleDuplicateClick} = selectionList;
    const getMatchAndDuplicateItems = () => {
        return [...Object.values(matchList), ...Object.values(duplicateList)];
    };

    return (
        <>
            {!isTitlesTableLoading && (
                <div
                    className={classNames(
                        'nexus-c-bulk-matching__titles-wrapper',
                        titlesTableIsReady && 'nexus-c-bulk-matching__titles-wrapper--is-active'
                    )}
                >
                    <div className="nexus-c-bulk-matching__titles-table-header">
                        <div className="nexus-c-bulk-matching__titles-table-header-title">Titles ({totalCount})</div>
                        <Button
                            className="nexus-c-bulk-matching__titles-table-selected-btn"
                            onClick={() => setSelectedActive(!selectedActive)}
                            isSelected={selectedActive}
                            isDisabled={isMatchAndCreateLoading || isMatchLoading}
                        >
                            Selected ({getMatchAndDuplicateItems().length})
                        </Button>
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-bulk-matching__titles-table',
                            !selectedActive && 'nexus-c-bulk-matching__titles-table--active'
                        )}
                    >
                        <RightsMatchingTitlesTable
                            restrictedCoreTitleIds={restrictedCoreTitleIds}
                            setTotalCount={setTotalCount}
                            contentType={contentType}
                            matchList={matchList}
                            handleMatchClick={handleMatchClick}
                            handleDuplicateClick={handleDuplicateClick}
                            duplicateList={duplicateList}
                            setTitlesTableIsReady={setTitlesTableIsReady}
                            isDisabled={isMatchAndCreateLoading || isMatchLoading}
                        />
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-bulk-matching__selected-table',
                            selectedActive && 'nexus-c-bulk-matching__selected-table--active'
                        )}
                    >
                        <MatchedCombinedTitlesTable data={getMatchAndDuplicateItems()} />
                    </div>
                    <BulkMatchingActionsBar
                        matchList={matchList}
                        onMatch={onMatch}
                        onMatchAndCreate={onMatchAndCreate}
                        onCancel={closeDrawer}
                        isMatchLoading={isMatchLoading}
                        isMatchAndCreateLoading={isMatchAndCreateLoading}
                    />
                </div>
            )}
            {isTitlesTableLoading && (
                <div className="nexus-c-bulk-matching__spinner">
                    <Spinner size="large" />
                </div>
            )}
        </>
    );
};

TitlesSection.propTypes = {
    isTitlesTableLoading: PropTypes.bool,
    isMatchAndCreateLoading: PropTypes.bool,
    isMatchLoading: PropTypes.bool,
    restrictedCoreTitleIds: PropTypes.array,
    onMatchAndCreate: PropTypes.func.isRequired,
    onMatch: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func.isRequired,
    contentType: PropTypes.string,
    selectionList: PropTypes.object.isRequired,
};

TitlesSection.defaultProps = {
    isTitlesTableLoading: false,
    isMatchAndCreateLoading: false,
    isMatchLoading: false,
    restrictedCoreTitleIds: [],
    contentType: '',
};

export default TitlesSection;
