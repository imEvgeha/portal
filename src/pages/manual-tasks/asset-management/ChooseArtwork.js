import React, {useEffect, useState, useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {URL as VuURL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {Skeleton} from 'primereact/skeleton';
import {VirtualScroller} from 'primereact/virtualscroller';
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
const CHUNK_SIZE = 5;
const IMG_WIDTH = 300;
const IMG_HEIGHT = 200;

const ChooseArtwork = ({fetchResourcePosters, posterList, fetchAsset, asset}) => {
    const tmpPosters = [
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
        'http://vidispine-5-6-stg.misc.odg.ondemand.co.uk/API/poster/VX-6/VX-10705;version=0/2735733@24000',
    ];
    const [selectedArtwork, setSelectedArtwork] = useState();
    const [posters, setPosters] = useState([]);
    const [lazyLoading, setLazyLoading] = useState(false);
    const [itemSize, setItemSize] = useState(Math.trunc((window.screen.width - 50) / IMG_WIDTH));

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
        setPosters(Array.from({length: tmpPosters.length}));
        setLazyLoading(false);

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

    const basicItemTemplate = (item, options) => {
        const timing = item?.split('/')?.at(-1);
        // timing = timing && timing[timing.length - 1];
        return (
            <div className="scroll-item">
                <div>{options.index}</div>
                <ArtworkItem
                    key={timing}
                    poster={item}
                    timing={timing}
                    onClick={artworkClick}
                    isSelected={selectedArtwork === timing}
                />
            </div>
        );
    };

    const onLazyLoad = event => {
        const {first, last} = event;
        const positionsToCheck = posters.slice(first, last);
        if (posters.includes(undefined) && positionsToCheck.includes(undefined)) {
            setLazyLoading(true);
            const postersToFetch = tmpPosters.slice(first, last).map(url => fetchPoster(url));
            const lazyItems = [...posters];
            Promise.all(postersToFetch).then(res => {
                let counter = 0;
                for (let i = first; i < last; i++) {
                    lazyItems[i] = URL.createObjectURL(res[counter]);
                    counter++;
                }
                setLazyLoading(false);
                setPosters(lazyItems);
            });
        }
    };

    const fetchPoster = poster => {
        const headers = new Headers();
        headers.append('Authorization', `token ${localStorage.getItem('token')}`);

        return fetch(poster, {method: 'GET', headers}).then(res => res.blob()); // Gets the response and returns it as a blob
        // .then(blob => {
        //     const imageRef = React.useRef();
        //     const objectURL = Vu_URL.createObjectURL(blob);
        //     imageRef.current.src = objectURL;
        // });
    };

    const basicLoadingTemplate = options => {
        return (
            <div className="loading-item px-2">
                <Skeleton className="skeleton" />
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
                    <Button onClick={openUploadModal} appearance="primary">
                        Upload
                    </Button>
                ) : (
                    <Loading />
                )}
            </div>
            <div className="artwork-items">
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
