import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {uniqBy} from 'lodash';
import classNames from 'classnames';
import RightViewHistory from '../../RightHistoryView';
import BulkMatchOption from '../../../bulk-match/BulkMatchOption';
import NexusTooltip from '../../../../../ui/elements/nexus-tooltip/NexusTooltip';
import {BULK_UNMATCH, BULK_UNMATCH_DISABLED_TOOLTIP} from './constants';
import MoreIcon from '../../../../../assets/more-icon.svg';
import './MoreActions.scss';

const MoreActions = ({selectedAvails}) => {
    const [menuOpened, setMenuOpened] = useState(false);
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
        // Bulk unmatch criteria check
        const hasCoreTitleIds = selectedAvails.every(({coreTitleId}) => !!coreTitleId);
        const hasEmptySourceRightIds = selectedAvails.every(({sourceRightId}) => !sourceRightId);
        const hasUniqueSourceRightIds = selectedAvails.length === uniqBy(selectedAvails, 'sourceRightId').length;

        setIsUnmatchable(
            !!selectedAvails.length
            && hasCoreTitleIds
            && (hasUniqueSourceRightIds || hasEmptySourceRightIds)
        );
    }, [selectedAvails]);

    const clickHandler = () => setMenuOpened(!menuOpened);
    const removeMenu = e => {
        if (!node.current.contains(e.target)) {
            setMenuOpened(false);
        }
    };

    return (
        <div className="rights-more-actions" ref={node}>
            <MoreIcon fill="#A5ADBA" onClick={clickHandler} />
            <div
                className={classNames(
                    'rights-more-actions__menu',
                    menuOpened && 'rights-more-actions__menu--is-open'
                )}
            >
                <div
                    className={classNames(
                        'rights-more-actions__menu-item',
                        selectedAvails.length && 'rights-more-actions__menu-item--is-active'
                    )}
                    data-test-id="view-history"
                >
                    <RightViewHistory selectedAvails={selectedAvails} />
                </div>
                <div
                    className={classNames(
                        'rights-more-actions__menu-item',
                        selectedAvails.length && 'rights-more-actions__menu-item--is-active'
                    )}
                >
                    <BulkMatchOption selectedRights={selectedAvails} />
                </div>
                <div
                    className={classNames(
                        'rights-more-actions__menu-item',
                        isUnmatchable && 'rights-more-actions__menu-item--is-active'
                    )}
                    data-test-id="bulk-unmatch"
                >
                    <NexusTooltip content={BULK_UNMATCH_DISABLED_TOOLTIP} isDisabled={isUnmatchable}>
                        <div>
                            {BULK_UNMATCH}
                        </div>
                    </NexusTooltip>
                </div>
            </div>
        </div>
    );
};

MoreActions.propTypes = {
    selectedAvails: PropTypes.array,
};

MoreActions.defaultProps = {
    selectedAvails: [],
};

export default MoreActions;
