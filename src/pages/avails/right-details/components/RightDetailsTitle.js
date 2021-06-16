import React from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Link} from 'react-router-dom';
import './RightDetailsTitle.scss';

const ARROW_COLOR = '#42526e';

const RightDetailsTitle = ({title, backUrl}) => {
    return (
        <div className="nexus-c-right-details-title">
            <Link to={URL.keepEmbedded(backUrl)}>
                <ArrowLeftIcon size="large" primaryColor={ARROW_COLOR} />
            </Link>
            {title}
        </div>
    );
};

RightDetailsTitle.propTypes = {
    title: PropTypes.string,
    backUrl: PropTypes.string,
};

RightDetailsTitle.defaultProps = {
    title: null,
    backUrl: '/avails/v2',
};

export default RightDetailsTitle;
