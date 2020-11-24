import React, {useState} from 'react';
import ArtworkActions from './artwork-actions/ArtworkActions';
import ArtworkItem from './artwork-item/ArtworkItem';
import {LIST} from './constants';
import './ChooseArtwork.scss';

const ChooseArtwork = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalItems, setTotalItems] = useState(LIST);

    const itemClick = id => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(value => value !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const setItems = () => {
        selectedItems.length ? setSelectedItems([]) : setSelectedItems(totalItems.map(item => item.id));
    };

    return (
        <div className="choose-artwork">
            <div className="choose-artwork__header">
                <span>Title: </span>
                <span>Star Wars (1977)</span>
            </div>
            <ArtworkActions selectedItems={selectedItems} totalItems={totalItems} setItems={setItems} />
            <div className="choose-artwork__list">
                {LIST.map(item => (
                    <ArtworkItem
                        key={item.id}
                        item={item}
                        onClick={() => itemClick(item.id)}
                        isSelected={selectedItems.includes(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};

ChooseArtwork.propTypes = {};

ChooseArtwork.defaultProps = {};

export default ChooseArtwork;
