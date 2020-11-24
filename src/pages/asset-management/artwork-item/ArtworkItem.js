import React from 'react';
import PropTypes from 'prop-types';
import './AtrworkItem.scss';

const ArtworkItem = ({item, onClick, isSelected}) => {
    return (
        <div className={`artwork-item ${isSelected ? 'artwork-item--selected' : ''}`}>
            <img className="artwork-item__image" onClick={onClick} />
            <div className="artwork-item__id">{item.id}</div>
            <div className="artwork-item__details">
                <div>{item.resolution}</div>
                <div>{item.timeFrame}</div>
            </div>
        </div>
    );
};

ArtworkItem.propTypes = {
    item: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
};

ArtworkItem.defaultProps = {
    item: {},
    isSelected: false,
};

export default ArtworkItem;
