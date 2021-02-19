import React, {useState, useEffect, useContext, useRef} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import withMatchAndDuplicateList from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withMatchAndDuplicateList';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {
    WARNING_TITLE,
    SUCCESS_TITLE,
    WARNING_ICON,
    SUCCESS_ICON,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {TITLE_MATCH_AND_CREATE_WARNING_MESSAGE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import {get} from 'lodash';
import {connect} from 'react-redux';
import {compose} from 'redux';
import TitleSystems from '../../legacy/constants/metadata/systems';
import {titleService} from '../../legacy/containers/metadata/service/TitleService';
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
    matchButton,
    duplicateButton,
    onCellValueChanged,
    matchList,
    duplicateList,
    selectedItems,
    getRestrictedIds,
}) => {
    const isMounted = useRef(true);
    const [selectedTableData, setSelectedTableData] = useState([]);
    const [affectedTableData, setAffectedTableData] = useState([]);
    const [existingBonusRights, setExistingBonusRights] = useState([]);
    const [restrictedCoreTitleIds, setRestrictedCoreTitleIds] = useState([]);
    const [loadTitlesTable, setLoadTitlesTable] = useState(false);
    const [activeTab, setActiveTab] = useState(RIGHT_TABS.SELECTED);
    const [isMatchLoading, setMatchIsLoading] = useState(false);
    const [isMatchAndCreateLoading, setMatchAndCreateIsLoading] = useState(false);
    const [combinedTitle, setCombinedTitle] = useState([]);
    const [bonusRights, setBonusRights] = useState([]);

    const {openModal, closeModal} = useContext(NexusModalContext);
    const {NEXUS} = TitleSystems;

    const changeActiveTab = tab => tab !== activeTab && setActiveTab(tab);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => getRestrictedIds(restrictedCoreTitleIds), [restrictedCoreTitleIds]);

    useEffect(() => {
        if (isMounted.current && data.length) {
            setSelectedTableData(data);
        }
    }, [data]);

    useEffect(() => {
        if (selectedTableData.length) {
            const rightIds = selectedTableData.map(right => right.id);
            if (isBonusRight) {
                getExistingBonusRights(rightIds).then(({data}) => {
                    if (isMounted.current) {
                        setExistingBonusRights(data);
                        setRestrictedCoreTitleIds([selectedTableData[0].coreTitleId]);
                        setLoadTitlesTable(true);
                    }
                });
            } else {
                getAffectedRights(rightIds).then(res => {
                    if (isMounted.current && Array.isArray(res) && res.length) {
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
                if (isMounted.current && Array.isArray(res) && res.length) {
                    setRestrictedCoreTitleIds(res);
                }
                isMounted.current && setLoadTitlesTable(true);
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
        openModal(
            <CreateTitleForm
                close={closeModal}
                bulkTitleMatch={bulkTitleMatch}
                focusedRight={{contentType: get(selectedTableData, '[0].contentType', '')}}
            />,
            {title: NewTitleConstants.NEW_TITLE_MODAL_TITLE}
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
                        selectionList={{matchList, onCellValueChanged, selectedItems, matchButton, duplicateButton}}
                    />
                </div>
            )}
            {headerText === TITLE_MATCHING_REVIEW_HEADER && (
                <>
                    <BulkMatchingReview
                        combinedTitle={combinedTitle}
                        matchedTitles={Object.values(matchList)}
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
    onCellValueChanged: PropTypes.func,
    matchButton: PropTypes.object,
    duplicateButton: PropTypes.object,
    selectedItems: PropTypes.array,
    getRestrictedIds: PropTypes.func,
    matchList: PropTypes.object,
    duplicateList: PropTypes.object,
};

BulkMatching.defaultProps = {
    addToast: () => null,
    removeToast: () => null,
    closeDrawer: () => null,
    toggleRefreshGridData: () => null,
    setHeaderText: () => null,
    isBonusRight: false,
    headerText: '',
    onCellValueChanged: () => null,
    matchButton: {},
    duplicateButton: {},
    selectedItems: [],
    getRestrictedIds: () => null,
    matchList: {},
    duplicateList: {},
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(withToasts(compose(withMatchAndDuplicateList())(BulkMatching)));
