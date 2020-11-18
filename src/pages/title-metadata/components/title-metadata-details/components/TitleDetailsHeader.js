import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import classnames from 'classnames';
import ShrinkedHeader from './ShrinkedHeader';
import SyncPublish from './SyncPublish';
import TitleInfo from './TitleInfo';
import './TitleDetailsHeader.scss';

const ARROW_COLOR = '#42526e';

const TitleDetailsHeader = ({history, title, containerRef}) => {
    const [isShrinked, setIsShrinked] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', onScroll, true);
        return () => window.removeEventListener('scroll', onScroll, true);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            if (isShrinked) {
                containerRef.current.style.top = '82px';
            } else {
                containerRef.current.style.top = '175px';
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
                <div className="nexus-c-title-details-header__title-info-container">
                    <TitleInfo
                        title={title.title}
                        releaseYear={title.releaseYear}
                        contentType={title.contentType}
                        titleImages={title.images}
                    />
                </div>
                <div className="nexus-c-title-details-header__publish-info-container">
                    <SyncPublish message="Updated...">Publish to VZ</SyncPublish>
                    <SyncPublish message="Updated...">Publish to Movida</SyncPublish>
                </div>
            </div>
            <ShrinkedHeader isShrinked={isShrinked} title={title.title} />
        </div>
    );
};

TitleDetailsHeader.propTypes = {
    history: PropTypes.object,
    title: PropTypes.object,
    containerRef: PropTypes.any,
};

TitleDetailsHeader.defaultProps = {
    history: {},
    title: {},
    containerRef: null,
};

export default TitleDetailsHeader;
