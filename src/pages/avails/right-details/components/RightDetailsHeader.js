import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import RightDetailsHighlightedField from './RightDetailsHighlightedField';
import RightDetailsShrinkedBottom from './RightDetailsShrinkedBottom';
import RightDetailsTags from './RightDetailsTags';
import RightDetailsTitle from './RightDetailsTitle';
import {HIGHLIGHTED_FIELDS, SHRINKED_FIELDS, VISIBLE, HIDDEN, ADJUST_PADDING} from '../constants';
import './RightDetailsHeader.scss';

const RightDetailsHeader = ({title, right, history}) => {
    const [isShrinked, setIsShrinked] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', onScroll, true);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const onBackArrowClicked = () => {
        history.goBack();
    };

    const onScroll = event => {
        let toShrink = false;
        const SHRINK_BOUNDARY = 0;
        if (event.target.scrollTop > SHRINK_BOUNDARY) toShrink = true;
        setIsShrinked(toShrink);
    };

    const [TAB_CONTAINER_ELEMENT] = document.getElementsByClassName('nexus-c-dynamic-form__tab-container');

    if (isShrinked) {
        TAB_CONTAINER_ELEMENT.style.top = '78px';
    } else if (TAB_CONTAINER_ELEMENT) {
        TAB_CONTAINER_ELEMENT.style.top = '131px';
    }

    return (
        <div className={`nexus-c-right-details-header ${isShrinked ? ADJUST_PADDING : ''}`}>
            <div className="nexus-c-right-details-header__top">
                <RightDetailsTitle title={title} goBack={onBackArrowClicked} />
                <RightDetailsTags right={right} />
            </div>
            <div className={`nexus-c-right-details-header__bottom ${isShrinked ? HIDDEN : ''}`}>
                {HIGHLIGHTED_FIELDS.map((field, idx) => {
                    return right[field.field] ? (
                        <RightDetailsHighlightedField key={idx} name={field.title} value={right[field.field]} />
                    ) : null;
                })}
            </div>
            <div className={`nexus-c-right-details-header__bottom--shrinked ${isShrinked ? VISIBLE : ''}`}>
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
};

RightDetailsHeader.defaultProps = {
    history: {},
    title: null,
    right: {},
};

export default RightDetailsHeader;
