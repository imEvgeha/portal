import React from 'react';
import PropTypes from 'prop-types';
import './TitleInfo.scss';

const IMAGE_PLACEHOLDER = 'https://www.bbsocal.com/wp-content/uploads/2018/05/image-placeholder.png';

const TitleInfo = ({title, releaseYear, contentType, titleImages, catalogueOwner}) => {
    const image = titleImages && titleImages.length ? titleImages[0] : IMAGE_PLACEHOLDER;
    return (
        <div className="nexus-c-title-info-container">
            <div className="nexus-c-title-info-container__image">
                <img src={image} alt="Title_Image" />
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
                <div>
                    <span>Catalogue Owner:</span>
                    <span>{catalogueOwner}</span>
                </div>
            </div>
        </div>
    );
};

TitleInfo.propTypes = {
    title: PropTypes.string,
    releaseYear: PropTypes.string,
    contentType: PropTypes.string,
    titleImages: PropTypes.array,
    catalogueOwner: PropTypes.string,
};

TitleInfo.defaultProps = {
    title: null,
    releaseYear: null,
    contentType: null,
    titleImages: [],
    catalogueOwner: null,
};

export default TitleInfo;
