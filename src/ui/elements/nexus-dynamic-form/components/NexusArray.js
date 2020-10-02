import React from 'react';
import PropTypes from 'prop-types';
import {VIEWS} from '../constants';
import './NexusArray.scss';

const NexusArray = ({name, view, data, ...props}) => {
    return <div className="nexus-c-array">aaa</div>;
};

NexusArray.propTypes = {
    name: PropTypes.string.isRequired,
    view: PropTypes.string,
    data: PropTypes.array,
};

NexusArray.defaultProps = {
    view: VIEWS.VIEW,
    data: [],
};

export default NexusArray;
