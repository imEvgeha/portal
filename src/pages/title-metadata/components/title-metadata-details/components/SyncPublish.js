import React from 'react';
import PropTypes from 'prop-types';
import NexusStatusDot from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-dot/NexusStatusDot';
import moment from 'moment';
import {PUBLISH, SUCCESS, SYNC} from '../../../constants';
import './SyncPublish.scss';

const SyncPublish = ({
    externalSystem,
    externalIds,
    onSyncPublish,
    isSyncing,
    isPublishing,
    isDisabled,
    titleUpdatedAt,
    hasButtons,
}) => {
    const [externalData] = externalIds.filter(id => id.externalSystem === externalSystem?.value);
    const buttonType = externalData ? SYNC : PUBLISH;
    let publishedDate = externalData?.publishedAt || null;
    publishedDate = moment(publishedDate).isValid() ? moment(publishedDate) : null;
    const needsSyncing = moment(publishedDate).isBefore(moment(titleUpdatedAt));

    const getStatus = () => {
        if (needsSyncing && externalData?.status !== 'failure') return 'warning';
        if (externalData === undefined) return 'neutral';
        if (externalData.status === SUCCESS) return 'success';
        return 'danger';
    };

    return (
        <div className="nexus-c-sync-publish">
            <NexusStatusDot
                label={externalSystem?.label}
                onAction={() => onSyncPublish(externalSystem?.value, buttonType)}
                severity={getStatus()}
                isDisabled={!hasButtons || (isDisabled && publishedDate && !needsSyncing)}
                isLoading={isSyncing || isPublishing}
            />
        </div>
    );
};

SyncPublish.propTypes = {
    externalSystem: PropTypes.object.isRequired,
    externalIds: PropTypes.array,
    onSyncPublish: PropTypes.func,
    isSyncing: PropTypes.bool,
    isPublishing: PropTypes.bool,
    isDisabled: PropTypes.bool,
    hasButtons: PropTypes.bool,
    titleUpdatedAt: PropTypes.string,
};

SyncPublish.defaultProps = {
    externalIds: [],
    onSyncPublish: () => null,
    isSyncing: false,
    isPublishing: false,
    isDisabled: false,
    hasButtons: false,
    titleUpdatedAt: null,
};

export default SyncPublish;
