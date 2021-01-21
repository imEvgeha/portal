import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import classnames from 'classnames';
import {VZ, MOVIDA, VU, MGM} from '../../../constants';
import ShrinkedHeader from './ShrinkedHeader';
import SyncPublish from './SyncPublish';
import TitleInfo from './TitleInfo';
import './TitleDetailsHeader.scss';

const ARROW_COLOR = '#42526e';

const TitleDetailsHeader = ({history, title, containerRef, externalIds, onSyncPublish}) => {
    const [isShrinked, setIsShrinked] = useState(false);

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
                            title.catalogueOwner && title.catalogueOwner === MGM,
                    })}
                >
                    <TitleInfo
                        title={title.title}
                        releaseYear={title.releaseYear}
                        contentType={title.contentType}
                        titleImages={title.images}
                        catalogueOwner={title.catalogueOwner}
                    />
                </div>
                {title.catalogueOwner && title.catalogueOwner === VU && (
                    <div className="nexus-c-title-details-header__publish-info-container">
                        <SyncPublish externalSystem={VZ} externalIds={externalIds} onSyncPublish={onSyncPublish} />
                        <SyncPublish externalSystem={MOVIDA} externalIds={externalIds} onSyncPublish={onSyncPublish} />
                    </div>
                )}
            </div>
            <ShrinkedHeader
                isShrinked={isShrinked}
                title={title.title}
                externalIds={externalIds}
                onSyncPublish={onSyncPublish}
                catalogueOwner={title.catalogueOwner}
            />
        </div>
    );
};

TitleDetailsHeader.propTypes = {
    history: PropTypes.object,
    title: PropTypes.object,
    containerRef: PropTypes.any,
    externalIds: PropTypes.array,
    onSyncPublish: PropTypes.func,
};

TitleDetailsHeader.defaultProps = {
    history: {},
    title: {},
    containerRef: null,
    externalIds: [],
    onSyncPublish: () => null,
};

export default TitleDetailsHeader;
