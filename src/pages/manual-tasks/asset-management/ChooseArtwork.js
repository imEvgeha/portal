import React, {useEffect, useState, useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {connect} from 'react-redux';
import Loading from '../../static/Loading';
import './ChooseArtwork.scss';
import {fetchPosters, fetchAsset} from './assetManagementReducer';
import {posterListSelector, assetDetailsSelector} from './assetManagementSelectors';
import {loginAssets} from './assetManagementService';
import UploadArtworkForm from './components/UploadArtworkForm';
import ArtworkItem from './components/artwork-item/ArtworkItem';

const UPLOAD_ARTWORK_TITLE = 'Upload Artwork';
const DOP_POP_UP_TITLE = 'Choose Artwork';
const DOP_POP_UP_MESSAGE = 'Please, select atleast one thumbnail!';

const ChooseArtwork = ({fetchResourcePosters, posterList, fetchAsset, asset}) => {
    const [selectedArtwork, setSelectedArtwork] = useState();
    const {openModal, closeModal} = useContext(NexusModalContext);
    const sourceMediaAssetID = URL.getParamIfExists('sourceMediaAssetID', '');
    const artworkAssetID = URL.getParamIfExists('artworkAssetID', '');

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

    const openUploadModal = () => {
        openModal(<UploadArtworkForm closeModal={closeModal} tenantId={asset.tenantId} asset={asset} />, {
            title: UPLOAD_ARTWORK_TITLE,
            width: 'medium',
            shouldCloseOnOverlayClick: false,
        });
    };

    useEffect(() => {
        fetchAsset(artworkAssetID);
        loginAssets().then(() => fetchResourcePosters(sourceMediaAssetID));
    }, []);

    useEffect(() => {
        DOP.setDOPMessageCallback(selectedArtwork ? null : () => openDOPPopUp());
    }, [selectedArtwork, openDOPPopUp]);

    const artworkClick = (id, uri) => {
        setSelectedArtwork(id);
        DOP.setErrorsCount(0);

        DOP.setData({
            chooseArtwork: {
                sourceMediaAssetID,
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
            <div className="artwork-actions">
                {asset ? (
                    <Button onClick={openUploadModal} appearance="primary">
                        Upload
                    </Button>
                ) : (
                    <Loading />
                )}
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
    fetchAsset: PropTypes.func.isRequired,
    asset: PropTypes.object,
    posterList: PropTypes.array,
};

ChooseArtwork.defaultProps = {
    posterList: [],
    asset: null,
};

const mapStateToProps = state => ({
    posterList: posterListSelector(state),
    asset: assetDetailsSelector(state),
});

const mapDispatchToProps = dispatch => ({
    fetchResourcePosters: sourceMediaAssetID => dispatch(fetchPosters(sourceMediaAssetID)),
    fetchAsset: sourceMediaAssetID => dispatch(fetchAsset(sourceMediaAssetID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseArtwork);
