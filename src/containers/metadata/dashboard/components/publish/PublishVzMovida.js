import React, {useEffect, useState} from 'react';
import {default as AtlaskitButton} from '@atlaskit/button';
import TitleSystems from '../../../../../constants/metadata/systems';
import moment from 'moment';

const {MOVIDA, VZ} = TitleSystems;

const PublishVzMovida = ({coreTitle, territoryMetadataList, editorialMetadataList, onSyncPublishClick}) => {

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
                const {legacyIds, vzPublishedAt, vz, movida, movidaPublishedAt, vzId, movidaId, modifiedAt} = getLegacyData(item);
                if(!legacyIds) {
                    return;
                }

                if (!vzLastUpdateCandidate) {
                    vzLastUpdateCandidate = vzPublishedAt;
                } else if (vzPublishedAt && moment(vzPublishedAt).isValid() && moment(vzLastUpdateCandidate).isBefore(vzPublishedAt)) {
                    vzLastUpdateCandidate = vzPublishedAt;
                }

                if (!movidaLastUpdateCandidate) {
                    movidaLastUpdateCandidate = movidaPublishedAt;
                } else if (movidaPublishedAt && moment(movidaPublishedAt).isValid() && moment(movidaLastUpdateCandidate).isBefore(movidaPublishedAt)) {
                    movidaLastUpdateCandidate = movidaPublishedAt;
                }

                if (isVzDisabledCandidate && !!vz) {
                    isVzDisabledCandidate = getIsDisabled(vzPublishedAt, modifiedAt, vzId);
                }
                if (isMovidaDisabledCandidate && !!movida) {
                    isMovidaDisabledCandidate = getIsDisabled(movidaPublishedAt, modifiedAt, movidaId);
                }
            });

            setVzLastUpdated(!vzLastUpdateCandidate ? 'No record exist' : vzLastUpdateCandidate);
            setMovidaLastUpdated(!movidaLastUpdateCandidate ? 'No record exist' : movidaLastUpdateCandidate);

            setVzDisabled(isVzDisabledCandidate);
            setMovidaDisabled(isMovidaDisabledCandidate);
        }

    }, [coreTitle, editorialMetadataList, territoryMetadataList]);

    const getLegacyData = (item) => {
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
        return (
            <div className='nexus-c-title-edit__sync-container-field'>
                <span
                    className={'nexus-c-title-edit__sync-indicator nexus-c-title-edit__sync-indicator--' + indicator}
                />
                <div className='nexus-c-title-edit__sync-container-field-description'>
                    <b>{name.substring(0, 1).toUpperCase() + name.substring(1, name.length)}</b> Last
                    updated: {lastUpdated}
                </div>
                <AtlaskitButton
                    appearance='primary'
                    isDisabled={isDisabled}
                    onClick={() => onSyncPublishClick(name)}
                >{buttonName}
                </AtlaskitButton>
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

export default PublishVzMovida;