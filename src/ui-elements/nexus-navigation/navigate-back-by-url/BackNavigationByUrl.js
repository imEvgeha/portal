import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from '@atlaskit/page-header';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import './BackNavigationByUrl.scss';

const BackNavigationByUrl = ({title, onNavigationClick}) => (
    <div className='nexus-navigation-with-arrow' onClick={onNavigationClick}>
        <PageHeader><ArrowLeftIcon size='large'/> {title}</PageHeader>
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

