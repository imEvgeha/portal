import React from 'react';
import PropTypes from 'prop-types';

const RightDetailsShrinkedBottom = ({name, value}) => {
    return (
        <p>
            {name}: {value}
        </p>
    );
};

RightDetailsShrinkedBottom.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
};

RightDetailsShrinkedBottom.defaultProps = {
    name: null,
    value: null,
};

export default RightDetailsShrinkedBottom;
