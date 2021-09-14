import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {SUCCESS, ERROR, SYNC, PUBLISH} from '../../../constants';
import './SyncPublish.scss';

const SyncPublish = ({externalSystem, externalIds, onSyncPublish, isSyncing, isPublishing, isDisabled}) => {
    const [externalData] = externalIds.filter(id => id.externalSystem === externalSystem.toLowerCase());
    const statusIndicator = externalData && externalData.status === SUCCESS ? SUCCESS : ERROR;
    const buttonType = externalData ? SYNC : PUBLISH;
    return (
        <div className="nexus-c-sync-publish">
            <Button
                isDisabled={isDisabled}
                appearance="default"
                isLoading={isSyncing || isPublishing}
                onClick={() => onSyncPublish(externalSystem, buttonType)}
            >
                <span className={`nexus-c-sync-publish__status--${statusIndicator}`} />
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
};

SyncPublish.defaultProps = {
    externalIds: [],
    onSyncPublish: () => null,
    isSyncing: false,
    isPublishing: false,
    isDisabled: false,
};

export default SyncPublish;
