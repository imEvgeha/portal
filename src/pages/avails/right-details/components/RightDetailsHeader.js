import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RightDetailsHighlightedField from './RightDetailsHighlightedField';
import RightDetailsShrinkedBottom from './RightDetailsShrinkedBottom';
import RightDetailsTags from './RightDetailsTags';
import RightDetailsTitle from './RightDetailsTitle';
import {HIGHLIGHTED_FIELDS, SHRINKED_FIELDS} from '../constants';
import './RightDetailsHeader.scss';

const RightDetailsHeader = ({title, right, history, containerRef}) => {
    const [isShrinked, setIsShrinked] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', onScroll, true);
        return () => window.removeEventListener('scroll', onScroll, true);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            if (isShrinked) {
                containerRef.current.style.top = '78px';
            } else {
                containerRef.current.style.top = '131px';
            }
        }
    }, [isShrinked]);

    const onBackArrowClicked = () => {
        history.goBack();
    };

    const onScroll = event => {
        let toShrink = false;
        const SHRINK_BOUNDARY = 50;
        if (event.target.scrollTop > SHRINK_BOUNDARY) toShrink = true;
        setIsShrinked(toShrink);
    };

    return (
        <div
            className={classnames('nexus-c-right-details-header', {
                'nexus-c-right-details-header--adjust-padding': isShrinked,
            })}
        >
            <div className="nexus-c-right-details-header__top">
                <RightDetailsTitle title={title} goBack={onBackArrowClicked} />
                <RightDetailsTags right={right} />
            </div>
            <div
                className={classnames('nexus-c-right-details-header__bottom', {
                    'nexus-c-right-details-header__bottom--hidden': isShrinked,
                })}
            >
                {HIGHLIGHTED_FIELDS.map((field, idx) => {
                    return right[field.field] ? (
                        <RightDetailsHighlightedField key={idx} name={field.title} value={right[field.field]} />
                    ) : null;
                })}
            </div>
            <div
                className={classnames('nexus-c-right-details-header__shrinked', {
                    'nexus-c-right-details-header__shrinked--visible': isShrinked,
                })}
            >
                {SHRINKED_FIELDS.map((field, idx) => {
                    return <RightDetailsShrinkedBottom key={idx} name={field.title} value={right[field.field]} />;
                })}
            </div>
        </div>
    );
};

RightDetailsHeader.propTypes = {
    history: PropTypes.object,
    title: PropTypes.string,
    right: PropTypes.object,
    containerRef: PropTypes.any,
};

RightDetailsHeader.defaultProps = {
    history: {},
    title: null,
    right: {},
    containerRef: null,
};

export default RightDetailsHeader;