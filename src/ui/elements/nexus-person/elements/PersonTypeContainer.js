import React from 'react';
import PropTypes from 'prop-types';
import Lozenge from '@atlaskit/lozenge';
import DefaultUserIcon from '../../../../assets/img/default-user.png';
import './PersonTypeContainer.scss';

const PersonTypeContainer = ({personType, personName}) => {
    return (
        <div className="nexus-c-person-type-container">
            <img src={DefaultUserIcon} alt="Person" className="nexus-c-person-type-container__img" />
            <Lozenge appearance="default">{personType}</Lozenge>
            <span>{personName}</span>
        </div>
    );
};

PersonTypeContainer.propTypes = {
    personType: PropTypes.string,
    personName: PropTypes.string,
};

PersonTypeContainer.defaultProps = {
    personType: '',
    personName: '',
};

export default PersonTypeContainer;
