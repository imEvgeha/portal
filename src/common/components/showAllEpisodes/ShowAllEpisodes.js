import React from 'react';
import PropTypes from 'prop-types';
import {
    EPISODE,
    SEASON,
    SERIES,
    MINI_SERIES,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/constants';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {useDispatch} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import {clearTitleMetadataFilter} from '../../../pages/title-metadata/titleMetadataActions';
import './ShowAllEpisodes.scss';

const ShowAllEpisodes = ({contentType, titleId}) => {
    const dispatch = useDispatch();
    const routeParams = useParams();
    const allowedContents = [SEASON, SERIES, MINI_SERIES];

    const baseUrl = '/metadata/?parentId=';

    return allowedContents.includes(contentType) ? (
        <div className="nexus-c-dynamic-form__show-all">
            <Link
                onClick={() => dispatch(clearTitleMetadataFilter())}
                to={URL.keepEmbedded(
                    `/${routeParams.realm}${baseUrl}${titleId}&contentType=${contentType === SERIES ? SEASON : EPISODE}`
                )}
            >
                Show all {contentType === SERIES ? 'seasons' : 'episodes'}
            </Link>
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
