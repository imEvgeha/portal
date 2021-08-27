import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {connect} from 'react-redux';
import ArtworkItem from './artwork-item/ArtworkItem';
import './ChooseArtwork.scss';
import {fetchPosters} from './assetManagementActions';
import {getPosterList} from './assetManagementSelectors';
import {loginAssets} from './assetManagementService';
import useDOPIntegration from './util/hooks/useDOPIntegration';
import {ARTWORK_DOP_STORAGE} from './constants';

const ChooseArtwork = ({fetchResourcePosters, posterList}) => {
    const [selectedArtwork, setSelectedArtwork] = useState();
    // DOP integration
    useDOPIntegration(selectedArtwork ? 1 : 0, ARTWORK_DOP_STORAGE);

    useEffect(() => {
        loginAssets().then(() => fetchResourcePosters(URL.getParamIfExists('assetID', '')));
    }, []);

    const artworkClick = (id, uri) => {
        setSelectedArtwork(id);
        DOP.setErrorsCount(0);
        DOP.setData({
            chooseArtwork: {
                assetID: id,
                selectedArtworkUri: uri,
            },
        });
    };
    let timing = '';

    return (
        <div className="choose-artwork">
            <div className="choose-artwork__header">
                <span>Title: </span>
                <span>{URL.getParamIfExists('title', '')}</span>
            </div>
            <div className="choose-artwork__list">
                {posterList.map(poster => {
                    timing = poster.split('/');
                    timing = timing[timing.length - 1];
                    return (
                        <ArtworkItem
                            key={timing}
                            poster={poster}
                            timing={timing}
                            onClick={artworkClick}
                            isSelected={selectedArtwork === timing}
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
