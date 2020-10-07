import React from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import {TAGS} from '../constants';
import './RightDetailsTags.scss';

const RightDetailsTags = ({right}) => {
    return (
        <div className="nexus-c-right-details-tags">
            {TAGS.map((tag, idx) => {
                return (
                    <Lozenge key={idx} appearance={right[tag.field] ? 'inprogress' : null}>
                        {tag.label}
                    </Lozenge>
                );
            })}
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
