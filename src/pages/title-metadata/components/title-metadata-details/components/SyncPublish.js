import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import moment from 'moment';
import {SUCCESS, ERROR, SYNC, PUBLISH, UNABLE_PUBLISH} from '../../../constants';
import './SyncPublish.scss';

const SyncPublish = ({externalSystem, externalIds, onSyncPublish, isSyncing, isPublishing, disabled}) => {
    const [externalData] = externalIds.filter(id => id.externalSystem === externalSystem.toLowerCase());
    const statusIndicator = externalData && externalData.status === SUCCESS ? SUCCESS : ERROR;
    const buttonType = externalData ? SYNC : PUBLISH;
    const buttonText =
        externalData && externalData.publishedAt ? `Sync to ${externalSystem}` : `Publish to ${externalSystem}`;
    let publishedDate = externalData && externalData.publishedAt ? externalData.publishedAt : 'No record exists';
    publishedDate = moment(publishedDate).isValid() ? ISODateToView(publishedDate, 'timestamp') : publishedDate;

    const buildButton = () => {
        return (
            <Button
                isDisabled={disabled}
                appearance="default"
                isLoading={isSyncing || isPublishing}
                onClick={() => onSyncPublish(externalSystem, buttonType)}
            >
                {buttonText}
            </Button>
        );
    };

    return (
        <div className="nexus-c-sync-publish">
            {disabled ? <span title={UNABLE_PUBLISH}>{buildButton()}</span> : buildButton()}
            <div className="nexus-c-sync-publish__msg">
                <span className={`nexus-c-sync-publish__status--${statusIndicator}`} />
                {publishedDate}
            </div>
        </div>
    );
};

SyncPublish.propTypes = {
    externalSystem: PropTypes.string.isRequired,
    externalIds: PropTypes.array,
    onSyncPublish: PropTypes.func,
    isSyncing: PropTypes.bool,
    isPublishing: PropTypes.bool,
    disabled: PropTypes.bool,
};

SyncPublish.defaultProps = {
    externalIds: [],
    onSyncPublish: () => null,
    isSyncing: false,
    isPublishing: false,
    disabled: false,
};

export default SyncPublish;
