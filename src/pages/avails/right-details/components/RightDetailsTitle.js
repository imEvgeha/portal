import React from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {Link} from 'react-router-dom';
import './RightDetailsTitle.scss';

const ARROW_COLOR = '#42526e';

const RightDetailsTitle = ({title, previousUrl}) => {
    return (
        <div className="nexus-c-right-details-title">
            <Link to={previousUrl}>
                <ArrowLeftIcon size="large" primaryColor={ARROW_COLOR} />
            </Link>
            {title}
        </div>
    );
};

RightDetailsTitle.propTypes = {
    title: PropTypes.string,
    previousUrl: PropTypes.string.isRequired,
};

RightDetailsTitle.defaultProps = {
    title: null,
};

export default RightDetailsTitle;
