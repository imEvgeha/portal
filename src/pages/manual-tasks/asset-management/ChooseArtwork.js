import React, {useEffect, useState, useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {connect} from 'react-redux';
import ArtworkItem from './artwork-item/ArtworkItem';
import './ChooseArtwork.scss';
import {fetchPosters} from './assetManagementActions';
import {getPosterList} from './assetManagementSelectors';
import {loginAssets} from './assetManagementService';

const DOP_POP_UP_TITLE = 'Choose Artwork';
const DOP_POP_UP_MESSAGE = 'Please, select atleast one thumbnail!';

const ChooseArtwork = ({fetchResourcePosters, posterList}) => {
    const [selectedArtwork, setSelectedArtwork] = useState();
    const {openModal, closeModal} = useContext(NexusModalContext);
    const assetID = URL.getParamIfExists('assetID', '');

    const openDOPPopUp = useCallback(() => {
        const handlePopUpClick = () => {
            DOP.sendInfoToDOP(1, null);
            closeModal();
        };
        const actions = [
            {
                text: 'OK',
                onClick: handlePopUpClick,
                appearance: 'primary',
            },
        ];
        openModal(DOP_POP_UP_MESSAGE, {title: DOP_POP_UP_TITLE, width: 'medium', actions});
    }, []);

    useEffect(() => {
        loginAssets().then(() => fetchResourcePosters(assetID));
    }, []);

    useEffect(() => {
        DOP.setDOPMessageCallback(selectedArtwork ? null : () => openDOPPopUp());
    }, [selectedArtwork, openDOPPopUp]);

    const artworkClick = (id, uri) => {
        setSelectedArtwork(id);
        DOP.setErrorsCount(0);

        DOP.setData({
            chooseArtwork: {
                assetID,
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
