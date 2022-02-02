import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import classNames from 'classnames';
import useRowCountWithGridApiFix from '../../../../../util/hooks/useRowCountWithGridApiFix';
import MatchedCombinedTitlesTable from '../../../matched-combined-titles-table/MatchedCombinedTitlesTable';
import RightsMatchingTitlesTable from '../../../rights-matching-titles-table/RightsMatchingTitlesTable';
import BulkMatchingActionsBar from '../actions-bar/BulkMatchingActionsBar';
import './TitlesSection.scss';

const TitlesSection = ({
    isTitlesTableLoading,
    onMatchAndCreate,
    closeDrawer,
    contentType,
    isMatchLoading,
    isMatchAndCreateLoading,
    onMatch,
    selectionList,
}) => {
    const [titlesTableIsReady, setTitlesTableIsReady] = useState(false);
    const [selectedActive, setSelectedActive] = useState(false);
    const {count: totalCount, setCount: setTotalCount, setApi: setGridApi} = useRowCountWithGridApiFix();

    const {matchList, onCellValueChanged, selectedItems, duplicateButton, matchButton} = selectionList;

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
                        <div className="nexus-c-bulk-matching__titles-table-header-title">
                            Titles ({totalCount === 'One' ? 1 : totalCount})
                        </div>
                        <Button
                            className="nexus-c-bulk-matching__titles-table-selected-btn"
                            onClick={() => setSelectedActive(!selectedActive)}
                            isSelected={selectedActive}
                            isDisabled={isMatchAndCreateLoading || isMatchLoading}
                        >
                            Selected ({selectedItems.length})
                        </Button>
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-bulk-matching__titles-table',
                            !selectedActive && 'nexus-c-bulk-matching__titles-table--active'
                        )}
                    >
                        <RightsMatchingTitlesTable
                            setTotalCount={setTotalCount}
                            setGridApi={setGridApi}
                            contentType={contentType}
                            setTitlesTableIsReady={setTitlesTableIsReady}
                            isDisabled={isMatchAndCreateLoading || isMatchLoading}
                            matchButton={matchButton}
                            duplicateButton={duplicateButton}
                            onCellValueChanged={onCellValueChanged}
                        />
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-bulk-matching__selected-table',
                            selectedActive && 'nexus-c-bulk-matching__selected-table--active'
                        )}
                    >
                        <MatchedCombinedTitlesTable data={selectedItems} />
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
    onMatchAndCreate: PropTypes.func.isRequired,
    onMatch: PropTypes.func,
    closeDrawer: PropTypes.func.isRequired,
    contentType: PropTypes.string,
    selectionList: PropTypes.object.isRequired,
};

TitlesSection.defaultProps = {
    isTitlesTableLoading: false,
    isMatchAndCreateLoading: false,
    isMatchLoading: false,
    contentType: '',
    onMatch: () => null,
};

export default TitlesSection;
