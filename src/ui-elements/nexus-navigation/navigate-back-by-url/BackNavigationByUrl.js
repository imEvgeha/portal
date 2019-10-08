import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from '@atlaskit/page-header';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import './BackNavigationByUrl.scss';

export default function BackNavigationByUrl({title, onNavigationClick}) {

    return (
        <div className='nexus-navigation-with-arrow' onClick={onNavigationClick}>
            <PageHeader><ArrowLeftIcon size='large'/> {title}</PageHeader>
        </div>);
}

BackNavigationByUrl.propTypes = {
    title: PropTypes.string,
    onNavigationClick: PropTypes.func
};