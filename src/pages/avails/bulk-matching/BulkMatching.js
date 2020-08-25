import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import {get} from 'lodash';
import {connect} from 'react-redux';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import {
    WARNING_TITLE,
    SUCCESS_TITLE,
    WARNING_ICON,
    SUCCESS_ICON,
} from '../../../ui/elements/nexus-toast-notification/constants';
import {toggleRefreshGridData} from '../../../ui/grid/gridActions';
import {TITLE_MATCH_AND_CREATE_WARNING_MESSAGE} from '../../../ui/toast/constants';
import withToasts from '../../../ui/toast/hoc/withToasts';
import TitleSystems from '../../legacy/constants/metadata/systems';
import {titleService} from '../../legacy/containers/metadata/service/TitleService';
import useMatchAndDuplicateList from '../../metadata/legacy-title-reconciliation/hooks/useMatchAndDuplicateList';
import {HEADER_TITLE_BONUS_RIGHT, HEADER_TITLE_TITLE_MATCHING} from '../selected-rights-actions/constants';
import TitleMatchingRightsTable from '../title-matching-rights-table/TitleMatchingRightsTable';
import CreateTitleForm from '../title-matching/components/create-title-form/CreateTitleForm';
import NewTitleConstants from '../title-matching/components/create-title-form/CreateTitleFormConstants';
import {
    getAffectedRights,
    getRestrictedTitles,
    setCoreTitleId,
    getExistingBonusRights,
    createBonusRights,
} from './bulkMatchingService';
import BonusRightsReview from './components/bonus-rights-review/BonusRightsReview';
import BulkMatchingReview from './components/bulk-match-review/BulkMatchingReview';
import HeaderSection from './components/header-section/HeaderSection';
import TitlesSection from './components/titles-section/TitlesSection';
import {
    TITLE_MATCHING_MSG,
    TITLE_MATCHING_REVIEW_HEADER,
    RIGHT_TABS,
    EXISTING_CORE_TITLE_ID_WARNING,
    BONUS_RIGHTS_REVIEW_HEADER,
    TITLE_BULK_MATCH_SUCCESS_MESSAGE,
    TITLE_BONUS_RIGHTS_SUCCESS_MESSAGE,
} from './constants';
import './BulkMatching.scss';

