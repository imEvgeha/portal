import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {get, uniqBy} from 'lodash';
import {connect} from 'react-redux';
import MoreIcon from '../../../assets/more-icon.svg';
import NexusDrawer from '../../../ui/elements/nexus-drawer/NexusDrawer';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import NexusSpinner from '../../../ui/elements/nexus-spinner/NexusSpinner';
import NexusTooltip from '../../../ui/elements/nexus-tooltip/NexusTooltip';
import {toggleRefreshGridData} from '../../../ui/grid/gridActions';
import withToasts from '../../../ui/toast/hoc/withToasts';
import {URL} from '../../../util/Common';
import AuditHistoryTable from '../../legacy/components/AuditHistoryTable/AuditHistoryTable';
import {getRightsHistory} from '../availsService';
import BulkDelete from '../bulk-delete/BulkDelete';
import BulkMatching from '../bulk-matching/BulkMatching';
import BulkUnmatch from '../bulk-unmatch/BulkUnmatch';
import {BULK_UNMATCH_CANCEL_BTN, BULK_UNMATCH_CONFIRM_BTN, BULK_UNMATCH_TITLE} from '../bulk-unmatch/constants';
import {
    getEligibleRights,
    hasAtLeastOneUnselectedTerritory,
    filterOutUnselectedTerritories,
} from '../menu-actions/actions';
import StatusCheck from '../rights-repository/components/status-check/StatusCheck';
import {PRE_PLAN_TAB} from '../rights-repository/constants';
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
    MARK_DELETED,
    BULK_DELETE_HEADER, BULK_UNMATCH_SUCCESS_TOAST,
} from './constants';
import './SelectedRightsActions.scss';
import {getAffectedRights, setCoreTitleId} from "../bulk-matching/bulkMatchingService";
import {SUCCESS_ICON} from "../../../ui/elements/nexus-toast-notification/constants";

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
    const node = useRef();

    const {openModal, closeModal} = useContext(NexusModalContext);

    useEffect(() => {
        window.addEventListener('click', removeMenu);

        return () => {
            window.removeEventListener('click', removeMenu);
        };
    }, []);

    // All the rights have empty SourceRightId or all the rights have uniq SourceRightId
    const checkSourceRightIds = () => {
        const hasEmptySourceRightIds = selectedRights.every(({sourceRightId}) => !sourceRightId);
        const hasUniqueSourceRightIds =
            selectedRights.every(({sourceRightId}) => !!sourceRightId && sourceRightId !== '') &&
            selectedRights.length === uniqBy(selectedRights, 'sourceRightId').length;
        return hasEmptySourceRightIds || hasUniqueSourceRightIds;
    };

    // None of the rights has status 'Deleted'
    const noRightsWithDeletedStatus = () => selectedRights.every(({status}) => status !== 'Deleted');

    // At least one of the selected rights has status 'Deleted' or 'Merged'
    const checkStatusDeleteMerged = () =>
        selectedRights.some(({status}) => status === 'Deleted' || status === 'Merged');

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
            ({rightStatus, licensed, status, territory}) =>
                licensed &&
                ['Pending', 'Confirmed', 'Tentative'].includes(rightStatus) &&
                ['ReadyNew', 'Ready'].includes(status) &&
                hasAtLeastOneUnselectedTerritory(territory)
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
            setIsDeletable(noRightsWithDeletedStatus());

            // Set status deleted/merged criteria
            setStatusDeleteMerged(checkStatusDeleteMerged());
        } else {
            setIsMatchable(false);
            setIsUnmatchable(false);
            setIsBonusRightCreatable(false);
            setIsPreplanEligible(false);
            setIsDeletable(false);
            setStatusDeleteMerged(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRights]);

    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeMenu = e => {
        if (!node.current.contains(e.target)) {
            setMenuOpened(false);
        }
    };

    const openDrawer = () => {
        setDrawerOpen(true);
        setHeaderText(HEADER_TITLE_TITLE_MATCHING);
    };

    const closeDrawer = () => {
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
        const selectedRightsIds = selectedRights.map(({id}) => id);
        getAffectedRights(selectedRightsIds).then(rights => {
            const actions =[
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
            openModal(
                <BulkUnmatch
                    selectedRights={selectedRightsIds}
                    affectedRights={rights}
                />,
                BULK_UNMATCH_TITLE,
                'x-large',
                actions
            );
        });
    };

    const openBulkDeleteModal = () => {
        // to do - pass rights for deletion when api is ready
        openModal(<BulkDelete rights={[]} onClose={closeModal} />, BULK_DELETE_HEADER, 'large');
    };

    const openAuditHistoryModal = () => {
        const ids = selectedRights.map(e => e.id);
        const title = `Audit History (${selectedRights.length})`;

        const actions = [
            {
                text: 'Done',
                onClick: closeModal,
            },
        ];
        openModal(NexusSpinner, title, '100%', actions);

        getRightsHistory(ids).then(rightsEventHistory => {
            openModal(
                <div>
                    {selectedRights.map((right, index) => (
                        <AuditHistoryTable key={right.id} focusedRight={right} data={rightsEventHistory[index]} />
                    ))}
                </div>,
                title,
                '100%',
                actions
            );
        });
    };

    const onCloseStatusCheckModal = () => {
        gridApi.deselectAll();
        toggleRefreshGridData(true);
        closeModal();
    };

    const prepareRightsForPrePlan = () => {
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
        openModal(
            <StatusCheck nonEligibleTitles={nonEligibleRights} onClose={onCloseStatusCheckModal} />,
            STATUS_CHECK_HEADER,
            'large'
        );
    };

    const createBonusRights = () => {
        setIsBonusRight(true);
        setHeaderText(HEADER_TITLE_BONUS_RIGHT);
        setDrawerOpen(true);
    };

    return (
        <>
            <div className="nexus-c-selected-rights-actions" ref={node}>
                <MoreIcon fill="#A5ADBA" onClick={clickHandler} />
                <div
                    className={classNames('nexus-c-selected-rights-actions__menu', {
                        'nexus-c-selected-rights-actions__menu--is-open': menuOpened,
                    })}
                >
                    <div
                        className={classNames('nexus-c-selected-rights-actions__menu-item', {
                            'nexus-c-selected-rights-actions__menu-item--is-active': selectedRights.length,
                        })}
                        data-test-id="view-history"
                        onClick={selectedRights.length ? openAuditHistoryModal : null}
                    >
                        <div>{VIEW_AUDIT_HISTORY}</div>
                    </div>
                    <div
                        className={classNames('nexus-c-selected-rights-actions__menu-item', {
                            'nexus-c-selected-rights-actions__menu-item--is-active': isMatchable && !statusDeleteMerged,
                        })}
                        data-test-id="bulk-match"
                        onClick={isMatchable ? openDrawer : null}
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
                        onClick={isUnmatchable ? openBulkUnmatchModal : null}
                    >
                        <NexusTooltip
                            content={BULK_UNMATCH_DISABLED_TOOLTIP}
                            isDisabled={isUnmatchable && !statusDeleteMerged}
                        >
                            <div>{BULK_UNMATCH}</div>
                        </NexusTooltip>
                    </div>
                    {URL.isLocalOrDevOrQA() && (
                        <div
                            className={classNames('nexus-c-selected-rights-actions__menu-item', {
                                'nexus-c-selected-rights-actions__menu-item--is-active':
                                    isBonusRightCreatable && !statusDeleteMerged,
                            })}
                            data-test-id="bonus-rights"
                            onClick={isBonusRightCreatable ? createBonusRights : null}
                        >
                            <NexusTooltip
                                content={CREATE_BONUS_RIGHT_TOOLTIP}
                                isDisabled={isBonusRightCreatable && !statusDeleteMerged}
                            >
                                <div>{CREATE_BONUS_RIGHT}</div>
                            </NexusTooltip>
                        </div>
                    )}
                    {activeTab !== PRE_PLAN_TAB && URL.isLocalOrDevOrQA() && (
                        <>
                            <div
                                className={classNames('nexus-c-selected-rights-actions__menu-item', {
                                    'nexus-c-selected-rights-actions__menu-item--is-active':
                                        !!selectedRights.length && !statusDeleteMerged,
                                })}
                                data-test-id="add-to-preplan"
                                onClick={selectedRights.length ? prepareRightsForPrePlan : null}
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
                                onClick={openBulkDeleteModal}
                            >
                                <NexusTooltip content={BULK_DELETE_TOOLTIP} isDisabled={isDeletable}>
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
                    data={selectedRights}
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
};

SelectedRightsActions.defaultProps = {
    selectedRights: [],
    addToast: () => null,
    removeToast: () => null,
    selectedRightGridApi: {},
    gridApi: {},
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(withToasts(SelectedRightsActions));
