import React, {useState, useEffect, useRef, useContext} from 'react';
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
import BulkMatching from '../bulk-matching/BulkMatching';
import BulkUnmatch from '../bulk-unmatch/BulkUnmatch';
import {BULK_UNMATCH_TITLE} from '../bulk-unmatch/constants';
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
    HEADER_TITLE,
    ADD_TO_PREPLAN,
    PREPLAN_TOOLTIP,
    STATUS_CHECK_HEADER,
    STATUS_CHECK_MSG,
    VIEW_AUDIT_HISTORY,
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
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const [isMatchable, setIsMatchable] = useState(false);
    const [isUnmatchable, setIsUnmatchable] = useState(false);
    const [isBonusRightCreatable, setIsBonusRightCreatable] = useState(false);
    const [isPreplanEligible, setIsPreplanEligible] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isBonusRight, setIsBonusRight] = useState(false);
    const [headerText, setHeaderText] = useState(HEADER_TITLE);
    const node = useRef();

    const {setModalContentAndTitle, setModalActions, setModalStyle, close} = useContext(NexusModalContext);

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

    // All the rights have Same CoreTitleIds And Empty SourceRightId And Licensed And Ready Or ReadyNew Status
    const checkBonusRightCreateCriteria = () => {
        return selectedRights.every(
            ({coreTitleId, sourceRightId, licensed, status}) =>
                licensed &&
                !!coreTitleId &&
                coreTitleId === get(selectedRights, '[0].coreTitleId', '') &&
                !sourceRightId &&
                ['ReadyNew', 'Ready'].includes(status)
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
        } else {
            setIsMatchable(false);
            setIsUnmatchable(false);
            setIsBonusRightCreatable(false);
            setIsPreplanEligible(false);
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
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setIsBonusRight(false);
    };

    const openBulkUnmatchModal = () => {
        setModalContentAndTitle(
            <BulkUnmatch
                selectedRights={selectedRights.map(({id}) => id)}
                removeToast={removeToast}
                addToast={addToast}
                selectedRightGridApi={selectedRightGridApi}
                toggleRefreshGridData={toggleRefreshGridData}
            />,
            BULK_UNMATCH_TITLE
        );
    };

    const openAuditHistoryModal = () => {
        const ids = selectedRights.map(e => e.id);
        const title = `Audit History (${selectedRights.length})`;

        setModalStyle({width: '100%'});
        setModalActions([
            {
                text: 'Done',
                onClick: close,
            },
        ]);
        setModalContentAndTitle(NexusSpinner, title);

        getRightsHistory(ids).then(rightsEventHistory => {
            setModalContentAndTitle(
                <div>
                    {selectedRights.map((right, index) => (
                        <AuditHistoryTable key={right.id} focusedRight={right} data={rightsEventHistory[index]} />
                    ))}
                </div>,
                title
            );
        });
    };


    const onCloseStatusCheckModal = () => {
        gridApi.deselectAll();
        toggleRefreshGridData(true);
        close();
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

        setModalContentAndTitle(
            <StatusCheck
                message={STATUS_CHECK_MSG}
                nonEligibleTitles={nonEligibleRights}
                onClose={onCloseStatusCheckModal}
            />,
            STATUS_CHECK_HEADER
        );
    };

    const createBonusRights = () => {
        setIsBonusRight(true);
        setHeaderText(HEADER_TITLE_BONUS_RIGHT);
        openDrawer();
    };

    return (
        <>
            <div className="nexus-c-selected-rights-actions" ref={node}>
                <MoreIcon fill="#A5ADBA" onClick={clickHandler} />
                <div
                    className={classNames(
                        'nexus-c-selected-rights-actions__menu',
                        menuOpened && 'nexus-c-selected-rights-actions__menu--is-open'
                    )}
                >
                    <div
                        className={classNames(
                            'nexus-c-selected-rights-actions__menu-item',
                            selectedRights.length && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="view-history"
                        onClick={selectedRights.length ? openAuditHistoryModal : null}
                    >
                        <div>{VIEW_AUDIT_HISTORY}</div>
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-selected-rights-actions__menu-item',
                            isMatchable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="bulk-match"
                        onClick={isMatchable ? openDrawer : null}
                    >
                        <NexusTooltip content={BULK_MATCH_DISABLED_TOOLTIP} isDisabled={isMatchable}>
                            <div>{BULK_MATCH}</div>
                        </NexusTooltip>
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-selected-rights-actions__menu-item',
                            isUnmatchable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="bulk-unmatch"
                        onClick={isUnmatchable ? openBulkUnmatchModal : null}
                    >
                        <NexusTooltip content={BULK_UNMATCH_DISABLED_TOOLTIP} isDisabled={isUnmatchable}>
                            <div>{BULK_UNMATCH}</div>
                        </NexusTooltip>
                    </div>
                    {URL.isLocalOrDev() && (
                        <div
                            className={classNames(
                                'nexus-c-selected-rights-actions__menu-item',
                                isBonusRightCreatable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                            )}
                            data-test-id="bonus-rights"
                            onClick={isBonusRightCreatable ? createBonusRights : null}
                        >
                            <NexusTooltip content={CREATE_BONUS_RIGHT_TOOLTIP} isDisabled={isBonusRightCreatable}>
                                <div>{CREATE_BONUS_RIGHT}</div>
                            </NexusTooltip>
                        </div>
                    )}
                    {activeTab !== PRE_PLAN_TAB && URL.isLocalOrDevOrQA() && (
                        <div
                            className={classNames(
                                'nexus-c-selected-rights-actions__menu-item',
                                !!selectedRights.length && 'nexus-c-selected-rights-actions__menu-item--is-active'
                            )}
                            data-test-id="add-to-preplan"
                            onClick={selectedRights.length ? prepareRightsForPrePlan : null}
                        >
                            <NexusTooltip content={PREPLAN_TOOLTIP} isDisabled={!!selectedRights.length}>
                                <div>{ADD_TO_PREPLAN}</div>
                            </NexusTooltip>
                        </div>
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
