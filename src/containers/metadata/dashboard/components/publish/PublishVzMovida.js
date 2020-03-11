import React, {useEffect, useState} from 'react';
import {default as AtlaskitButton} from '@atlaskit/button';
import TitleSystems from '../../../../../constants/metadata/systems';
import moment from 'moment';

const {MOVIDA, VZ} = TitleSystems;

function PublishVzMovida({coreTitle, territoryMetadataList, editorialMetadataList, onSyncPublishClick}) {

    const [vzLastUpdated, setVzLastUpdated] = useState();
    const [movidaLastUpdated, setMovidaLastUpdated] = useState();
    const [isVzDisabled, setVzDisabled] = useState(false);
    const [isMovidaDisabled, setMovidaDisabled] = useState(false);

    useEffect(() => {
        if (coreTitle) {
            const coreTitleLegacyDate = getLegacyData(coreTitle);
            let vzLastUpdateCandidate = coreTitleLegacyDate.vzPublishedAt;
            let movidaLastUpdateCandidate = coreTitleLegacyDate.movidaPublishedAt;

            let isVzDisabledCandidate = getIsDisabled(vzLastUpdateCandidate, coreTitleLegacyDate.modifiedAt);
            let isMovidaDisabledCandidate = getIsDisabled(movidaLastUpdateCandidate, coreTitleLegacyDate.modifiedAt);

            const metadata = editorialMetadataList.concat(territoryMetadataList);
            metadata.forEach(item => {
                const itemLegacyData = getLegacyData(item);
                if (!vzLastUpdateCandidate) {
                    vzLastUpdateCandidate = itemLegacyData.vzPublishedAt;
                } else if (itemLegacyData.vzPublishedAt && moment(itemLegacyData.vzPublishedAt).isValid() && moment(vzLastUpdateCandidate).isBefore(itemLegacyData.vzPublishedAt)) {
                    vzLastUpdateCandidate = itemLegacyData.vzPublishedAt;
                }

                if (!movidaLastUpdateCandidate) {
                    movidaLastUpdateCandidate = itemLegacyData.movidaPublishedAt;
                } else if (itemLegacyData.movidaPublishedAt && moment(itemLegacyData.movidaPublishedAt).isValid() && moment(movidaLastUpdateCandidate).isBefore(itemLegacyData.movidaPublishedAt)) {
                    movidaLastUpdateCandidate = itemLegacyData.movidaPublishedAt;
                }

                if (!isVzDisabledCandidate) {
                    isVzDisabledCandidate = getIsDisabled(itemLegacyData.vzPublishedAt, itemLegacyData.modifiedAt);
                }
                if (!isMovidaDisabledCandidate) {
                    isMovidaDisabledCandidate = getIsDisabled(itemLegacyData.movidaPublishedAt, itemLegacyData.modifiedAt);
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

        return {vzPublishedAt, movidaPublishedAt, modifiedAt};
    };

    const getIsDisabled = (publishedAt, modifiedAt) => {
        return !!publishedAt && moment(publishedAt).isSameOrAfter(modifiedAt);
    };

    const renderSyncField = (name, lastUpdated, isDisabled) => {
        const buttonName = moment(lastUpdated).isValid() ? 'Sync' : 'Publish';
        const indicator = isDisabled ? 'success' : 'error';
        return (
            <div className='nexus-c-title-edit__sync-container-field'>
                <span
                    className={'nexus-c-title-edit__sync-indicator nexus-c-title-edit__sync-indicator--' + indicator}/>
                <div className='nexus-c-title-edit__sync-container-field-description'>
                    <b>{name.substring(0, 1).toUpperCase() + name.substring(1, name.length)}</b> Last
                    updated: {lastUpdated}
                </div>
                <AtlaskitButton appearance='primary' isDisabled={isDisabled}
                                onClick={() => onSyncPublishClick(name)}>{buttonName}</AtlaskitButton>
            </div>
        );
    };

    return (
        <>
            {renderSyncField(VZ, vzLastUpdated, isVzDisabled)}
            {renderSyncField(MOVIDA, movidaLastUpdated, isMovidaDisabled)}
        </>
    );
}

export default PublishVzMovida;