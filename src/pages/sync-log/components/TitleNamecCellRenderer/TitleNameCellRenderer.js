import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const TitleNameCellRenderer = ({value, data}) => {
    return <Link to={`detail/${data.coreTitleId}`}>{value}</Link>;
};

export default TitleNameCellRenderer;

TitleNameCellRenderer.propTypes = {
    value: PropTypes.string.isRequired,
    data: PropTypes.object,
};

TitleNameCellRenderer.defaultProps = {
    data: {},
};
