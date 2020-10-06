import React from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import './RightDetailsTitle.scss';

const ARROW_COLOR = '#42526e';

const RightDetailsTitle = ({title, goBack}) => {
    return (
        <div className="nexus-c-right-details-title">
            <span onClick={goBack}>
                <ArrowLeftIcon size="large" primaryColor={ARROW_COLOR} />
            </span>
            {title}
        </div>
    );
};

RightDetailsTitle.propTypes = {
    title: PropTypes.string,
    goBack: PropTypes.func,
};

RightDetailsTitle.defaultProps = {
    title: null,
    goBack: () => null,
};

export default RightDetailsTitle;
