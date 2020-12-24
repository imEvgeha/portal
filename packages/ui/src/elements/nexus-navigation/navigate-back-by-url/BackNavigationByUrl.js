import React from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import NexusTitle from '../../nexus-title/NexusTitle';
import {backArrowColor} from '../constants';
import './BackNavigationByUrl.scss';

const BackNavigationByUrl = ({title, onNavigationClick}) => {
    return (
        <NexusTitle>
            <span className="nexus-c-right-to-match-view__link" onClick={onNavigationClick}>
                <ArrowLeftIcon size="large" primaryColor={backArrowColor} />
            </span>
            <span>{title}</span>
        </NexusTitle>
    );
};

BackNavigationByUrl.propTypes = {
    title: PropTypes.string,
    onNavigationClick: PropTypes.func,
};

BackNavigationByUrl.defaultProps = {
    title: null,
    onNavigationClick: null,
};

export default BackNavigationByUrl;
