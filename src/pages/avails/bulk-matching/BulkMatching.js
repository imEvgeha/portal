import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import {getAffectedRights, getRestrictedTitles, setCoreTitleId} from '../availsService';
import {titleService} from '../../legacy/containers/metadata/service/TitleService';
import withToasts from '../../../ui/toast/hoc/withToasts';
import {toggleRefreshGridData} from '../../../ui/grid/gridActions';
import useMatchAndDuplicateList from '../../metadata/legacy-title-reconciliation/hooks/useMatchAndDuplicateList';
import TitleMatchingRightsTable from '../title-matching-rights-table/TitleMatchingRightsTable';
import RightsMatchingTitlesTable from '../rights-matching-titles-table/RightsMatchingTitlesTable';
import MatchedCombinedTitlesTable from '../matched-combined-titles-table/MatchedCombinedTitlesTable';
import BulkMatchingActionsBar from './components/BulkMatchingActionsBar';
import BulkMatchingReview from './components/BulkMatchingReview';
import {TITLE_MATCHING_MSG, TITLE_MATCHING_REVIEW_HEADER} from './constants';
import TitleSystems from '../../legacy/constants/metadata/systems';
import CreateTitleForm from '../title-matching/components/create-title-form/CreateTitleForm';
import NewTitleConstants from '../title-matching/components/create-title-form/CreateTitleFormConstants';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import {
    WARNING_TITLE,
    SUCCESS_TITLE,
    WARNING_ICON,
    SUCCESS_ICON,
} from '../../../ui/elements/nexus-toast-notification/constants';
import {
    TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
    TITLE_BULK_MATCH_SUCCESS_MESSAGE,
} from '../../../ui/toast/constants';
import './BulkMatching.scss';

