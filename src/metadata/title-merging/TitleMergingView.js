import React from 'react';
import PropTypes from 'prop-types';
import './TitleMergingView.scss';
import {NexusTitle} from '../../ui-elements/';

const TITLE = 'Title Merging';

const TitleMergingView = props => {
    return (
        <div className="nexus-c-title-merging-view">
            <NexusTitle>{TITLE}</NexusTitle>
        </div>
    );
};

export default TitleMergingView;
