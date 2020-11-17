import React from 'react';
import PropTypes from 'prop-types';
import './TitleInfo.scss';

const TitleInfo = ({title, releaseYear, contentType, titleImageSrc}) => {
    return (
        <div className="nexus-c-title-info-container">
            <div className="nexus-c-title-info-container__image">
                <img src={titleImageSrc} alt="some_img" />
            </div>
            <div className="nexus-c-title-info-container__info">
                <div>{title}</div>
                <div>
                    <span>Year:</span>
                    <span>{releaseYear}</span>
                </div>
                <div>
                    <span>Type:</span>
                    <span>{contentType}</span>
                </div>
            </div>
        </div>
    );
};

TitleInfo.propTypes = {
    title: PropTypes.string,
    releaseYear: PropTypes.string,
    contentType: PropTypes.string,
    titleImageSrc: PropTypes.string,
};

TitleInfo.defaultProps = {
    title: null,
    releaseYear: null,
    contentType: null,
    titleImageSrc: null,
};

export default TitleInfo;
