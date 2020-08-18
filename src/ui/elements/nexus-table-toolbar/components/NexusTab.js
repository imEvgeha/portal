import React, {memo} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NexusTooltip from '../../nexus-tooltip/NexusTooltip';
import './NexusTab.scss';

const NexusTab = ({title, tooltip, totalRows, activeTab, setActiveTab}) => {
    return (
        <NexusTooltip content={tooltip}>
            <div
                className={classNames('nexus-c-nexus-tab', activeTab === title && 'nexus-c-nexus-tab--is-active')}
                onClick={() => (activeTab !== title ? setActiveTab(title) : null)}
            >
                {title} ({totalRows})
            </div>
        </NexusTooltip>
    );
};

NexusTab.propTypes = {
    title: PropTypes.string,
    tooltip: PropTypes.string,
    totalRows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

NexusTab.defaultProps = {
    title: '',
    tooltip: '',
    totalRows: 0,
};

export default memo(NexusTab);
