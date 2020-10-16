import React from 'react';
import PropTypes from 'prop-types';

import './TitleHeader.scss';

const TitleHeader = ({title, releaseYear, type, artwork}) => {
    return (
        <div className="nexus-c-title-header">
            <div className="nexus-c-title-header__artwork-container">
                <img className="nexus-c-title-header__artwork" src={artwork} alt="title header artwork" />
            </div>
            <div className="nexus-c-title-header__info-container">
                <h2 className="info-container__title">{title}</h2>
                <span className="info-container__year">{`Year: ${releaseYear}`}</span>
                <span className="info-container__type">{`Type: ${type}`}</span>
            </div>
        </div>
    );
};

TitleHeader.propTypes = {
    title: PropTypes.string.isRequired,
    releaseYear: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    artwork: PropTypes.string,
};

TitleHeader.defaultProps = {
    artwork: '',
};

export default TitleHeader;
