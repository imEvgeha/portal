import React, {useState, useEffect, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {uniqBy, get} from 'lodash';
import classNames from 'classnames';
import withToasts from '../../../ui/toast/hoc/withToasts';
import {toggleRefreshGridData} from '../../../ui/grid/gridActions';
import {setCoreTitleId} from '../availsService';
import RightViewHistory from '../right-history-view/RightHistoryView';
import NexusTooltip from '../../../ui/elements/nexus-tooltip/NexusTooltip';
import NexusDrawer from '../../../ui/elements/nexus-drawer/NexusDrawer';
import BulkMatching from '../bulk-matching/BulkMatching';
import BulkUnmatch from '../bulk-unmatch/BulkUnmatch';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import {
    BULK_MATCH,
    BULK_MATCH_DISABLED_TOOLTIP,
    BULK_UNMATCH,
    BULK_UNMATCH_DISABLED_TOOLTIP,
    BULK_UNMATCH_SUCCESS_TOAST,
    CREATE_BONUS_RIGHT_TOOLTIP,
    CREATE_BONUS_RIGHT
} from './constants';
import {BULK_UNMATCH_CANCEL_BTN, BULK_UNMATCH_CONFIRM_BTN, BULK_UNMATCH_TITLE} from '../bulk-unmatch/constants';
import {SUCCESS_ICON} from '../../../ui/elements/nexus-toast-notification/constants';
import MoreIcon from '../../../assets/more-icon.svg';
import './SelectedRightsActions.scss';
import {URL} from '../../../util/Common';

export const SelectedRightsActions = ({
    selectedRights,
    addToast,
    removeToast,
    toggleRefreshGridData,
    selectedRightGridApi,
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const [isMatchable, setIsMatchable] = useState(false);
    const [isUnmatchable, setIsUnmatchable] = useState(false);
    const [isBonusRightCreatable, setIsBonusRightCreatable] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
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
        const hasUniqueSourceRightIds = selectedRights.length === uniqBy(selectedRights, 'sourceRightId').length;
        const hasEmptyCoreTitleIdsAndSameContentType = selectedRights.every(
            ({coreTitleId, contentType}) => !coreTitleId && contentType === selectedRights[0].contentType
        );
        const hasSameCoreTitleIds = selectedRights.every(({coreTitleId}) => !!coreTitleId && coreTitleId === get(selectedRights, '[0].coreTitleId', ''));
        const hasReadyOrReadyNewStatus = selectedRights.every(({status}) => ['ReadyNew', 'Ready'].includes(status));
        const hasLicensedRights = selectedRights.every(({licensed}) => licensed);

        // Bulk match criteria check
        setIsMatchable(
            !!selectedRights.length
            && hasEmptyCoreTitleIdsAndSameContentType
            && (hasEmptySourceRightIds || (hasNoEmptySourceRightId && hasUniqueSourceRightIds))
        );

        // Bulk unmatch criteria check
        setIsUnmatchable(
            !!selectedRights.length
            && hasCoreTitleIds
            && ((hasNoEmptySourceRightId && hasUniqueSourceRightIds) || hasEmptySourceRightIds)
        );

        // Bonus rights create criteria
        setIsBonusRightCreatable(
            !!selectedRights.length
            && hasSameCoreTitleIds
            && hasEmptySourceRightIds
            && hasLicensedRights
            && hasReadyOrReadyNewStatus
        );
    }, [selectedRights]);

    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeMenu = e => {
        if (!node.current.contains(e.target)) {
            setMenuOpened(false);
        }
    };

    const toggleDrawerState = () => setDrawerOpen(prevDrawerOpen => !prevDrawerOpen);

    const openBulkUnmatchModal = () => {
        const rightIds = selectedRights.map(({id}) => id);

        setModalContentAndTitle(<BulkUnmatch selectedRights={selectedRights} />, BULK_UNMATCH_TITLE);
        setModalActions([
            {
                text: BULK_UNMATCH_CANCEL_BTN,
                onClick: () => {
                    close();
                    removeToast();
                },
                appearance: 'default',
            },
            {
                text: BULK_UNMATCH_CONFIRM_BTN,
                onClick: () => setCoreTitleId({rightIds}).then(unmatchedRights => {
                    // Fetch fresh data from back-end
                    toggleRefreshGridData(true);

                    // Response is returning updated rights, so we can feed that to SelectedRights table
                    selectedRightGridApi.setRowData(unmatchedRights);
                    // Refresh changes
                    selectedRightGridApi.refreshCells();

                    // Close modal
                    close();

                    // Show success toast
                    addToast({
                        title: BULK_UNMATCH_SUCCESS_TOAST,
                        description: `You have successfully unmatched ${unmatchedRights.length} right(s).
                         Please validate title fields.`,
                        icon: SUCCESS_ICON,
                        isAutoDismiss: true,
                    });
                }),
                appearance: 'primary',
            },
        ]);
        setModalStyle({width: '70%'});
    };

    const createBonusRights = () => {
      //placeholder for bonus rights handler
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
                                onClick={isMatchable ? toggleDrawerState : null}
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
                </div>
            </div>
            <NexusDrawer
                onClose={toggleDrawerState}
                isOpen={drawerOpen}
                isClosedOnBlur={false}
                width="wider"
            >
                <BulkMatching
                    data={selectedRights}
                    headerTitle="Title Matching"
                    closeDrawer={toggleDrawerState}
                />
            </NexusDrawer>
        </>
    );
};

SelectedRightsActions.propTypes = {
    selectedRights: PropTypes.array,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    toggleRefreshGridData: PropTypes.func.isRequired,
    selectedRightGridApi: PropTypes.object.isRequired,
};

SelectedRightsActions.defaultProps = {
    selectedRights: [],
    addToast: () => null,
    removeToast: () => null,
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(withToasts(SelectedRightsActions));
