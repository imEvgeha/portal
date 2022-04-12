import React from 'react';
import PropTypes from 'prop-types';
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

    return allowedContents.includes(contentType) ? (
        <div className="nexus-c-dynamic-form__show-all">
            <a onClick={() => dispatch(clearTitleMetadataFilter())} href={createLink(contentType)}>
                Show all {contentType === SERIES ? 'seasons' : 'episodes'}
            </a>
        </div>
    ) : (
        <div />
    );
};

ShowAllEpisodes.propTypes = {
    contentType: PropTypes.string,
    titleId: PropTypes.string,
};

ShowAllEpisodes.defaultProps = {
    contentType: '',
    titleId: 'PropTypes.string',
};

export default ShowAllEpisodes;
