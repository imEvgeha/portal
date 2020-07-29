import React, {memo} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './NexusTab.scss';

const NexusTab = ({title, totalRows, activeTab, currentTab, setActiveTab}) => {
    return (
        <div
            className={classNames(
                'nexus-c-nexus-tab',
                activeTab === currentTab && 'nexus-c-nexus-tab--is-active'
            )}
            onClick={() => (activeTab !== currentTab ? setActiveTab(currentTab) : null)}
        >
            {title} ({totalRows})
        </div>
    );
};

NexusTab.propTypes = {
    title: PropTypes.string,
    totalRows: PropTypes.number,
    activeTab: PropTypes.string.isRequired,
    currentTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

NexusTab.defaultProps = {
    title: '',
    totalRows: 0,
};

export default memo(NexusTab);
