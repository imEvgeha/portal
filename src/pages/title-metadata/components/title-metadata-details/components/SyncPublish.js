import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import moment from 'moment';
import {ISODateToView} from '../../../../../util/date-time/DateTimeUtils';
import './SyncPublish.scss';

const SyncPublish = ({externalSystem, externalIds}) => {
    const [externalData] = externalIds.filter(id => id.externalSystem === externalSystem);
    const buttonText =
        externalData && externalData.publishedAt
            ? `Sync to ${externalSystem.toUpperCase()}`
            : `Publish to ${externalSystem.toUpperCase()}`;
    let publishedDate = externalData && externalData.publishedAt ? externalData.publishedAt : 'No record exists';
    publishedDate = moment(publishedDate).isValid() ? ISODateToView(publishedDate, 'timestamp') : publishedDate;

    return (
        <div className="nexus-c-sync-publish">
            <Button appearance="default">{buttonText}</Button>
            <div className="nexus-c-sync-publish__msg">{publishedDate}</div>
        </div>
    );
};

SyncPublish.propTypes = {
    externalSystem: PropTypes.string.isRequired,
    externalIds: PropTypes.array,
};

SyncPublish.defaultProps = {
    externalIds: [],
};

export default SyncPublish;
