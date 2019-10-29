import React from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import './BackNavigationByUrl.scss';

const BackNavigationByUrl = ({title, onNavigationClick}) => (
    <div className='nexus-c-right-to-match-view__page-header'>
        <span className="nexus-c-right-to-match-view__link" onClick={onNavigationClick}>
            <ArrowLeftIcon size='xlarge' primaryColor={'#42526E'}/>
        </span>
        <span className="nexus-c-right-to-match-view__page-header-title">{title}</span>
    </div>
);

BackNavigationByUrl.propTypes = {
    title: PropTypes.string,
    onNavigationClick: PropTypes.func
};

BackNavigationByUrl.defaultProps = {
    title: null,
    onNavigationClick: null,
};

export default BackNavigationByUrl;

