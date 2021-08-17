import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import classnames from 'classnames';
import {get} from 'lodash';
import {VZ, MOVIDA, MGM} from '../../../constants';
import {isNexusTitle, isStateEditable} from '../../../utils';
import ShrinkedHeader from './ShrinkedHeader';
import SyncPublish from './SyncPublish';
import TitleInfo from './TitleInfo';
import './TitleDetailsHeader.scss';

const ARROW_COLOR = '#42526e';

const TitleDetailsHeader = ({
    history,
    title,
    containerRef,
    externalIds,
    onSyncPublish,
    isEditView,
    isVZSyncing,
    isVZPublishing,
    isMOVSyncing,
    isMOVPublishing,
    initialData,
    fieldsVZ,
    isEditMode,
}) => {
    const [isShrinked, setIsShrinked] = useState(false);
    const [isVZdisabled, setIsVZdisabled] = useState(false);

    const checkVZdisabled = emet => {
        // get each field that is required for VZ in schema
        const res =
            emet.metadataStatus === 'complete' &&
            fieldsVZ.filter(f => f.isRequiredVZ).every(v => !!get(emet, v.path)) &&
            fieldsVZ.filter(f => f.oneIsRequiredVZ).some(v => get(emet, v.path));
        return res;
    };

    useEffect(() => {
        const VZdisabled = !initialData.editorialMetadata.every(e => checkVZdisabled(e));
        setIsVZdisabled(VZdisabled);
    }, [initialData]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll, true);
        return () => window.removeEventListener('scroll', onScroll, true);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            if (isShrinked) {
                containerRef.current.classList.add('nexus-c-dynamic-form__tab-container--shrinked-title');
            } else {
                containerRef.current.classList.remove('nexus-c-dynamic-form__tab-container--shrinked-title');
            }
        }
    }, [isShrinked]);

    const onBackArrowClicked = () => {
        history.goBack();
    };

    const onScroll = event => {
        let toShrink = false;
        const SHRINK_BOUNDARY = 25;
        if (event.target.scrollTop > SHRINK_BOUNDARY) toShrink = true;
        setIsShrinked(toShrink);
    };

    return (
        <div className="nexus-c-title-details-header">
            <span onClick={onBackArrowClicked}>
                <ArrowLeftIcon size="large" primaryColor={ARROW_COLOR} />
            </span>
            <div
                className={classnames('nexus-c-title-details-header__content', {
                    'nexus-c-title-details-header__content--hidden': isShrinked,
                })}
            >
                <div
                    className={classnames('nexus-c-title-details-header__title-info-container', {
                        'nexus-c-title-details-header__title-info-container--no-border':
                            title.catalogOwner === MGM || !isNexusTitle(title.id) || isEditView,
                    })}
                >
                    <TitleInfo
                        title={title.title}
                        releaseYear={title.releaseYear}
                        contentType={title.contentType}
                        titleImages={title.images}
                        catalogueOwner={title.catalogOwner}
                    />
                </div>
                {title.catalogOwner !== MGM && isNexusTitle(title.id) && !isEditView && (
                    <div className="nexus-c-title-details-header__publish-info-container">
                        <SyncPublish
                            externalSystem={VZ}
                            externalIds={externalIds}
                            onSyncPublish={onSyncPublish}
                            isSyncing={isVZSyncing}
                            isPublishing={isVZPublishing}
                            // disabled={isVZdisabled}
                            disabled={isEditMode || !isStateEditable(title.metadataStatus)}
                        />
                        <SyncPublish
                            externalSystem={MOVIDA}
                            externalIds={externalIds}
                            onSyncPublish={onSyncPublish}
                            isSyncing={isMOVSyncing}
                            isPublishing={isMOVPublishing}
                            disabled={isEditMode || !isStateEditable(title.metadataStatus)}
                        />
                    </div>
                )}
            </div>
            <ShrinkedHeader
                isShrinked={isShrinked}
                title={title.title}
                externalIds={externalIds}
                onSyncPublish={onSyncPublish}
                titleId={title.id}
                isEditView={isEditView}
                isEditMode={isEditMode}
                catalogueOwner={title.catalogOwner}
                isVZSyncing={isVZSyncing}
                isVZPublishing={isVZPublishing}
                isMOVSyncing={isMOVSyncing}
                isMOVPublishing={isMOVPublishing}
                isVZdisabled={isVZdisabled}
                isEditDisabled={!isStateEditable(title.metadataStatus)}
            />
        </div>
    );
};

TitleDetailsHeader.propTypes = {
    initialData: PropTypes.object,
    history: PropTypes.object,
    title: PropTypes.object,
    containerRef: PropTypes.any,
    externalIds: PropTypes.array,
    onSyncPublish: PropTypes.func,
    isEditView: PropTypes.bool,
    isVZSyncing: PropTypes.bool,
    isVZPublishing: PropTypes.bool,
    isMOVSyncing: PropTypes.bool,
    isMOVPublishing: PropTypes.bool,
    fieldsVZ: PropTypes.object,
    isEditMode: PropTypes.bool,
};

TitleDetailsHeader.defaultProps = {
    initialData: {},
    history: {},
    title: {},
    containerRef: null,
    externalIds: [],
    onSyncPublish: () => null,
    isEditView: false,
    isVZSyncing: false,
    isVZPublishing: false,
    isMOVSyncing: false,
    isMOVPublishing: false,
    fieldsVZ: {},
    isEditMode: false,
};

export default TitleDetailsHeader;
