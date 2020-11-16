import React from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import './TitleDetailsHeader.scss';

const ARROW_COLOR = '#42526e';

const TitleDetailsHeader = ({goBack}) => {
    return (
        <div className="nexus-c-title-details-header">
            <span onClick={goBack}>
                <ArrowLeftIcon size="large" primaryColor={ARROW_COLOR} />
            </span>
            <div>Some text...</div>
        </div>
    );
};

TitleDetailsHeader.propTypes = {
    goBack: PropTypes.func,
};

TitleDetailsHeader.defaultProps = {
    goBack: () => null,
};

export default TitleDetailsHeader;
