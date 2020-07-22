import React, {useState, useEffect, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {get} from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import withToasts from '../../../ui/toast/hoc/withToasts';
import {toggleRefreshGridData} from '../../../ui/grid/gridActions';
import RightViewHistory from '../right-history-view/RightHistoryView';
import NexusTooltip from '../../../ui/elements/nexus-tooltip/NexusTooltip';
import NexusDrawer from '../../../ui/elements/nexus-drawer/NexusDrawer';
import BulkMatching from '../bulk-matching/BulkMatching';
import BulkUnmatch from '../bulk-unmatch/BulkUnmatch';
import StatusCheck from '../rights-repository/components/status-check/StatusCheck';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
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
} from './constants';
import {BULK_UNMATCH_TITLE} from '../bulk-unmatch/constants';
import MoreIcon from '../../../assets/more-icon.svg';
import './SelectedRightsActions.scss';
import {URL} from '../../../util/Common';

export const SelectedRightsActions = ({
    selectedRights,
    addToast,
    removeToast,
    toggleRefreshGridData,
    selectedRightGridApi,
    gridApi,
    setSelectedRights,
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

    // Check the criteria for enabling specific actions
    useEffect(() => {
        // Criteria
        const hasCoreTitleIds = selectedRights.every(({coreTitleId}) => !!coreTitleId);
        const hasEmptySourceRightIds = selectedRights.every(({sourceRightId}) => !sourceRightId);
        const hasNoEmptySourceRightId = selectedRights.every(({sourceRightId}) => !!sourceRightId);
        const hasEmptyCoreTitleIdsAndSameContentType = selectedRights.every(
            ({coreTitleId, contentType}) => !coreTitleId && contentType === selectedRights[0].contentType
        );
        const hasSameCoreTitleIds = selectedRights.every(({coreTitleId}) => !!coreTitleId && coreTitleId === get(selectedRights, '[0].coreTitleId', ''));
        const hasReadyOrReadyNewStatus = selectedRights.every(({status}) => ['ReadyNew', 'Ready'].includes(status));
        const hasPendingConfirmedTentativeStatus = selectedRights.every(({rightStatus}) => ['Pending', 'Confirmed', 'Tentative'].includes(rightStatus));
        const hasLicensedRights = selectedRights.every(({licensed}) => licensed);
        const hasNoExpiredRights = selectedRights.every(({end, availEnd, licensed}) => (licensed
            ? (moment().isBefore(end))
            : (moment().isBefore(availEnd))));
        // Bulk match criteria check
        setIsMatchable(
            !!selectedRights.length
            && hasEmptyCoreTitleIdsAndSameContentType
            && (hasEmptySourceRightIds || hasNoEmptySourceRightId)
            && hasNoExpiredRights
        );

        // Bulk unmatch criteria check
        setIsUnmatchable(
            !!selectedRights.length
            && hasCoreTitleIds
            && hasNoExpiredRights
        );

        // Bonus rights create criteria
        setIsBonusRightCreatable(
            !!selectedRights.length
            && hasSameCoreTitleIds
            && hasEmptySourceRightIds
            && hasLicensedRights
            && hasReadyOrReadyNewStatus
        );

        // PrePlan criteria
        setIsPreplanEligible(
            !!selectedRights.length
            && hasReadyOrReadyNewStatus
            && hasLicensedRights
            && hasPendingConfirmedTentativeStatus
        );
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
            (
                <BulkUnmatch
                    selectedRights={selectedRights.map(({id}) => id)}
                    removeToast={removeToast}
                    addToast={addToast}
                    selectedRightGridApi={selectedRightGridApi}
                    toggleRefreshGridData={toggleRefreshGridData}
                />
            ), BULK_UNMATCH_TITLE
        );
    };

    const prePlanEligible = (status, rightStatus, licensed) => {
        if ((status === 'Ready' || status === 'ReadyNew')
            && (rightStatus === 'Pending' || rightStatus === 'Confirmed' || rightStatus === 'Tentative')
            && licensed) {
            return true;
        }
        return false;
    };

    const onCloseStatusCheckModal = () => {
        gridApi.deselectAll();
        toggleRefreshGridData(true);
        close();
    };

    const openStatusCheckModal = () => {
        const eligibleRights = selectedRights.filter(right => {
            const {status, rightStatus, licensed} = right || {};
            if (prePlanEligible(status, rightStatus, licensed)) {
                return right;
            }
            return null;
        });

        if (isPreplanEligible) {
            // move to pre-plan, clear selectedRights
            // moveToPrePlan(eligibleRights);
            gridApi.deselectAll();
            setSelectedRights([]);
            toggleRefreshGridData(true);
            return;
        }

        const nonEligibleRights = selectedRights.filter(right => {
            const {status, rightStatus, licensed} = right || {};
            if (!prePlanEligible(status, rightStatus, licensed)) {
                return right;
            }
            return null;
        });

        const nonEligibleTitles = nonEligibleRights.reduce((acc, right) => {
            const {title, status} = right || {};
            const restrictedTitle = {title, status};
            return [...acc, restrictedTitle];
        }, []);

        setSelectedRights(nonEligibleRights);

        setModalContentAndTitle(
            (
                <StatusCheck
                    message={STATUS_CHECK_MSG}
                    nonEligibleTitles={nonEligibleTitles}
                    onClose={onCloseStatusCheckModal}
                />
            ), STATUS_CHECK_HEADER
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
                    >
                        {/* TODO: Rewrite like the rest of the options when old design gets removed */}
                        <RightViewHistory selectedAvails={selectedRights} />
                    </div>
                    {
                        URL.isLocalOrDevOrQA() && (
                            <div
                                className={classNames(
                                    'nexus-c-selected-rights-actions__menu-item',
                                    isMatchable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                                )}
                                data-test-id="bulk-match"
                                onClick={isMatchable ? openDrawer : null}
                            >
                                <NexusTooltip content={BULK_MATCH_DISABLED_TOOLTIP} isDisabled={isMatchable}>
                                    <div>
                                        {BULK_MATCH}
                                    </div>
                                </NexusTooltip>
                            </div>
                        )
                    }
                    {
                        URL.isLocalOrDevOrQA() && (
                            <div
                                className={classNames(
                                    'nexus-c-selected-rights-actions__menu-item',
                                    isUnmatchable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                                )}
                                data-test-id="bulk-unmatch"
                                onClick={isUnmatchable ? openBulkUnmatchModal : null}
                            >
                                <NexusTooltip content={BULK_UNMATCH_DISABLED_TOOLTIP} isDisabled={isUnmatchable}>
                                    <div>
                                        {BULK_UNMATCH}
                                    </div>
                                </NexusTooltip>
                            </div>
                        )
                    }
                    {
                        URL.isLocalOrDevOrQA() && (
                            <div
                                className={classNames(
                                    'nexus-c-selected-rights-actions__menu-item',
                                    isBonusRightCreatable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                                )}
                                data-test-id="bonus-rights"
                                onClick={isBonusRightCreatable ? createBonusRights : null}
                            >
                                <NexusTooltip content={CREATE_BONUS_RIGHT_TOOLTIP} isDisabled={isBonusRightCreatable}>
                                    <div>
                                        {CREATE_BONUS_RIGHT}
                                    </div>
                                </NexusTooltip>
                            </div>
                        )
                    }
                    {
                        URL.isLocalOrDevOrQA() && (
                            <div
                                className={classNames(
                                    'nexus-c-selected-rights-actions__menu-item',
                                    !!selectedRights.length && 'nexus-c-selected-rights-actions__menu-item--is-active'
                                )}
                                data-test-id="add-to-preplan"
                                onClick={selectedRights.length ? openStatusCheckModal : null}
                            >
                                <NexusTooltip content={PREPLAN_TOOLTIP} isDisabled={!!selectedRights.length}>
                                    <div>
                                        {ADD_TO_PREPLAN}
                                    </div>
                                </NexusTooltip>
                            </div>
                        )
                    }
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
