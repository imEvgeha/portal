import React from 'react';
import PropTypes from 'prop-types';
import {POSTER_RESOLUTION} from '../../constants';
import {convertMsToTime} from '../../util/time';
import './AtrworkItem.scss';

const ArtworkItem = ({poster, timing, onClick, isSelected}) => {
    const parsedPoster = poster.split('?url=true/')[1];
    // const imageRef = React.useRef();
    //
    // React.useEffect(() => {
    //     const headers = new Headers();
    //     headers.append('Authorization', `token ${localStorage.getItem('token')}`);
    //
    //     fetch(poster, {method: 'GET', headers})
    //         .then(res => res.blob()) // Gets the response and returns it as a blob
    //         .then(blob => {
    //             const objectURL = URL.createObjectURL(blob);
    //             imageRef.current.src = objectURL;
    //         });
    // }, []);

    return (
        <div className={`artwork-item ${isSelected ? 'artwork-item--selected' : ''}`}>
            <img
                src={poster}
                id="myImg"
                alt={timing}
                className="artwork-item__image"
                onClick={() => onClick(timing, parsedPoster)}
            />
            <div className="artwork-item__details">
                <div>{POSTER_RESOLUTION}</div>
                <div>{convertMsToTime(timing.split('@')[0])}</div>
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
