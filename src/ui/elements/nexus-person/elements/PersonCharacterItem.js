import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './PersonCharacterItem.scss';

const PersonCharacterItem = ({isEdit, onClick, children}) => {
    return (
        <div
            className={classnames('nexus-c-person-character-item', {
                'nexus-c-person-character-item--is-edit': isEdit,
            })}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

PersonCharacterItem.propTypes = {
    isEdit: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

PersonCharacterItem.defaultProps = {
    isEdit: false,
};

export default PersonCharacterItem;
