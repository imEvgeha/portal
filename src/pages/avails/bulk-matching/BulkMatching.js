import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import classNames from 'classnames';
import {getAffectedRights, getRestrictedTitles, setCoreTitleId} from '../availsService';
import {titleService} from '../../legacy/containers/metadata/service/TitleService';
import withToasts from '../../../ui/toast/hoc/withToasts';
import useMatchAndDuplicateList from '../../metadata/legacy-title-reconciliation/hooks/useMatchAndDuplicateList';
import TitleMatchingRightsTable from '../title-matching-rights-table/TitleMatchingRightsTable';
import RightsMatchingTitlesTable from '../rights-matching-titles-table/RightsMatchingTitlesTable';
import BulkMatchingActionsBar from './components/BulkMatchingActionsBar';
import BulkMatchingReview from './components/BulkMatchingReview';
import {TITLE_MATCHING_MSG, TITLE_MATCHING_REVIEW_HEADER} from './constants';
import {getDomainName} from '../../../util/Common';
import TitleSystems from '../../legacy/constants/metadata/systems';
import {
    WARNING_TITLE,
    SUCCESS_TITLE,
    ERROR_TITLE,
    WARNING_ICON,
    ERROR_ICON,
    SUCCESS_ICON,
    TITLE_MATCH_ERROR_MESSAGE,
    TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
} from '../../../ui/elements/nexus-toast-notification/constants';
import {
    TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
    TITLE_MATCH_SUCCESS_MESSAGE,
} from '../../../ui/toast/constants';
import './BulkMatching.scss';

export const BulkMatching = ({data, headerTitle, closeDrawer, addToast, removeToast}) => {
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
    const [matchIsLoading, setMatchIsLoading] = useState(false);
    const [matchAndCreateIsLoading, setMatchAndCreateIsLoading] = useState(false);
    const [combinedTitle, setCombinedTitle] = useState([]);
    const [matchedTitles, setMatchedTitles] = useState([]);

    const {matchList, handleMatchClick, duplicateList, handleDuplicateClick} = useMatchAndDuplicateList();
    const {NEXUS, MOVIDA, VZ} = TitleSystems;

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

    const goToTitleDetailsPage = url => window.open(url, '_blank');

    const onMatch = () => {
        setMatchIsLoading(true);
        const url = `${getDomainName()}/metadata/detail/${matchList[NEXUS].id}`;
        const coreTitleId = matchList[NEXUS].id;
        bulkTitleMatch(coreTitleId, url);
    };

    const bulkTitleMatch = (coreTitleId, url) => {
        setCoreTitleId({
            rightIds: mergeRightIds(affectedRightIds, duplicateList),
            coreTitleId,
        }).then(res => {
            if (Array.isArray(res) && res.length) {
                //  handle matched titles
                setMatchedTitles(res);
            }
            addToast({
                title: SUCCESS_TITLE,
                description: TITLE_MATCH_SUCCESS_MESSAGE,
                icon: SUCCESS_ICON,
                actions: [
                    {content: 'View Title', onClick: () => goToTitleDetailsPage(url)},
                ],
                isWithOverlay: true,
            });
            setMatchIsLoading(false);
            setMatchAndCreateIsLoading(false);
            setLoadTitlesTable(false);
            setHeaderText(TITLE_MATCHING_REVIEW_HEADER);
        })
            .catch(err => {
                const {message = TITLE_MATCH_ERROR_MESSAGE} = err.message || {};
                addToast({
                    title: ERROR_TITLE,
                    description: message || TITLE_MATCH_ERROR_MESSAGE,
                    icon: ERROR_ICON,
                    actions: [
                        {content: 'Ok', onClick: () => removeToast()},
                    ],
                    isWithOverlay: true,
                });
                setMatchIsLoading(false);
                setMatchAndCreateIsLoading(false);
            });
    };

    const mergeRightIds = (affectedRightIds, duplicateList) => {
        const extractDuplicates = Object.keys(duplicateList).map(key => key);
        return [...affectedRightIds, ...extractDuplicates];
    };

    const mergeSingle = () => {
        removeToast();
        mergeTitles(matchList);
    };

    const mergeTitles = matchList => {
        const extractTitleIds = Object.values(matchList).reduce((acc, curr) => {
            return [...acc, curr.id];
        }, []);
        titleService.bulkMergeTitles({
            idsToMerge: extractTitleIds,
            idsToHide: mergeRightIds([], duplicateList),
        }).then(res => {
            setCombinedTitle([...combinedTitle, res]);
            const {id} = res || {};
            const url = `${getDomainName()}/metadata/detail/${id}`;
            bulkTitleMatch(id, url);
        })
            .catch(err => {
                const {message = TITLE_MATCH_AND_CREATE_ERROR_MESSAGE} = err.message || {};
                addToast({
                    title: ERROR_TITLE,
                    description: message || TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
                    icon: ERROR_ICON,
                    actions: [
                        {content: 'Ok', onClick: () => removeToast()},
                    ],
                    isWithOverlay: true,
                });
                setMatchAndCreateIsLoading(false);
            });
    };

    const onMatchAndCreate = () => {
        setMatchAndCreateIsLoading(true);
        if (Object.keys(matchList).length === 1) {
            addToast({
                title: WARNING_TITLE,
                description: TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
                icon: WARNING_ICON,
                actions: [
                    {content: 'Cancel', onClick: () => removeToast()},
                    {content: 'Ok', onClick: mergeSingle},
                ],
                isWithOverlay: true,
            });
        } else {
            mergeTitles(matchList);
        }
    };

    const onCancel = () => {
        closeDrawer();
    };

    const isSummaryReady = () => {
        return !loadTitlesTable && (combinedTitle.length || matchedTitles.length);
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
                    <Button className="nexus-c-bulk-matching__btn" onClick={() => null}>
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
                    <Button spacing="none" appearance="link">New Title</Button>
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
                            onClick={() => null}
                        >
                            Selected(0)
                        </Button>
                    </div>
                    <RightsMatchingTitlesTable
                        restrictedCoreTitleIds={restrictedCoreTitleIds}
                        setTotalCount={setTotalCount}
                        contentType={contentType}
                        matchList={matchList}
                        handleMatchClick={handleMatchClick}
                        handleDuplicateClick={handleDuplicateClick}
                        duplicateList={duplicateList}
                        setTitlesTableIsReady={setTitlesTableIsReady}
                    />
                    <BulkMatchingActionsBar
                        matchList={matchList}
                        onMatch={onMatch}
                        onMatchAndCreate={onMatchAndCreate}
                        onCancel={onCancel}
                        matchIsLoading={matchIsLoading}
                        matchAndCreateIsLoading={matchAndCreateIsLoading}
                    />
                </div>
            )}
            {!loadTitlesTable && !isSummaryReady() && (
                <div className="nexus-c-bulk-matching__spinner">
                    <Spinner size="large" />
                </div>
            )}
            {isSummaryReady() && (
                <BulkMatchingReview combinedTitle={combinedTitle} matchedTitles={matchedTitles} />
            )}
        </div>
    );
};

BulkMatching.propTypes = {
    data: PropTypes.array.isRequired,
    headerTitle: PropTypes.string,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    closeDrawer: PropTypes.func,
};

BulkMatching.defaultProps = {
    headerTitle: '',
    addToast: () => null,
    removeToast: () => null,
    closeDrawer: () => null,
};

export default withToasts(BulkMatching);
