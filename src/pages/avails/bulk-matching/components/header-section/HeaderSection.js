import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import classNames from 'classnames';
import {RIGHT_TABS} from '../../constants';

const HeaderSection = ({
    activeTab,
    changeActiveTab,
    selectedRights,
    isBonusRight,
    existingBonusRights,
    affectedRights,
    showModal,
    isNewTitleDisabled,
}) => {
    return (
        <div className="nexus-c-bulk-matching__header">
            <div
                className={classNames(
                    'nexus-c-bulk-matching__rights-tab',
                    activeTab === RIGHT_TABS.SELECTED && 'nexus-c-bulk-matching__rights-tab--active'
                )}
                onClick={() => changeActiveTab(RIGHT_TABS.SELECTED)}
            >
                {RIGHT_TABS.SELECTED} ({selectedRights})
            </div>
            {isBonusRight ? (
                <div
                    className={classNames(
                        'nexus-c-bulk-matching__rights-tab',
                        activeTab === RIGHT_TABS.BONUS_RIGHTS && 'nexus-c-bulk-matching__rights-tab--active'
                    )}
                    onClick={() => changeActiveTab(RIGHT_TABS.BONUS_RIGHTS)}
                >
                    {RIGHT_TABS.BONUS_RIGHTS} ({existingBonusRights})
                </div>
            ) : (
                <div
                    className={classNames(
                        'nexus-c-bulk-matching__rights-tab',
                        activeTab === RIGHT_TABS.AFFECTED && 'nexus-c-bulk-matching__rights-tab--active'
                    )}
                    onClick={() => changeActiveTab(RIGHT_TABS.AFFECTED)}
                >
                    {RIGHT_TABS.AFFECTED} ({affectedRights})
                </div>
            )}
            <Button className="nexus-c-bulk-matching__btn" onClick={showModal} isDisabled={isNewTitleDisabled}>
                New Title
            </Button>
        </div>
    );
};

HeaderSection.propTypes = {
    activeTab: PropTypes.string,
    affectedRights: PropTypes.number,
    changeActiveTab: PropTypes.func.isRequired,
    existingBonusRights: PropTypes.number,
    isBonusRight: PropTypes.bool,
    isNewTitleDisabled: PropTypes.bool,
    selectedRights: PropTypes.number,
    showModal: PropTypes.func.isRequired,
};

HeaderSection.defaultProps = {
    activeTab: '',
    affectedRights: 0,
    existingBonusRights: 0,
    isBonusRight: false,
    isNewTitleDisabled: true,
    selectedRights: 0,
};

export default HeaderSection;
