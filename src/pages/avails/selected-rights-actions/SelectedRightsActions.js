import React, {useState, useEffect, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import {uniqBy} from 'lodash';
import classNames from 'classnames';
import RightViewHistory from '../right-history-view/RightHistoryView';
import NexusTooltip from '../../../ui/elements/nexus-tooltip/NexusTooltip';
import NexusDrawer from '../../../ui/elements/nexus-drawer/NexusDrawer';
import BulkMatching from '../bulk-matching/BulkMatching';
import BulkUnmatch from '../bulk-unmatch/BulkUnmatch';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import {BULK_MATCH, BULK_MATCH_DISABLED_TOOLTIP, BULK_UNMATCH, BULK_UNMATCH_DISABLED_TOOLTIP} from './constants';
import {BULK_UNMATCH_CANCEL_BTN, BULK_UNMATCH_CONFIRM_BTN, BULK_UNMATCH_TITLE} from '../bulk-unmatch/constants';
import MoreIcon from '../../../assets/more-icon.svg';
import './SelectedRightsActions.scss';

const SelectedRightsActions = ({selectedRights}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const [isMatchable, setIsMatchable] = useState(false);
    const [isUnmatchable, setIsUnmatchable] = useState(false);
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
    }, [selectedRights]);

    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeMenu = e => {
        if (!node.current.contains(e.target)) {
            setMenuOpened(false);
        }
    };

    const toggleDrawerState = () => setDrawerOpen(prevDrawerOpen => !prevDrawerOpen);

    const openBulkUnmatchModal = () => {
        setModalContentAndTitle(<BulkUnmatch selectedRights={selectedRights} />, BULK_UNMATCH_TITLE);
        setModalActions([
            {
                text: BULK_UNMATCH_CANCEL_BTN,
                onClick: () => {
                    close();
                },
                appearance: 'default',
            },
            {
                text: BULK_UNMATCH_CONFIRM_BTN,
                onClick: () => { /* Call some sweet API */ },
                appearance: 'primary',
            },
        ]);
        setModalStyle({width: '70%'});
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
                    <div
                        className={classNames(
                            'nexus-c-selected-rights-actions__menu-item',
                            isUnmatchable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="bulk-unmatch"
                        onClick={isUnmatchable && openBulkUnmatchModal}
                    >
                        <NexusTooltip content={BULK_UNMATCH_DISABLED_TOOLTIP} isDisabled={isUnmatchable}>
                            {BULK_UNMATCH}
                        </NexusTooltip>
                    </div>
                </div>
            </div>
            <NexusDrawer
                onClose={toggleDrawerState}
                isOpen={drawerOpen}
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
};

SelectedRightsActions.defaultProps = {
    selectedRights: [],
};

export default SelectedRightsActions;
