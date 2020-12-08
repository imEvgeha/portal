import React from 'react';
import PropTypes from 'prop-types';
import {POSTER_RESOLUTION} from '../constants';
import './AtrworkItem.scss';

const ArtworkItem = ({poster, timing, onClick, isSelected}) => {
    return (
        <div className={`artwork-item ${isSelected ? 'artwork-item--selected' : ''}`}>
            <img src={poster} alt={timing} className="artwork-item__image" onClick={() => onClick(timing)} />
            <div className="artwork-item__details">
                <div>{POSTER_RESOLUTION}</div>
                <div>{timing}</div>
            </div>
        </div>
    );
};

ArtworkItem.propTypes = {
    poster: PropTypes.string,
    timing: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
};

ArtworkItem.defaultProps = {
    poster: '',
    timing: '',
    isSelected: false,
};

export default ArtworkItem;
