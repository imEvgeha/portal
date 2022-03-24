import React from 'react';
import PropTypes from 'prop-types';
import ImagePlaceholderIcon from '@vubiquity-nexus/portal-assets/img/img_placeholder.png';
import './TitleInfo.scss';

const TitleInfo = ({title, releaseYear, contentType, titleImages, catalogueOwner}) => {
    const image = titleImages && titleImages.length ? titleImages[0] : ImagePlaceholderIcon;
    return (
        <div className="nexus-c-title-info-container">
            <div className="nexus-c-title-info-container__image">
                <img src={image} alt="Title_Image" />
            </div>
            <div className="nexus-c-title-info-container__info">
                <div>{title}</div>
                <div>
                    <span className="nexus-c-title-info-container__label">Year:</span>
                    <span>{releaseYear}</span>
                </div>
                <div>
                    <span className="nexus-c-title-info-container__label">Type:</span>
                    <span>{contentType}</span>
                </div>
                {catalogueOwner && (
                    <div>
                        <span className="nexus-c-title-info-container__label--co">Catalogue Owner:</span>
                        <span>{catalogueOwner}</span>
                    </div>
                )}
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
