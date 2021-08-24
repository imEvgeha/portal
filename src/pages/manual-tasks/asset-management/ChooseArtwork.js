import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {connect} from 'react-redux';
import ArtworkActions from './artwork-actions/ArtworkActions';
import ArtworkItem from './artwork-item/ArtworkItem';
import './ChooseArtwork.scss';
import {fetchPosters} from './assetManagementActions';
import {getPosterList} from './assetManagementSelectors';

const ChooseArtwork = ({fetchResourcePosters, posterList}) => {
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        fetchResourcePosters(URL.getParamIfExists('itemId', ''));
    }, []);

    const itemClick = id => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(value => value !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }

        if (selectedItems.length === 1) {
            DOP.setErrorsCount(0);
            DOP.setData({
                selected: selectedItems,
            });
        } else {
            DOP.setErrorsCount(1);
        }
    };

    const setItems = () => {
        selectedItems.length ? setSelectedItems([]) : setSelectedItems(posterList.map(item => item.id));
    };

    let timing = '';

    return (
        <div className="choose-artwork">
            <div className="choose-artwork__header">
                <span>Title: </span>
                <span>{URL.getParamIfExists('title', '')}</span>
            </div>
            <ArtworkActions selectedItems={selectedItems.length} totalItems={posterList.length} setItems={setItems} />
            <div className="choose-artwork__list">
                {posterList.map(poster => {
                    timing = poster.split('/');
                    timing = timing[timing.length - 1];
                    return (
                        <ArtworkItem
                            key={timing}
                            poster={poster}
                            timing={timing}
                            onClick={itemClick}
                            isSelected={selectedItems.includes(timing)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

ChooseArtwork.propTypes = {
    fetchResourcePosters: PropTypes.func.isRequired,
    posterList: PropTypes.array,
};

ChooseArtwork.defaultProps = {
    posterList: [],
};

const mapStateToProps = state => ({
    posterList: getPosterList(state),
});

const mapDispatchToProps = dispatch => ({
    fetchResourcePosters: itemId => dispatch(fetchPosters(itemId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseArtwork);