export const BulkMatching = ({
    data,
    closeDrawer,
    addToast,
    removeToast,
    toggleRefreshGridData,
    isBonusRight,
    setHeaderText,
    headerText,
}) => {
    const [selectedTableData, setSelectedTableData] = useState([]);
    const [affectedTableData, setAffectedTableData] = useState([]);
    const [existingBonusRights, setExistingBonusRights] = useState([]);
    const [restrictedCoreTitleIds, setRestrictedCoreTitleIds] = useState([]);
    const [loadTitlesTable, setLoadTitlesTable] = useState(false);
    const [activeTab, setActiveTab] = useState(RIGHT_TABS.SELECTED);
    const [isMatchLoading, setMatchIsLoading] = useState(false);
    const [isMatchAndCreateLoading, setMatchAndCreateIsLoading] = useState(false);
    const [combinedTitle, setCombinedTitle] = useState([]);
    const [matchedTitles, setMatchedTitles] = useState([]);
    const [bonusRights, setBonusRights] = useState([]);

    const selectionList = useMatchAndDuplicateList();
    const {matchList, duplicateList} = selectionList;
    const {setModalContentAndTitle, close} = useContext(NexusModalContext);
    const {NEXUS} = TitleSystems;

    const changeActiveTab = tab => tab !== activeTab && setActiveTab(tab);

    useEffect(() => {
        if (data.length) {
            setSelectedTableData(data);
        }
    }, [data]);

    useEffect(() => {
        if (selectedTableData.length) {
            const rightIds = selectedTableData.map(right => right.id);
            if (isBonusRight) {
                getExistingBonusRights(rightIds).then(({data}) => {
                    setExistingBonusRights(data);
                    setRestrictedCoreTitleIds([selectedTableData[0].coreTitleId]);
                    setLoadTitlesTable(true);
                });
            } else {
                getAffectedRights(rightIds).then(res => {
                    if (Array.isArray(res) && res.length) {
                        setAffectedTableData(res);
                    }
                });
            }
        }
    }, [selectedTableData.length, isBonusRight]);

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
        bulkTitleMatch(matchList[NEXUS].id);
    };

    const bulkTitleMatch = (coreTitleId, isNewTitle = false) => {
        const action = isBonusRight ? createBonusRights : setCoreTitleId;
        const rights = isBonusRight ? selectedTableData : affectedTableData;
        getExistingBonusRights(
            selectedTableData.map(right => right.id),
            coreTitleId
        )
            .then(res => {
                setExistingBonusRights(res.data);
                action({
                    rightIds: rights.map(right => right.id),
                    coreTitleId,
                })
                    .then(response => {
                        setLoadTitlesTable(false);
                        disableLoadingState();
                        dispatchSuccessToast(response.length);
                        setBonusRights(response);
                        if (isNewTitle || matchList[NEXUS]) {
                            setHeaderText(BONUS_RIGHTS_REVIEW_HEADER);
                            toggleRefreshGridData(true);
                            return !isBonusRight && closeDrawer();
                        }
                        //  handle matched titles (ignore updated affected rights from response)
                        const matchedTitlesList = Object.values(matchList);
                        setMatchedTitles(matchedTitlesList);
                        setHeaderText(TITLE_MATCHING_REVIEW_HEADER);
                    })
                    .catch(() => {
                        // nexusFetch handles error toast
                        disableLoadingState();
                    });
            })
            .catch(() => {
                disableLoadingState();
            });
    };

    const mergeTitles = matchList => {
        const extractTitleIds = Object.values(matchList).reduce((acc, curr) => {
            return [...acc, curr.id];
        }, []);
        titleService
            .bulkMergeTitles({
                idsToMerge: extractTitleIds,
                idsToHide: Object.values(duplicateList).map(title => title.id),
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

    const dispatchSuccessToast = count => {
        addToast({
            title: SUCCESS_TITLE,
            description: isBonusRight
                ? TITLE_BONUS_RIGHTS_SUCCESS_MESSAGE(count, selectedTableData.length - count)
                : TITLE_BULK_MATCH_SUCCESS_MESSAGE(affectedTableData.length),
            icon: SUCCESS_ICON,
            isAutoDismiss: true,
            isWithOverlay: false,
        });
    };

    const dispatchWarningToast = () => {
        addToast({
            title: WARNING_TITLE,
            description: TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
            icon: WARNING_ICON,
            actions: [
                {
                    content: 'Cancel',
                    onClick: () => {
                        removeToast();
                        disableLoadingState();
                    },
                },
                {
                    content: 'Ok',
                    onClick: () => {
                        removeToast();
                        mergeTitles(matchList);
                    },
                },
            ],
            isWithOverlay: true,
        });
    };

    const onMatchAndCreateDone = () => {
        toggleRefreshGridData(true);
        closeDrawer();
    };

    const showModal = () => {
        setModalContentAndTitle(
            () => (
                <CreateTitleForm
                    close={close}
                    bulkTitleMatch={bulkTitleMatch}
                    focusedRight={get(selectedTableData, '[0].contentType', '')}
                />
            ),
            NewTitleConstants.NEW_TITLE_MODAL_TITLE
        );
    };

    const getRightsTableData = () => {
        switch (activeTab) {
            case RIGHT_TABS.AFFECTED:
                return affectedTableData;
            case RIGHT_TABS.BONUS_RIGHTS:
                return existingBonusRights;
            default:
                return selectedTableData;
        }
    };

    const hasExistingCoreTitleIds = affectedTableData.some(({coreTitleId}) => coreTitleId);
    const isDisabled = isMatchAndCreateLoading || isMatchLoading;
    return (
        <div className="nexus-c-bulk-matching">
            {(headerText === HEADER_TITLE_TITLE_MATCHING || headerText === HEADER_TITLE_BONUS_RIGHT) && (
                <div>
                    <HeaderSection
                        activeTab={activeTab}
                        affectedRights={affectedTableData.length}
                        changeActiveTab={changeActiveTab}
                        existingBonusRights={existingBonusRights.length}
                        isBonusRight={isBonusRight}
                        isNewTitleDisabled={isDisabled}
                        selectedRights={selectedTableData.length}
                        showModal={showModal}
                    />
                    <TitleMatchingRightsTable data={getRightsTableData()} />
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
                        {hasExistingCoreTitleIds && (
                            <div className="nexus-c-bulk-matching__warning">{EXISTING_CORE_TITLE_ID_WARNING}</div>
                        )}
                    </SectionMessage>
                    <TitlesSection
                        onMatchAndCreate={onMatchAndCreate}
                        isMatchAndCreateLoading={isMatchAndCreateLoading}
                        isMatchLoading={isMatchLoading}
                        contentType={get(selectedTableData, '[0].contentType', '')}
                        restrictedCoreTitleIds={restrictedCoreTitleIds}
                        isTitlesTableLoading={!loadTitlesTable}
                        closeDrawer={closeDrawer}
                        onMatch={onMatch}
                        selectionList={selectionList}
                    />
                </div>
            )}
            {headerText === TITLE_MATCHING_REVIEW_HEADER && (
                <>
                    <BulkMatchingReview
                        combinedTitle={combinedTitle}
                        matchedTitles={matchedTitles}
                        onDone={onMatchAndCreateDone}
                        bonusRights={isBonusRight ? bonusRights : null}
                        existingBonusRights={existingBonusRights}
                    />
                </>
            )}
            {headerText === BONUS_RIGHTS_REVIEW_HEADER && (
                <BonusRightsReview
                    closeDrawer={closeDrawer}
                    bonusRights={bonusRights}
                    existingBonusRights={existingBonusRights}
                />
            )}
        </div>
    );
};

BulkMatching.propTypes = {
    data: PropTypes.array.isRequired,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    closeDrawer: PropTypes.func,
    toggleRefreshGridData: PropTypes.func,
    setHeaderText: PropTypes.func,
    isBonusRight: PropTypes.bool,
    headerText: PropTypes.string,
};

BulkMatching.defaultProps = {
    addToast: () => null,
    removeToast: () => null,
    closeDrawer: () => null,
    toggleRefreshGridData: () => null,
    setHeaderText: () => null,
    isBonusRight: false,
    headerText: '',
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(withToasts(BulkMatching));
