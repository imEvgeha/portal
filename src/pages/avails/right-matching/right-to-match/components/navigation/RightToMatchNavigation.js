import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import HipchatChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import Spinner from '@atlaskit/spinner';
import {minTwoDigits, URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import './RightToMatchNavigation.scss';
import {RIGHT_PAGE_SIZE} from '../../../../../legacy/constants/rightFetching';
import {fetchRightMatchDataUntilFindId} from '../../../rightMatchingActions';
import * as selectors from '../../../rightMatchingSelectors';

const RightToMatchNavigation = ({
    searchParams,
    focusedRightId,
    fetchRightMatchDataUntilFindId,
    rightMatchPageData,
    availHistoryIds,
}) => {
    const navigate = useNavigate();
    const [navigationData, setNavigationData] = useState({
        previousId: null,
        currentPosition: null,
        focusedRightId: null,
        nextId: null,
    });
    const [isSpinnerRunning, setIsSpinnerRunning] = useState(true);

    const getNavigationDataIfExist = useCallback(() => {
        const pages = Object.keys(rightMatchPageData.pages || {}).sort();
        let navigationData = null;
        loop: for (let i = 0; i < pages.length; i++) {
            const items = rightMatchPageData.pages[pages[i]];
            for (let j = 0; j < items.length; j++) {
                if (items[j] === focusedRightId) {
                    const previousId =
                        j > 0
                            ? items[j - 1]
                            : i > 0
                            ? rightMatchPageData.pages[pages[i - 1]][RIGHT_PAGE_SIZE - 1]
                            : null;
                    const nextId =
                        j + 1 < items.length
                            ? items[j + 1]
                            : i + 1 < pages.length
                            ? rightMatchPageData.pages[pages[i + 1]][0]
                            : null;
                    const currentPosition = i * RIGHT_PAGE_SIZE + pages[i].length + j;
                    navigationData = {previousId, currentPosition, focusedRightId, nextId};
                    break loop;
                }
            }
        }
        return navigationData;
    }, [focusedRightId, rightMatchPageData.pages]);

    useEffect(() => {
        setIsSpinnerRunning(true);
    }, []);

    useEffect(() => {
        if (focusedRightId && focusedRightId !== navigationData.focusedRightId) {
            const pages = Object.keys(rightMatchPageData.pages || {}).sort();
            const pageNumber = pages.length ? parseInt(pages[pages.length - 1]) + 1 : 0;
            const updatedNavigationData = getNavigationDataIfExist();
            // TODO: refactor
            if (updatedNavigationData !== null) {
                setNavigationData(updatedNavigationData);
                setIsSpinnerRunning(false);
            } else {
                fetchRightMatchDataUntilFindId({
                    id: focusedRightId,
                    pageNumber,
                    pageSize: RIGHT_PAGE_SIZE,
                    searchParams,
                });
            }
        }
    }, [
        fetchRightMatchDataUntilFindId,
        focusedRightId,
        getNavigationDataIfExist,
        navigationData.focusedRightId,
        rightMatchPageData.pages,
        searchParams,
    ]);

    useEffect(() => {
        if (rightMatchPageData.pages) {
            const navigationData = getNavigationDataIfExist();
            if (navigationData) {
                setNavigationData(navigationData);
                setIsSpinnerRunning(false);
            }
        }
    }, [getNavigationDataIfExist, rightMatchPageData]);

    const url = `/avails/history/${availHistoryIds}/right-matching`;

    const onPreviousRightClick = () => {
        if (navigationData.previousId) {
            navigate(URL.keepEmbedded(`${url}/${navigationData.previousId}`));
            setIsSpinnerRunning(true);
        }
    };

    const onNextRightClick = () => {
        if (navigationData.nextId) {
            navigate(URL.keepEmbedded(`${url}/${navigationData.nextId}`));
            setIsSpinnerRunning(true);
        }
    };

    return navigationData && navigationData.currentPosition ? (
        <div className="nexus-c-right-to-match-navigation">
            <div className="nexus-c-right-to-match-navigation__icon-button" onClick={onPreviousRightClick}>
                <HipchatChevronUpIcon
                    size="large"
                    className="nexus-c-right-to-match-navigation__icon"
                    primaryColor="#939FB5"
                />
            </div>
            <span className="nexus-c-right-to-match-navigation__data">
                {isSpinnerRunning ? (
                    <Spinner size="small" />
                ) : (
                    `${minTwoDigits(navigationData.currentPosition)} of ${minTwoDigits(rightMatchPageData.total)}`
                )}
            </span>
            <div className="nexus-c-right-to-match-navigation__icon-button" onClick={onNextRightClick}>
                <HipchatChevronDownIcon
                    size="large"
                    className="nexus-c-right-to-match-navigation__icon"
                    primaryColor="#939FB5"
                />
            </div>
        </div>
    ) : null;
};

RightToMatchNavigation.propTypes = {
    focusedRightId: PropTypes.string,
    fetchRightMatchDataUntilFindId: PropTypes.func,
    rightMatchPageData: PropTypes.object,
    searchParams: PropTypes.object,
    availHistoryIds: PropTypes.string,
};

RightToMatchNavigation.defaultProps = {
    focusedRightId: null,
    fetchRightMatchDataUntilFindId: null,
    rightMatchPageData: {},
    searchParams: {},
    availHistoryIds: null,
};

const createMapStateToProps = () => {
    const rightMatchPageDataSelector = selectors.createRightMatchPageDataSelector();
    return (state, props) => ({
        rightMatchPageData: rightMatchPageDataSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchRightMatchDataUntilFindId: payload => dispatch(fetchRightMatchDataUntilFindId(payload)),
});

// eslint-disable-next-line
export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatchNavigation);
