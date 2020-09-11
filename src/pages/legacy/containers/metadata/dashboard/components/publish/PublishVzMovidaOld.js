import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {capitalize} from 'lodash';
import {default as AtlaskitButton} from '@atlaskit/button';
import TitleSystems from '../../../../../constants/metadata/systems';
import {ISODateToView} from '../../../../../../../util/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '../../../../../../../util/date-time/constants';
import {Can} from '../../../../../../../ability';

const {MOVIDA, VZ} = TitleSystems;

const PublishVzMovidaOld = ({coreTitle, territoryMetadataList, editorialMetadataList, onSyncPublishClick}) => {
    const [vzLastUpdated, setVzLastUpdated] = useState();
    const [movidaLastUpdated, setMovidaLastUpdated] = useState();
    const [isVzDisabled, setVzDisabled] = useState(false);
    const [isMovidaDisabled, setMovidaDisabled] = useState(false);

    useEffect(() => {
        if (coreTitle) {
            const {vzPublishedAt, movidaPublishedAt, vzId, movidaId, modifiedAt} = getLegacyData(coreTitle);
            let vzLastUpdateCandidate = vzPublishedAt;
            let movidaLastUpdateCandidate = movidaPublishedAt;

            let isVzDisabledCandidate = getIsDisabled(vzLastUpdateCandidate, modifiedAt, vzId);
            let isMovidaDisabledCandidate = getIsDisabled(movidaLastUpdateCandidate, modifiedAt, movidaId);

            const metadata = editorialMetadataList.concat(territoryMetadataList);
            metadata.forEach(item => {
                const {
                    legacyIds,
                    vzPublishedAt,
                    vz,
                    movida,
                    movidaPublishedAt,
                    vzId,
                    movidaId,
                    modifiedAt,
                } = getLegacyData(item);
                if (!legacyIds) {
                    return;
                }

                if (!vzLastUpdateCandidate) {
                    vzLastUpdateCandidate = vzPublishedAt;
                } else if (
                    vzPublishedAt &&
                    moment(vzPublishedAt).isValid() &&
                    moment(vzLastUpdateCandidate).isBefore(vzPublishedAt)
                ) {
                    vzLastUpdateCandidate = vzPublishedAt;
                }

                if (!movidaLastUpdateCandidate) {
                    movidaLastUpdateCandidate = movidaPublishedAt;
                } else if (
                    movidaPublishedAt &&
                    moment(movidaPublishedAt).isValid() &&
                    moment(movidaLastUpdateCandidate).isBefore(movidaPublishedAt)
                ) {
                    movidaLastUpdateCandidate = movidaPublishedAt;
                }

                if (isVzDisabledCandidate && !!vz && !!vzId) {
                    isVzDisabledCandidate = getIsDisabled(vzPublishedAt, modifiedAt, vzId);
                }
                if (isMovidaDisabledCandidate && !!movida && !!movidaId) {
                    isMovidaDisabledCandidate = getIsDisabled(movidaPublishedAt, modifiedAt, movidaId);
                }
            });

            setVzLastUpdated(!vzLastUpdateCandidate ? 'No record exists' : vzLastUpdateCandidate);
            setMovidaLastUpdated(!movidaLastUpdateCandidate ? 'No record exists' : movidaLastUpdateCandidate);

            setVzDisabled(isVzDisabledCandidate);
            setMovidaDisabled(isMovidaDisabledCandidate);
        }
    }, [coreTitle, editorialMetadataList, territoryMetadataList]);

    const getLegacyData = item => {
        const {legacyIds, modifiedAt} = item;
        const {vz, movida} = legacyIds || {};
        const vzPublishedAt = (vz || {}).publishedAt;
        const movidaPublishedAt = (movida || {}).publishedAt;
        const {vzId} = vz || {};
        const {movidaId} = movida || {};

        return {legacyIds, vz, movida, vzPublishedAt, movidaPublishedAt, vzId, movidaId, modifiedAt};
    };

    const getIsDisabled = (publishedAt, modifiedAt, legacyId) => {
        return !!legacyId && !!publishedAt && moment(publishedAt).isSameOrAfter(modifiedAt);
    };

    const renderSyncField = (name, lastUpdated, isDisabled) => {
        const buttonName = moment(lastUpdated).isValid() ? 'Sync' : 'Publish';
        const indicator = isDisabled ? 'success' : 'error';

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
                        isDisabled={isDisabled}
                        onClick={() => onSyncPublishClick(name)}
                    >
                        {buttonName}
                    </AtlaskitButton>
                </Can>
            </div>
        );
    };

    return (
        <>
            {renderSyncField(VZ, vzLastUpdated, isVzDisabled)}
            {renderSyncField(MOVIDA, movidaLastUpdated, isMovidaDisabled)}
        </>
    );
};

export default PublishVzMovidaOld;
