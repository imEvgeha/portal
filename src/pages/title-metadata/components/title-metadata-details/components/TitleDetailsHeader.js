import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import classnames from 'classnames';
import {useNavigate} from 'react-router-dom';
import {MGM} from '../../../constants';
import {isNexusTitle} from '../../../utils';
import TitleInfo from './TitleInfo';
import './TitleDetailsHeader.scss';

const ARROW_COLOR = '#42526e';

const TitleDetailsHeader = ({title, containerRef, canEdit}) => {
    const [isShrinked, setIsShrinked] = useState(false);
    const navigate = useNavigate();

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
        navigate(-1);
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
                            title.catalogOwner === MGM || !isNexusTitle(title.id) || canEdit,
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
            </div>
            <div
                className={classnames('nexus-c-shrinked-header', {
                    'nexus-c-shrinked-header--visible': isShrinked,
                })}
            >
                <div>{title.title}</div>
            </div>
        </div>
    );
};

TitleDetailsHeader.propTypes = {
    title: PropTypes.object,
    containerRef: PropTypes.any,
    canEdit: PropTypes.bool,
};

TitleDetailsHeader.defaultProps = {
    title: {},
    containerRef: null,
    canEdit: false,
};

export default TitleDetailsHeader;
