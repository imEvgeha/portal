import React from 'react';
import PropTypes from 'prop-types';
import {TITLE_METADATA} from '../../constants';
import './TitleMetadataHeader.scss';

const TitleMetadataHeader = ({label, children}) => (
    <div className="nexus-c-title-metadata-header">
        <div className="nexus-c-title-metadata-header__buttons-wrapper">{children}</div>
    </div>
);

TitleMetadataHeader.propTypes = {
    label: PropTypes.string,
};

TitleMetadataHeader.defaultProps = {
    label: TITLE_METADATA,
};

export default TitleMetadataHeader;
