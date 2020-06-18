import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {uniqBy} from 'lodash';
import classNames from 'classnames';
import RightViewHistory from '../right-history-view/RightHistoryView';
import NexusTooltip from '../../../ui/elements/nexus-tooltip/NexusTooltip';
import {BULK_MATCH, BULK_MATCH_DISABLED_TOOLTIP, BULK_UNMATCH, BULK_UNMATCH_DISABLED_TOOLTIP} from './constants';
import MoreIcon from '../../../assets/more-icon.svg';
import './SelectedRightsActions.scss';

const SelectedRightsActions = ({selectedRights}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const [isMatchable, setIsMatchable] = useState(false);
    const [isUnmatchable, setIsUnmatchable] = useState(false);
    const node = useRef();

    useEffect(function() {
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
            && (hasEmptySourceRightIds || hasNoEmptySourceRightId && hasUniqueSourceRightIds)
        );

        // Bulk unmatch criteria check
        setIsUnmatchable(
            !!selectedRights.length
            && hasCoreTitleIds
            && (hasNoEmptySourceRightId && hasUniqueSourceRightIds || hasEmptySourceRightIds)
        );
    }, [selectedRights]);

    const clickHandler = () => setMenuOpened(!menuOpened);
    const removeMenu = e => {
        if (!node.current.contains(e.target)) {
            setMenuOpened(false);
        }
    };

    return (
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
                    {/*TODO: Rewrite like the rest of the options when old design gets removed*/}
                    <RightViewHistory selectedAvails={selectedRights} />
                </div>
                <div
                    className={classNames(
                        'nexus-c-selected-rights-actions__menu-item',
                        isMatchable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                    )}
                    data-test-id="bulk-match"
                >
                    <NexusTooltip content={BULK_MATCH_DISABLED_TOOLTIP} isDisabled={isMatchable}>
                        {BULK_MATCH}
                    </NexusTooltip>
                </div>
                <div
                    className={classNames(
                        'nexus-c-selected-rights-actions__menu-item',
                        isUnmatchable && 'nexus-c-selected-rights-actions__menu-item--is-active'
                    )}
                    data-test-id="bulk-unmatch"
                >
                    <NexusTooltip content={BULK_UNMATCH_DISABLED_TOOLTIP} isDisabled={isUnmatchable}>
                        {BULK_UNMATCH}
                    </NexusTooltip>
                </div>
            </div>
        </div>
    );
};

SelectedRightsActions.propTypes = {
    selectedRights: PropTypes.array,
};

SelectedRightsActions.defaultProps = {
    selectedRights: [],
};

export default SelectedRightsActions;
