import React from 'react';
import PropTypes from 'prop-types';
import './RightsRepositoryHeader.scss';
import MoreIcon from '../../../../../assets/more-icon.svg';
import RightsIcon from '../../../../../assets/rights.svg';

const RightsRepositoryHeader = ({title}) => (
    <div className="nexus-c-rights-repository-header">
        <div className="nexus-c-rights-repository-header__title">
            <RightsIcon fill="#42526E" />
            <span className="nexus-c-rights-repository-header__title-text">{title}</span>
        </div>
        <MoreIcon
            fill="#A5ADBA"
            width="24"
            height="24"
        />
    </div>
);

RightsRepositoryHeader.propTypes = {
    title: PropTypes.string,
};

RightsRepositoryHeader.defaultProps = {
    title: 'Rights',
};

export default RightsRepositoryHeader;
