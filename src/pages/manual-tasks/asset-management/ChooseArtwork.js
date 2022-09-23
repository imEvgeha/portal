import React, {useEffect, useState, useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {URL as VuURL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {Skeleton} from 'primereact/skeleton';
import {VirtualScroller} from 'primereact/virtualscroller';
import {connect, useDispatch} from 'react-redux';
import Loading from '../../static/Loading';
import './ChooseArtwork.scss';
import {fetchPosters, fetchAsset, removeMediaIngest} from './assetManagementReducer';
import {posterListSelector, assetDetailsSelector, mediaIngestsSelector} from './assetManagementSelectors';
import {fetchPoster, loginAssets} from './assetManagementService';
import UploadArtworkForm from './components/UploadArtworkForm';
import ArtworkItem from './components/artwork-item/ArtworkItem';

const UPLOAD_ARTWORK_TITLE = 'Upload Artwork';
const DOP_POP_UP_TITLE = 'Choose Artwork';
const DOP_POP_UP_MESSAGE = 'Please select at least one image';
const IMG_WIDTH = 300;
const IMG_HEIGHT = 200;

const ChooseArtwork = ({fetchResourcePosters, posterList, fetchAsset, asset, jobIds}) => {
    const dispatch = useDispatch();
    const [selectedArtwork, setSelectedArtwork] = useState();
    const [posters, setPosters] = useState([]);
    const [lazyLoading, setLazyLoading] = useState(false);
    const [itemSize] = useState(Math.trunc((window.screen.width - 50) / IMG_WIDTH));

    const {openModal, closeModal} = useContext(NexusModalContext);
    const sourceMediaAssetID = VuURL.getParamIfExists('sourceMediaAssetID', '');
    const artworkAssetID = VuURL.getParamIfExists('artworkAssetID', '');

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
        setPosters(Array.from({length: posterList.length}));
        setLazyLoading(false);
    }, [posterList]);

    useEffect(() => {
        fetchAsset(artworkAssetID);
        loginAssets().then(() => fetchResourcePosters(sourceMediaAssetID));
    }, []);

    useEffect(() => {
        DOP.setDOPMessageCallback(selectedArtwork || jobIds.length !== 0 ? null : () => openDOPPopUp());
    }, [selectedArtwork, jobIds, openDOPPopUp]);

    const artworkClick = (id, uri) => {
        setSelectedArtwork(id);
        DOP.setErrorsCount(0);

        DOP.setData({
            chooseArtwork: {
                sourceMediaAssetID,
                selectedArtworkUri: uri,
            },
        });
        dispatch(removeMediaIngest());
    };

    const basicItemTemplate = item => {
        const timing = item?.url?.split('/')?.at(-1);
        return (
            <div className="nexus-c-scroll-item">
                <ArtworkItem
                    key={timing}
                    poster={item?.img}
                    timing={timing}
                    onClick={() => artworkClick(timing, item?.url)}
                    isSelected={selectedArtwork === timing}
                />
            </div>
        );
    };

    const onLazyLoad = event => {
        const {first, last} = event;
        const positionsToCheck = posters.slice(first, last);
        if (posters.includes(undefined) && positionsToCheck.includes(undefined) && !lazyLoading) {
            setLazyLoading(true);

            const notDefinedItems = [];
            positionsToCheck.forEach((item, index) => !item && notDefinedItems.push(index));
            const firstItem = notDefinedItems[0] + first;
            const lastItem = first + notDefinedItems.at(-1) + 1;
            const postersInView = posterList.slice(firstItem, lastItem);
            const postersToFetch = postersInView.map(url => fetchPoster(url));
            const lazyItems = [...posters];

            Promise.all(postersToFetch).then(res => {
                let counter = 0;
                for (let i = firstItem; i < lastItem; i++) {
                    lazyItems[i] = {img: URL.createObjectURL(res[counter]), url: postersInView[counter]};
                    counter++;
                }
                setLazyLoading(false);
                setPosters(lazyItems);
            });
        }
    };

    const basicLoadingTemplate = () => {
        return (
            <div className="nexus-c-loading-item px-2">
                <Skeleton width="100%" height="100%" />
            </div>
        );
    };

    return (
        <div className="choose-artwork">
            <div className="choose-artwork__header">
                <span>Title: </span>
                <span>{VuURL.getParamIfExists('title', '')}</span>
            </div>
            <div className="artwork-actions">
                {asset ? (
                    <Button className="p-button-outlined" label="Upload" onClick={openUploadModal} />
                ) : (
                    <Loading />
                )}
            </div>
            <div className="nexus-c-artwork-items">
                <VirtualScroller
                    items={posters}
                    itemSize={Math.trunc(IMG_HEIGHT / itemSize)}
                    itemTemplate={basicItemTemplate}
                    scrollHeight="100%"
                    lazy
                    onLazyLoad={onLazyLoad}
                    showLoader
                    loading={lazyLoading}
                    loadingTemplate={basicLoadingTemplate}
                />
            </div>
        </div>
    );
};

ChooseArtwork.propTypes = {
    fetchResourcePosters: PropTypes.func.isRequired,
    fetchAsset: PropTypes.func.isRequired,
    asset: PropTypes.object,
    posterList: PropTypes.array,
    jobIds: PropTypes.array,
};

ChooseArtwork.defaultProps = {
    posterList: [],
    asset: null,
    jobIds: [],
};

const mapStateToProps = state => ({
    posterList: posterListSelector(state),
    asset: assetDetailsSelector(state),
    jobIds: mediaIngestsSelector(state),
});

const mapDispatchToProps = dispatch => ({
    fetchResourcePosters: sourceMediaAssetID => dispatch(fetchPosters(sourceMediaAssetID)),
    fetchAsset: sourceMediaAssetID => dispatch(fetchAsset(sourceMediaAssetID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseArtwork);
