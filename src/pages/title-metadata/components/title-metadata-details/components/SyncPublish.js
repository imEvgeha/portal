import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import moment from 'moment';
import {SUCCESS, ERROR, EMPTY, SYNC, PUBLISH} from '../../../constants';
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
    const [externalData] = externalIds.filter(id => id.externalSystem === externalSystem.toLowerCase());
    const buttonType = externalData ? SYNC : PUBLISH;
    let publishedDate = externalData && externalData.publishedAt ? externalData.publishedAt : null;
    publishedDate = moment(publishedDate).isValid() ? moment(publishedDate) : null;
    const needsSyncing = moment(publishedDate).isBefore(moment(titleUpdatedAt));

    const getStatus = () => {
        if (needsSyncing) return SYNC;
        if (externalData === undefined) return EMPTY;
        if (externalData.status === SUCCESS) return SUCCESS;
        return ERROR;
    };

    return (
        <div className="nexus-c-sync-publish">
            <div className={`nexus-c-sync-publish__status--${getStatus()}`} />
            <Button
                isDisabled={!hasButtons || (isDisabled && publishedDate && !needsSyncing)}
                appearance="subtle"
                isLoading={isSyncing || isPublishing}
                onClick={() => onSyncPublish(externalSystem, buttonType)}
            >
                {externalSystem}
            </Button>
        </div>
    );
};

SyncPublish.propTypes = {
    externalSystem: PropTypes.string.isRequired,
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
