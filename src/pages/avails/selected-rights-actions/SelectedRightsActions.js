import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import MoreIcon from '@vubiquity-nexus/portal-assets/more-icon.svg';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {SUCCESS_ICON} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import {Can} from '@vubiquity-nexus/portal-utils/lib/ability';
import classNames from 'classnames';
import {get, uniqBy, isEmpty} from 'lodash';
import {connect} from 'react-redux';
import AuditHistory from '../../legacy/containers/avail/dashboard/AuditHistory';
import NexusBulkDelete from '../bulk-delete/NexusBulkDelete';
import BulkDeleteConfirmation from '../bulk-delete/components/bulk-delete-confirmation/BulkDeleteConfirmation';
import BulkMatching from '../bulk-matching/BulkMatching';
import {getAffectedRights, setCoreTitleId} from '../bulk-matching/bulkMatchingService';
import BulkUnmatch from '../bulk-unmatch/BulkUnmatch';
import {BULK_UNMATCH_CANCEL_BTN, BULK_UNMATCH_CONFIRM_BTN, BULK_UNMATCH_TITLE} from '../bulk-unmatch/constants';
import {
    getEligibleRights,
    hasAtLeastOneUnselectedTerritory,
    filterOutUnselectedTerritories,
    isEndDateExpired,
} from '../menu-actions/actions';
import StatusCheck from '../rights-repository/components/status-check/StatusCheck';
import {PRE_PLAN_TAB, RIGHTS_TAB} from '../rights-repository/constants';
import {getLinkedRights, clearLinkedRights, bulkDeleteRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import {
    BULK_MATCH,
    BULK_MATCH_DISABLED_TOOLTIP,
    BULK_UNMATCH,
    BULK_UNMATCH_DISABLED_TOOLTIP,
    CREATE_BONUS_RIGHT_TOOLTIP,
    CREATE_BONUS_RIGHT,
    HEADER_TITLE_BONUS_RIGHT,
    HEADER_TITLE_TITLE_MATCHING,
    ADD_TO_PREPLAN,
    PREPLAN_TOOLTIP,
    STATUS_CHECK_HEADER,
    VIEW_AUDIT_HISTORY,
    BULK_DELETE_TOOLTIP,
    BULK_DELETE_TOOLTIP_SFP,
    MARK_DELETED,
    BULK_DELETE_HEADER,
    BULK_UNMATCH_SUCCESS_TOAST,
} from './constants';
import './SelectedRightsActions.scss';

export const SelectedRightsActions = ({
    selectedRights,
    addToast,
    removeToast,
    toggleRefreshGridData,
    selectedRightGridApi,
    gridApi,
    setSelectedRights,
    setPrePlanRepoRights,
    activeTab,
    singleRightMatch,
    setSingleRightMatch,
    rightsWithDeps,
    getLinkedRights,
    clearLinkedRights,
    bulkDeleteRights,
    deletedRightsCount,
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const [isMatchable, setIsMatchable] = useState(false);
    const [isUnmatchable, setIsUnmatchable] = useState(false);
    const [isBonusRightCreatable, setIsBonusRightCreatable] = useState(false);
    const [isPreplanEligible, setIsPreplanEligible] = useState(false);
    const [isDeletable, setIsDeletable] = useState(false);
    const [statusDeleteMerged, setStatusDeleteMerged] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isBonusRight, setIsBonusRight] = useState(false);
    const [headerText, setHeaderText] = useState('');
    const [isSelectedForPlanning, setIsSelectedForPlanning] = useState(false);
    const node = useRef();

    const {openModal, closeModal} = useContext(NexusModalContext);

    useEffect(() => {
        window.addEventListener('click', removeMenu);

        return () => {
            clearLinkedRights();
            window.removeEventListener('click', removeMenu);
        };
    }, []);

    useEffect(() => {
        if (activeTab === RIGHTS_TAB) {
            toggleRefreshGridData(true);
        }
    }, [activeTab]);

    // All the rights have empty SourceRightId or all the rights have uniq SourceRightId
    const checkSourceRightIds = () => {
        const hasEmptySourceRightIds = selectedRights.every(({sourceRightId}) => !sourceRightId);
        const hasUniqueSourceRightIds =
            selectedRights.every(({sourceRightId}) => !!sourceRightId && sourceRightId !== '') &&
            selectedRights.length === uniqBy(selectedRights, 'sourceRightId').length;
        return hasEmptySourceRightIds || hasUniqueSourceRightIds;
    };

    // None of the rights has status 'Deleted' and no territories with selected status (no rights are selected for planning)
    const checkRightDeletionCriteria = () =>
        selectedRights.every(
            ({status, territory = []}) =>
                !['Deleted', 'Merged'].includes(status) && territory.filter(item => item.selected).length === 0
        );

    // At least one of the selected rights has status 'Deleted' or 'Merged'
    const checkStatusDeleteMerged = () =>
        selectedRights.some(({status}) => status === 'Deleted' || status === 'Merged');

    const checkIsSelectedForPlanning = () =>
        selectedRights.some(({territory = []}) => territory.filter(item => item.selected).length > 0);

    // All the rights have Same CoreTitleIds And Empty SourceRightId And Licensed And Ready Or ReadyNew Status
    const checkBonusRightCreateCriteria = () => {
        return selectedRights.every(
            ({coreTitleId, sourceRightId, licensed, status, updatedCatalogReceived, temporaryPriceReduction}) =>
                licensed &&
                !!coreTitleId &&
                coreTitleId === get(selectedRights, '[0].coreTitleId', '') &&
                !sourceRightId &&
                !updatedCatalogReceived &&
                ['ReadyNew', 'Ready'].includes(status) &&
                !temporaryPriceReduction
        );
    };

    const checkPrePlanEligibilityCriteria = () => {
        return selectedRights.every(
            ({rightStatus, licensed, status, territory, temporaryPriceReduction, end}) =>
                licensed &&
                ['Pending', 'Confirmed', 'Tentative'].includes(rightStatus) &&
                ['ReadyNew', 'Ready'].includes(status) &&
                hasAtLeastOneUnselectedTerritory(territory) &&
                !temporaryPriceReduction &&
                !isEndDateExpired(end)
        );
    };

    // All the rights have Empty CoreTitleIds and SameContentType
    const haveEmptyCoreTitleIdsSameContentType = () => {
        return selectedRights.every(
            ({coreTitleId, contentType}) => !coreTitleId && contentType === selectedRights[0].contentType
        );
    };

    // All the rights have CoreTitleIds
    const haveCoreTitleIds = () => {
        return selectedRights.every(({coreTitleId}) => !!coreTitleId);
    };

    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeMenu = e => {
        if (!node.current.contains(e.target)) {
            setMenuOpened(false);
        }
    };

    const openDrawer = () => {
        setMenuOpened(false);
        setDrawerOpen(true);
        setHeaderText(HEADER_TITLE_TITLE_MATCHING);
    };

    const closeDrawer = () => {
        singleRightMatch.length && setSingleRightMatch([]);
        setDrawerOpen(false);
        setIsBonusRight(false);
    };

    const unMatchHandler = useCallback(
        rightIds => {
            setCoreTitleId({rightIds}).then(unmatchedRights => {
                // Fetch fresh data from back-end
                toggleRefreshGridData(true);

                // Response is returning updated rights, so we can feed that to SelectedRights table
                selectedRightGridApi.setRowData(unmatchedRights.filter(right => selectedRights.includes(right.id)));
                // Refresh changes
                selectedRightGridApi.refreshCells();

                // Close modal
                closeModal();

                // Show success toast
                addToast({
                    title: BULK_UNMATCH_SUCCESS_TOAST,
                    description: `You have successfully unmatched ${unmatchedRights.length} right(s).
                         Please validate title fields.`,
                    icon: SUCCESS_ICON,
                    isAutoDismiss: true,
                });
            });
        },
        [addToast, selectedRightGridApi, selectedRights, toggleRefreshGridData]
    );

    const openBulkUnmatchModal = () => {
        setMenuOpened(false);
        const selectedRightsIds = selectedRights.map(({id}) => id);
        getAffectedRights(selectedRightsIds).then(rights => {
            const actions = [
                {
                    text: BULK_UNMATCH_CANCEL_BTN,
                    onClick: () => {
                        closeModal();
                        removeToast();
                    },
                    appearance: 'default',
                },
                {
                    text: BULK_UNMATCH_CONFIRM_BTN,
                    onClick: () => unMatchHandler(rights.map(right => right.id)),
                    appearance: 'primary',
                },
            ];
            openModal(<BulkUnmatch selectedRights={selectedRightsIds} affectedRights={rights} />, {
                title: BULK_UNMATCH_TITLE,
                width: 'x-large',
                actions,
            });
        });
    };

    const closeModalAndClearDependentRights = () => {
        closeModal();
        clearLinkedRights();
    };

    const bulkDeleteSelectedAffectedRights = rightsWithDeps => {
        let selectedRightIds = [];
        let impactedRightIds = [];
        Object.values(rightsWithDeps)
            .filter(item => item.isSelected)
            .forEach(item => {
                selectedRightIds = [...selectedRightIds, item.original.id];
                impactedRightIds = [...impactedRightIds, ...item.dependencies.map(right => right.id)];
            });
        bulkDeleteRights({selectedRightIds, impactedRightIds, closeModal, toggleRefreshGridData});
    };

    const openDeleteConfirmationModal = () => {
        setMenuOpened(false);
        openModal(
            <BulkDeleteConfirmation
                onSubmit={() => getLinkedRights({rights: selectedRights, closeModal, toggleRefreshGridData})}
                onClose={closeModalAndClearDependentRights}
                rightsCount={selectedRights.length}
            />,
            {
                title: BULK_DELETE_HEADER,
                width: 'small',
            }
        );
    };

    const openBulkDeleteModal = useCallback((rightsWithDeps, deletedRightsCount) => {
        openModal(
            <NexusBulkDelete
                rightsWithDeps={rightsWithDeps}
                onClose={closeModalAndClearDependentRights}
                onSubmit={bulkDeleteSelectedAffectedRights}
                deletedRightsCount={deletedRightsCount}
            />,
            {
                title: BULK_DELETE_HEADER,
                width: 'x-large',
            }
        );
    }, []);

    const openAuditHistoryModal = () => {
        setMenuOpened(false);
        const title = `Audit History (${selectedRights.length})`;

        const actions = [
            {
                text: 'Done',
                onClick: closeModal,
            },
        ];
        openModal(<AuditHistory selectedRights={selectedRights} />, {title, width: '100%', actions});
    };

    const onCloseStatusCheckModal = () => {
        gridApi.deselectAll();
        toggleRefreshGridData(true);
        closeModal();
    };

    const prepareRightsForPrePlan = () => {
        setMenuOpened(false);
        if (isPreplanEligible) {
            // move to pre-plan, clear selectedRights
            setPrePlanRepoRights(filterOutUnselectedTerritories(selectedRights));
            gridApi.deselectAll();
            setSelectedRights([]);
            toggleRefreshGridData(true);
            return;
        }

        const [eligibleRights, nonEligibleRights] = getEligibleRights(selectedRights);

        setSelectedRights(nonEligibleRights);
        setPrePlanRepoRights(filterOutUnselectedTerritories(eligibleRights));
        openModal(<StatusCheck nonEligibleTitles={nonEligibleRights} onClose={onCloseStatusCheckModal} />, {
            title: STATUS_CHECK_HEADER,
            width: 'large',
        });
    };

    const createBonusRights = () => {
        setMenuOpened(false);
        setIsBonusRight(true);
        setHeaderText(HEADER_TITLE_BONUS_RIGHT);
        setDrawerOpen(true);
    };

    // Check the criteria for enabling specific actions
    useEffect(() => {
        if (selectedRights.length) {
            // Bulk match criteria check
            setIsMatchable(haveEmptyCoreTitleIdsSameContentType() && checkSourceRightIds());

            // Bulk unmatch criteria check
            setIsUnmatchable(haveCoreTitleIds() && checkSourceRightIds());

            // Bonus rights create criteria
            setIsBonusRightCreatable(checkBonusRightCreateCriteria());

            // PrePlan criteria
            setIsPreplanEligible(checkPrePlanEligibilityCriteria());

            // Deletion criteria
            setIsDeletable(checkRightDeletionCriteria());

            // Set status deleted/merged criteria
            setStatusDeleteMerged(checkStatusDeleteMerged());

            setIsSelectedForPlanning(checkIsSelectedForPlanning());
        } else {
            setIsMatchable(false);
            setIsUnmatchable(false);
            setIsBonusRightCreatable(false);
            setIsPreplanEligible(false);
            setIsDeletable(false);
            setStatusDeleteMerged(false);
            setIsSelectedForPlanning(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRights]);

    // single title match flow (from popover)
    useEffect(() => {
        if (singleRightMatch.length && !drawerOpen) {
            openDrawer();
        }
    }, [singleRightMatch, openDrawer, drawerOpen]);

    // Rights with dependencies found during delete process, opening BulkDelete pop-up
    useEffect(() => {
        if (!isEmpty(rightsWithDeps)) {
            openBulkDeleteModal(rightsWithDeps, deletedRightsCount);
        }
    }, [rightsWithDeps, deletedRightsCount, openBulkDeleteModal]);

    return (
        <>
            <div className="nexus-c-selected-rights-actions" ref={node}>
                <MoreIcon fill="#A5ADBA" onClick={clickHandler} />
                <div
                    className={classNames('nexus-c-selected-rights-actions__menu', {
                        'nexus-c-selected-rights-actions__menu--is-open': menuOpened,
                    })}
                >
                    <Can I="read" a="DopTasks">
                        <div
                            className={classNames('nexus-c-selected-rights-actions__menu-item', {
                                'nexus-c-selected-rights-actions__menu-item--is-active': selectedRights.length,
                            })}
                            data-test-id="view-history"
                            onClick={() => (selectedRights.length ? openAuditHistoryModal() : null)}
                        >
                            <div>{VIEW_AUDIT_HISTORY}</div>
                        </div>
                    </Can>
                    <div
                        className={classNames('nexus-c-selected-rights-actions__menu-item', {
                            'nexus-c-selected-rights-actions__menu-item--is-active': isMatchable && !statusDeleteMerged,
                        })}
                        data-test-id="bulk-match"
                        onClick={() => (isMatchable ? openDrawer() : null)}
                    >
                        <NexusTooltip
                            content={BULK_MATCH_DISABLED_TOOLTIP}
                            isDisabled={isMatchable && !statusDeleteMerged}
                        >
                            <div>{BULK_MATCH}</div>
                        </NexusTooltip>
                    </div>
                    <div
                        className={classNames('nexus-c-selected-rights-actions__menu-item', {
                            'nexus-c-selected-rights-actions__menu-item--is-active':
                                isUnmatchable && !statusDeleteMerged,
                        })}
                        data-test-id="bulk-unmatch"
                        onClick={() => (isUnmatchable ? openBulkUnmatchModal() : null)}
                    >
                        <NexusTooltip
                            content={BULK_UNMATCH_DISABLED_TOOLTIP}
                            isDisabled={isUnmatchable && !statusDeleteMerged}
                        >
                            <div>{BULK_UNMATCH}</div>
                        </NexusTooltip>
                    </div>
                    <div
                        className={classNames('nexus-c-selected-rights-actions__menu-item', {
                            'nexus-c-selected-rights-actions__menu-item--is-active':
                                isBonusRightCreatable && !statusDeleteMerged,
                        })}
                        data-test-id="bonus-rights"
                        onClick={() => (isBonusRightCreatable ? createBonusRights() : null)}
                    >
                        <NexusTooltip
                            content={CREATE_BONUS_RIGHT_TOOLTIP}
                            isDisabled={isBonusRightCreatable && !statusDeleteMerged}
                        >
                            <div>{CREATE_BONUS_RIGHT}</div>
                        </NexusTooltip>
                    </div>
                    {activeTab !== PRE_PLAN_TAB && (
                        <>
                            <div
                                className={classNames('nexus-c-selected-rights-actions__menu-item', {
                                    'nexus-c-selected-rights-actions__menu-item--is-active':
                                        !!selectedRights.length && !statusDeleteMerged,
                                })}
                                data-test-id="add-to-preplan"
                                onClick={() => (selectedRights.length ? prepareRightsForPrePlan() : null)}
                            >
                                <NexusTooltip
                                    content={PREPLAN_TOOLTIP}
                                    isDisabled={!!selectedRights.length && !statusDeleteMerged}
                                >
                                    <div>{ADD_TO_PREPLAN}</div>
                                </NexusTooltip>
                            </div>
                            <div
                                className={classNames('nexus-c-selected-rights-actions__menu-item', {
                                    'nexus-c-selected-rights-actions__menu-item--is-active': isDeletable,
                                })}
                                data-test-id="mark-as-deleted"
                                onClick={() => (isDeletable ? openDeleteConfirmationModal() : null)}
                            >
                                <NexusTooltip
                                    content={isSelectedForPlanning ? BULK_DELETE_TOOLTIP_SFP : BULK_DELETE_TOOLTIP}
                                    isDisabled={isDeletable}
                                >
                                    <div>{MARK_DELETED}</div>
                                </NexusTooltip>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <NexusDrawer
                onClose={closeDrawer}
                isOpen={drawerOpen}
                isClosedOnBlur={false}
                width="wider"
                title={headerText}
            >
                <BulkMatching
                    data={singleRightMatch.length ? singleRightMatch : selectedRights}
                    closeDrawer={closeDrawer}
                    isBonusRight={isBonusRight}
                    setHeaderText={setHeaderText}
                    headerText={headerText}
                />
            </NexusDrawer>
        </>
    );
};

SelectedRightsActions.propTypes = {
    selectedRights: PropTypes.array,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    selectedRightGridApi: PropTypes.object,
    toggleRefreshGridData: PropTypes.func.isRequired,
    setSelectedRights: PropTypes.func.isRequired,
    setPrePlanRepoRights: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    gridApi: PropTypes.object,
    singleRightMatch: PropTypes.array,
    setSingleRightMatch: PropTypes.func,
    rightsWithDeps: PropTypes.object,
    getLinkedRights: PropTypes.func,
    clearLinkedRights: PropTypes.func,
    bulkDeleteRights: PropTypes.func,
    deletedRightsCount: PropTypes.number,
};

SelectedRightsActions.defaultProps = {
    selectedRights: [],
    addToast: () => null,
    removeToast: () => null,
    selectedRightGridApi: {},
    gridApi: {},
    singleRightMatch: [],
    setSingleRightMatch: () => null,
    rightsWithDeps: {},
    getLinkedRights: () => null,
    clearLinkedRights: () => null,
    bulkDeleteRights: () => null,
    deletedRightsCount: 0,
};

const mapStateToProps = () => {
    const rightsWithDependenciesSelector = selectors.createRightsWithDependenciesSelector();
    const deletedRightsCountSelector = selectors.createDeletedRightsCountSelector();

    return (state, props) => ({
        rightsWithDeps: rightsWithDependenciesSelector(state, props),
        deletedRightsCount: deletedRightsCountSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
    getLinkedRights: payload => dispatch(getLinkedRights(payload)),
    clearLinkedRights: () => dispatch(clearLinkedRights()),
    bulkDeleteRights: payload => dispatch(bulkDeleteRights(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withToasts(SelectedRightsActions));
