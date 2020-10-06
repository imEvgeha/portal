import React from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import {TAGS} from '../constants';
import './RightDetailsTags.scss';

const RightDetailsTags = ({right}) => {
    return (
        <div className="nexus-c-right-details-tags">
            {TAGS.map((tag, idx) => {
                let isRemoved = false;
                switch (tag.label) {
                    case 'REMOVED FROM CATALOGUE':
                        if (right[tag.field] === 'true') isRemoved = true;
                        return (
                            <Lozenge key={idx} appearance={isRemoved ? 'inprogress' : null}>
                                {tag.label}
                            </Lozenge>
                        );
                    case 'BONUS RIGHT':
                    case 'TPR RIGHT':
                        return (
                            <Lozenge key={idx} appearance={right[tag.field] ? 'inprogress' : null}>
                                {tag.label}
                            </Lozenge>
                        );
                    default:
                        return null;
                }
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
