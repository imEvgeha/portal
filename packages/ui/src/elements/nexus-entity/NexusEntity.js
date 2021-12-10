import React from 'react';
import PropTypes from 'prop-types';
import EntityActions from './entity-actions/EntityActions';
import './NexusEntity.scss';

const NexusEntity = ({heading, tag, season, episode, actions}) => {
    return (
        <div className="entity container-fluid">
            <div className="row section align-items-center">
                <div className="col-sm-6">{heading}</div>
                <div className="col-sm-6">
                    <EntityActions actions={actions} tag={tag} season={season} episode={episode} />
                </div>
            </div>
        </div>
    );
};

NexusEntity.propTypes = {
    heading: PropTypes.element,
    tag: PropTypes.string || PropTypes.element,
    season: PropTypes.string || PropTypes.element,
    episode: PropTypes.string || PropTypes.element,
    actions: PropTypes.array,
};

NexusEntity.defaultProps = {
    heading: <span />,
    tag: '',
    season: '',
    episode: '',
    actions: [],
};

export default NexusEntity;
