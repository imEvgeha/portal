import React from 'react';
import PropTypes from 'prop-types';
import NexusPersonsList from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/NexusPersonsList';
import {CAST_CONFIG, CREW_CONFIG} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-persons-list/constants';
import {getFilteredCastList, getFilteredCrewList} from '@vubiquity-nexus/portal-utils/lib/castCrewUtils';
import {searchPerson} from '../../../avails/right-details/rightDetailsServices';

const EditorialMetadata = ({data}) => {
    // TODO: temporary integration of NexusPersonsList here as PoC
    // will be moved after folder structure is implemented
    // no onChange integration done, should be simple
    return (
        <>
            <div>Editorial Metadata</div>
            {data && data.length > 0 && (
                <>
                    Read Only
                    <NexusPersonsList
                        searchPerson={searchPerson}
                        personsList={getFilteredCastList(data[0].castCrew, false)}
                        hasCharacter
                    />
                    <NexusPersonsList
                        searchPerson={searchPerson}
                        uiConfig={CREW_CONFIG}
                        personsList={getFilteredCrewList(data[0].castCrew, false)}
                    />
                    Editable
                    <NexusPersonsList
                        searchPerson={searchPerson}
                        uiConfig={CAST_CONFIG}
                        personsList={getFilteredCastList(data[0].castCrew, false)}
                        isEdit
                        hasCharacter
                    />
                    <NexusPersonsList
                        searchPerson={searchPerson}
                        uiConfig={CREW_CONFIG}
                        personsList={getFilteredCrewList(data[0].castCrew, false)}
                        isEdit
                    />
                </>
            )}
        </>
    );
};

EditorialMetadata.propTypes = {
    data: PropTypes.array,
};

EditorialMetadata.defaultProps = {
    data: [],
};

export default EditorialMetadata;
