import React, {useState, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import SectionTab from '@vubiquity-nexus/portal-ui/lib/elements/nexus-dynamic-form/components/SectionTab/SectionTab';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import classnames from 'classnames';
import {throttle} from 'lodash';
import {Link, useParams} from 'react-router-dom';
import schema from '../schema.json';
import RightDetailsHighlightedField from './RightDetailsHighlightedField';
import RightDetailsShrinkedBottom from './RightDetailsShrinkedBottom';
import RightDetailsTags from './RightDetailsTags';
import RightDetailsTitle from './RightDetailsTitle';
import {
    HIGHLIGHTED_FIELDS,
    SHRINKED_FIELDS,
    THROTTLE_TRAILING_MS,
    NoteError,
    NoteMerged,
    NotePending,
    NoteDeleted,
    STATUS,
} from '../constants';
import './RightDetailsHeader.scss';

const RightDetailsHeader = ({title, right, containerRef}) => {
    const tabs = useMemo(
        () =>
            schema.fields.map(({title = ''}, index) => {
                return {
                    title,
                    id: `tab-${index}`,
                };
            }),
        []
    );

    const [isShrinked, setIsShrinked] = useState(false);
    const [selectedTab, setSelectedTab] = useState(tabs[0].title);
    const previousUrl =
        URL.getParamIfExists('back') === 'manual-rights-entry'
            ? `/avails/history/${URL.getParamIfExists('availHistoryId')}/manual-rights-entry`
            : '/avails';

    const routeParams = useParams();

    useEffect(() => {
        const sectionIDs = tabs.map((_, index) => document.getElementById(`tab-${index}`));

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2,
        };

        const observerCallback = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const focusedTab = tabs.find(item => item.id === entry.target.id);
                    focusedTab.title && setSelectedTab(focusedTab.title);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sectionIDs.forEach(sec => sec instanceof HTMLElement && observer.observe(sec));
    }, []);

    const buildTabs = () => {
        return tabs.map((tab, index) => (
            <SectionTab
                key={tab.title}
                section={tab.title}
                onClick={() => setSelectedTab(tab.title)}
                isActive={selectedTab === tab.title}
                sectionId={`tab-${index}`}
            />
        ));
    };

    useEffect(() => {
        window.addEventListener('scroll', onScrollThrottled, true);
        return () => window.removeEventListener('scroll', onScrollThrottled, true);
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

    const onScroll = event => {
        let toShrink = false;
        const SHRINK_BOUNDARY = 20;
        if (event.target.scrollTop > SHRINK_BOUNDARY) {
            toShrink = true;
        }
        setIsShrinked(toShrink);
    };

    const onScrollThrottled = throttle(onScroll, THROTTLE_TRAILING_MS, {traling: true});

    const getStatusNote = () => {
        if (right) {
            let note = {};
            const {status} = right;
            const [ERROR, MERGED, PENDING, DELETED] = STATUS;
            if (status === ERROR) {
                note = NoteError;
            } else if (status === MERGED) {
                note = NoteMerged;
            } else if (status === PENDING) {
                note = NotePending;
            } else if (status === DELETED) {
                note = NoteDeleted;
            }

            return status === ERROR || status === MERGED || status === PENDING || status === DELETED ? (
                <div className="nexus-c-right-details-match">
                    <SectionMessage appearance={note.noteStyle}>
                        {status === 'Pending' ? (
                            <Link
                                to={URL.keepEmbedded(
                                    `/${routeParams.realm}/avails/history/${right.availHistoryId}/right-matching/${right.id}`
                                )}
                            >
                                {note.note}
                            </Link>
                        ) : (
                            <p>{note.note}</p>
                        )}
                    </SectionMessage>
                </div>
            ) : null;
        }
    };

    return (
        <div
            className={classnames('nexus-c-right-details-header', {
                'nexus-c-right-details-header--adjust-padding': isShrinked,
            })}
        >
            <div className="nexus-c-right-details-header__top">
                <RightDetailsTitle title={title} previousUrl={URL.keepEmbedded(previousUrl)} />
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
            {getStatusNote()}
            <div className="nexus-c-right-details-header__tabs-wrapper">
                <div className="nexus-c-right-details-header__tabs">{buildTabs()}</div>
            </div>
        </div>
    );
};

RightDetailsHeader.propTypes = {
    title: PropTypes.string,
    right: PropTypes.object,
    containerRef: PropTypes.any,
};

RightDetailsHeader.defaultProps = {
    title: null,
    right: {},
    containerRef: null,
};

export default RightDetailsHeader;
