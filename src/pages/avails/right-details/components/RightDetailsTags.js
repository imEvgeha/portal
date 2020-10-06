import React from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import {TAGS} from '../constants';
import './RightDetailsTags.scss';

const RightDetailsTags = ({right}) => {
    return (
        <div className="nexus-c-right-details-tags">
            <Lozenge appearance="inprogress">SELECTED</Lozenge>
            <Lozenge appearance="inprogress">TPR RIGHT</Lozenge>
            <Lozenge appearance="inprogress">BONUS RIGHT</Lozenge>
        </div>
    );
};

RightDetailsTags.propTypes = {
    right: PropTypes.object,
};

RightDetailsTags.defaultProps = {
    right: {},
};

export default RightDetailsTags;
