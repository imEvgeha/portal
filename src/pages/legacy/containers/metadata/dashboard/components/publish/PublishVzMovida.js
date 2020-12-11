import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import {default as AtlaskitButton} from '@atlaskit/button';
import TitleSystems from '../../../../../constants/metadata/systems';
import {ISODateToView} from '@vubiquity-nexus/portal-utils/lib/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '@vubiquity-nexus/portal-utils/lib/date-time/constants';
import {Can} from '../../../../../../../ability';
import {ERROR, SUCCESS, SYNC, PUBLISH} from './PublishConstants';

const {MOVIDA, VZ} = TitleSystems;

const PublishVzMovida = ({onSyncPublishClick, externalIDs, isSyncingVZ, isSyncingMovida}) => {
    const renderSyncField = (name, externalID, isSyncing) => {
        const buttonName = !!externalID ? SYNC : PUBLISH;
        const indicator = externalID && externalID.status === SUCCESS ? SUCCESS : ERROR;

        const lastUpdated = externalID ? externalID.publishedAt : '';
        // If lastUpdated is a valid date, then format it to a localized and user-friendly format
        // otherwise it's a message, so display the message. (e.g. 'No record exists')
        const dateToShow = moment(lastUpdated).isValid()
            ? ISODateToView(lastUpdated, DATETIME_FIELDS.TIMESTAMP)
            : lastUpdated;

        return (
            <div className="nexus-c-title-edit__sync-container-field">
                <span
                    className={'nexus-c-title-edit__sync-indicator nexus-c-title-edit__sync-indicator--' + indicator}
                />
                <div className="nexus-c-title-edit__sync-container-field-description">
                    <b>{capitalize(name)}</b> Last updated: {dateToShow}
                </div>
                <Can I="update" a="Metadata">
                    <AtlaskitButton
                        appearance="primary"
                        onClick={() => onSyncPublishClick(name, buttonName)}
                        isLoading={buttonName === SYNC ? isSyncing : undefined}
                    >
                        {buttonName}
                    </AtlaskitButton>
                </Can>
            </div>
        );
    };

    const vzExternalID = externalIDs && externalIDs.find(e => e.externalSystem === VZ);
    const movidaExternalID = externalIDs && externalIDs.find(e => e.externalSystem === MOVIDA);
    return (
        <>
            {renderSyncField(VZ, vzExternalID, isSyncingVZ)}
            {renderSyncField(MOVIDA, movidaExternalID, isSyncingMovida)}
        </>
    );
};

PublishVzMovida.propTypes = {
    onSyncPublishClick: PropTypes.func.isRequired,
    externalIDs: PropTypes.array,
    isSyncingVZ: PropTypes.bool,
    isSyncingMovida: PropTypes.bool,
};

PublishVzMovida.defaultProps = {
    externalIDs: null,
    isSyncingVZ: false,
    isSyncingMovida: false,
};

export default PublishVzMovida;
