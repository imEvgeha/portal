import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import moment from 'moment';
import {SUCCESS, ERROR, SYNC, PUBLISH} from '../../../constants';
import './SyncPublish.scss';

const SyncPublish = ({externalSystem, externalIds, onSyncPublish}) => {
    const [externalData] = externalIds.filter(id => id.externalSystem === externalSystem.toLowerCase());
    const statusIndicator = externalData && externalData.status === SUCCESS ? SUCCESS : ERROR;
    const buttonType = externalData ? SYNC : PUBLISH;
    const buttonText =
        externalData && externalData.publishedAt ? `Sync to ${externalSystem}` : `Publish to ${externalSystem}`;
    let publishedDate = externalData && externalData.publishedAt ? externalData.publishedAt : 'No record exists';
    publishedDate = moment(publishedDate).isValid() ? ISODateToView(publishedDate, 'timestamp') : publishedDate;

    return (
        <div className="nexus-c-sync-publish">
            <Button appearance="default" onClick={() => onSyncPublish(externalSystem, buttonType)}>
                {buttonText}
            </Button>
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
};

SyncPublish.defaultProps = {
    externalIds: [],
    onSyncPublish: () => null,
};

export default SyncPublish;
