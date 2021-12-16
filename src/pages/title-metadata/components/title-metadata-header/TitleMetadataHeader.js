import React from 'react';
import PropTypes from 'prop-types';
import {TITLE_METADATA} from '../../constants';
import './TitleMetadataHeader.scss';

const TitleMetadataHeader = ({label, children, withoutTitleLabel}) => (
    <div className="nexus-c-title-metadata-header">
        {withoutTitleLabel ? null : <div className="nexus-c-title-metadata-header__label">{label}</div>}
        <div className="nexus-c-title-metadata-header__buttons-wrapper">{children}</div>
    </div>
);

TitleMetadataHeader.propTypes = {
    label: PropTypes.string,
    withoutTitleLabel: PropTypes.bool,
};

TitleMetadataHeader.defaultProps = {
    label: TITLE_METADATA,
    withoutTitleLabel: false
};

export default TitleMetadataHeader;
