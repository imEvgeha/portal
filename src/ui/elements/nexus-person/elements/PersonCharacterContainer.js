import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './PersonCharacterContainer.scss';

const PersonCharacterContainer = ({isShown, children}) => {
    return (
        <div
            className={classnames('nexus-c-person-character-container', {
                'nexus-c-person-character-container--show': isShown,
            })}
        >
            {children}
        </div>
    );
};

PersonCharacterContainer.propTypes = {
    isShown: PropTypes.bool,
};

PersonCharacterContainer.defaultProps = {
    isShown: false,
};

export default PersonCharacterContainer;
