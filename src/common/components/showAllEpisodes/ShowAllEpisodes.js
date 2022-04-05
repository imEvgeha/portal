import React from 'react';
import {EPISODE, SEASON, SERIES} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/constants';
import {useDispatch} from 'react-redux';
import {clearTitleMetadataFilter} from '../../../pages/title-metadata/titleMetadataActions';
import './ShowAllEpisodes.scss';

const ShowAllEpisodes = ({contentType, titleId}) => {
    const dispatch = useDispatch();
    const allowedContents = [SEASON, SERIES];

    const createLink = contentType => {
        const baseUrl = '/metadata/?parentId=';
        return `${baseUrl}${titleId}&contentType=${contentType === SERIES ? SEASON : EPISODE}`;
    };

    if (allowedContents.includes(contentType)) {
        return (
            <div className="nexus-c-dynamic-form__show-all">
                <a onClick={() => dispatch(clearTitleMetadataFilter())} href={createLink(contentType)}>
                    Show all {contentType === SERIES ? 'seasons' : 'episodes'}
                </a>
            </div>
        );
    }
};

export default ShowAllEpisodes;