export const BulkMatching = ({data, headerTitle, closeDrawer, addToast, removeToast, toggleRefreshGridData}) => {
    const [selectedTableData, setSelectedTableData] = useState([]);
    const [affectedTableData, setAffectedTableData] = useState([]);
    const [headerText, setHeaderText] = useState(headerTitle);
    const [affectedRightIds, setAffectedRightIds] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [restrictedCoreTitleIds, setRestrictedCoreTitleIds] = useState([]);
    const [loadTitlesTable, setLoadTitlesTable] = useState(false);
    const [activeTab, setActiveTab] = useState(false);
    const [titlesTableIsReady, setTitlesTableIsReady] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [isMatchLoading, setMatchIsLoading] = useState(false);
    const [isMatchAndCreateLoading, setMatchAndCreateIsLoading] = useState(false);
    const [combinedTitle, setCombinedTitle] = useState([]);
    const [matchedTitles, setMatchedTitles] = useState([]);
    const [selectedActive, setSelectedActive] = useState(false);

    const {matchList, handleMatchClick, duplicateList, handleDuplicateClick} = useMatchAndDuplicateList();
    const {setModalContentAndTitle, close} = useContext(NexusModalContext);
    const {NEXUS} = TitleSystems;

    const changeActiveTab = () => {
        setActiveTab(!activeTab);
    };

    useEffect(() => {
        if (data.length) {
            setSelectedTableData(data);
            const {contentType} = data[0] || {};
            setContentType(contentType);
        }
    }, [data]);

    useEffect(() => {
        if (selectedTableData.length) {
            const rightIds = selectedTableData.map(right => right.id);
            setAffectedRightIds(rightIds);
            getAffectedRights(rightIds).then(res => {
                if (Array.isArray(res) && res.length) {
                    setAffectedTableData(res);
                }
            });
        }
    }, [selectedTableData]);

    useEffect(() => {
        if (affectedTableData.length) {
            const affectedRightIds = affectedTableData.map(right => right.id);

            getRestrictedTitles(affectedRightIds).then(res => {
                if (Array.isArray(res) && res.length) {
                    setRestrictedCoreTitleIds(res);
                }
                setLoadTitlesTable(true);
            });
        }
    }, [affectedTableData]);

    const onMatch = () => {
        setMatchIsLoading(true);
        const coreTitleId = matchList[NEXUS].id;
        bulkTitleMatch(coreTitleId);
    };

    const bulkTitleMatch = coreTitleId => {
        setCoreTitleId({
            rightIds: affectedRightIds,
            coreTitleId,
        })
            .then(() => {
                //  handle matched titles (ignore updated affected rights from response)
                const matchedTitlesList = Object.values(matchList);
                setMatchedTitles(matchedTitlesList);

                if (matchList[NEXUS]) {
                    dispatchSuccessToast();
                    toggleRefreshGridData(true);
                    return onCancel();
                }
                disableLoadingState();
                setLoadTitlesTable(false);
                setHeaderText(TITLE_MATCHING_REVIEW_HEADER);
            })
            .catch(() => {
                // nexusFetch handles error toast
                disableLoadingState();
            });
    };

    const mergeRightIds = (affectedRightIds, duplicateList) => {
        const extractDuplicates = Object.keys(duplicateList);
        return [...affectedRightIds, ...extractDuplicates];
    };

    const mergeTitles = matchList => {
        const extractTitleIds = Object.values(matchList).reduce((acc, curr) => {
            return [...acc, curr.id];
        }, []);
        titleService.bulkMergeTitles({
            idsToMerge: extractTitleIds,
            idsToHide: mergeRightIds([], duplicateList),
        })
            .then(res => {
                setCombinedTitle([...combinedTitle, res]);
                const {id} = res || {};
                bulkTitleMatch(id);
            })
            .catch(() => {
                // nexusFetch handles error toast
                setMatchAndCreateIsLoading(false);
            });
    };

    const onMatchAndCreate = () => {
        setMatchAndCreateIsLoading(true);
        if (Object.keys(matchList).length === 1) {
            dispatchWarningToast();
        } else {
            mergeTitles(matchList);
        }
    };

    const disableLoadingState = () => {
        setMatchIsLoading(false);
        setMatchAndCreateIsLoading(false);
    };

    const getMatchAndDuplicateItems = () => {
        return [...Object.values(matchList), ...Object.values(duplicateList)];
    };

    const dispatchSuccessToast = () => {
        addToast({
            title: SUCCESS_TITLE,
            description: TITLE_BULK_MATCH_SUCCESS_MESSAGE(selectedTableData.length),
            icon: SUCCESS_ICON,
            isAutoDismiss: true,
            isWithOverlay: true,
        });
    };

    const dispatchWarningToast = () => {
        addToast({
            title: WARNING_TITLE,
            description: TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
            icon: WARNING_ICON,
            actions: [
                {content: 'Cancel',
                    onClick: () => {
                        removeToast();
                        disableLoadingState();
                    }},
                {content: 'Ok',
                    onClick: () => {
                        removeToast();
                        mergeTitles(matchList);
                    }},
            ],
            isWithOverlay: true,
        });
    };

    const onMatchAndCreateDone = () => {
        dispatchSuccessToast();
        toggleRefreshGridData(true);
        closeDrawer();
    };

    const onCancel = () => {
        closeDrawer();
    };

    const isSummaryReady = () => {
        return !loadTitlesTable && (combinedTitle.length || matchedTitles.length);
    };

    const closeModal = () => {
        close();
        toggleRefreshGridData(true);
    };

    const showModal = () => {
        setModalContentAndTitle(
            () => (
                <CreateTitleForm
                    close={closeModal}
                    bulkTitleMatch={bulkTitleMatch}
                    affectedRightIds={affectedRightIds}
                    focusedRight={{contentType}}
                    onSuccess={closeDrawer}
                />
            ),
            NewTitleConstants.NEW_TITLE_MODAL_TITLE
        );
    };

    return (
        <div className="nexus-c-bulk-matching">
            <h2>{headerText}</h2>
            <div className="nexus-c-bulk-matching__header">
                <div
                    className={classNames(
                        'nexus-c-bulk-matching__selected',
                        !activeTab && 'nexus-c-bulk-matching__selected--active'
                    )}
                    onClick={activeTab ? changeActiveTab : null}
                >
                    Selected Rights ({selectedTableData.length})
                </div>
                <div
                    className={classNames(
                        'nexus-c-bulk-matching__affected',
                        activeTab && 'nexus-c-bulk-matching__affected--active'
                    )}
                    onClick={!activeTab ? changeActiveTab : null}
                >
                    Affected Rights ({affectedTableData.length})
                </div>
                {!isSummaryReady() && (
                    <Button
                        className="nexus-c-bulk-matching__btn"
                        onClick={showModal}
                        isDisabled={isMatchAndCreateLoading || isMatchLoading}
                    >
                        New Title
                    </Button>
                )}
            </div>
            <TitleMatchingRightsTable
                data={activeTab ? affectedTableData : selectedTableData}
            />
            {!isSummaryReady() && (
                <SectionMessage>
                    {TITLE_MATCHING_MSG}
                    <Button
                        spacing="none"
                        appearance="link"
                        onClick={showModal}
                        isDisabled={isMatchAndCreateLoading || isMatchLoading}
                    >
                        New Title
                    </Button>
                </SectionMessage>
            )}
            {loadTitlesTable && (
                <div
                    className={classNames(
                        'nexus-c-bulk-matching__titles-wrapper',
                        titlesTableIsReady && 'nexus-c-bulk-matching__titles-wrapper--is-active'
                    )}
                >
                    <div className="nexus-c-bulk-matching__titles-table-header">
                        <div className="nexus-c-bulk-matching__titles-table-header-title">
                            Titles ({totalCount})
                        </div>
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
                        onCancel={onCancel}
                        isMatchLoading={isMatchLoading}
                        isMatchAndCreateLoading={isMatchAndCreateLoading}
                    />
                </div>
            )}
            {!loadTitlesTable && !isSummaryReady() && (
                <div className="nexus-c-bulk-matching__spinner">
                    <Spinner size="large" />
                </div>
            )}
            {isSummaryReady() ? (
                <BulkMatchingReview
                    combinedTitle={combinedTitle}
                    matchedTitles={matchedTitles}
                    onDone={onMatchAndCreateDone}
                />
            ) : null}
        </div>
    );
};

BulkMatching.propTypes = {
    data: PropTypes.array.isRequired,
    headerTitle: PropTypes.string,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    closeDrawer: PropTypes.func,
    toggleRefreshGridData: PropTypes.func,
};

BulkMatching.defaultProps = {
    headerTitle: '',
    addToast: () => null,
    removeToast: () => null,
    closeDrawer: () => null,
    toggleRefreshGridData: () => null,
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(withToasts(BulkMatching));
