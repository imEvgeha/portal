import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';
import './RightToMatchNavigation.scss';
import HipchatChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import {fetchRightMatchDataUntilFindId} from '../../rightMatchingActions';
import * as selectors from '../../rightMatchingSelectors';
import {URL} from '../../../../util/Common';
import {RIGHT_PAGE_SIZE} from '../../../../constants/rightFetching';

const RightToMatchNavigation = ({searchParams, focusedRight, rightId, fetchRightMatchDataUntilFindId, rightMatchPageData, availHistoryIds}) => {

    const [navigationData, setNavigationData] = useState({});
    const [isSpinnerRunning, setIsSpinnerRunning] = useState(true);

    useEffect(() => {
        setIsSpinnerRunning(true);
    }, []);

    useEffect(() => {
        if (focusedRight.id) {
            const pages = Object.keys(rightMatchPageData.pages || {}).sort();
            const pageNumber = pages.length > 0 ? parseInt(pages[pages.length - 1]) : 0;
            fetchRightMatchDataUntilFindId({
                id: focusedRight.id,
                pageNumber,
                pageSize: RIGHT_PAGE_SIZE,
                searchParams
            });
        }
    }, [rightId]);

    useEffect(() => {
        updateNavigationIds();
        setIsSpinnerRunning(false);
    }, [rightMatchPageData]);

    const updateNavigationIds = () => {
        const pages = Object.keys(rightMatchPageData.pages || {}).sort();

        loop:
            for (let i = 0; i < pages.length; i++) {
                let items = rightMatchPageData.pages[pages[i]];
                for (let j = 0; j < items.length; j++) {
                    if (items[j] === focusedRight.id) {
                        const previousId = j > 0 ? items[j - 1] : (i > 0 ? rightMatchPageData.pages[pages[i - 1]][RIGHT_PAGE_SIZE - 1] : null);
                        const nextId = j + 1 < items.length ? items[j + 1] : (i + 1 < pages.length ? rightMatchPageData.pages[pages[i + 1]][0] : null);
                        const currentPosition = (i + 1) * pages[i].length + j;

                        setNavigationData({previousId, currentPosition, nextId});

                        break loop;
                    }
                }
            }
    };

    const onPreviousRightClick = () => {
        if (navigationData.previousId) {
            history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching/${navigationData.previousId}`));
            setIsSpinnerRunning(true);
        }
    };

    const onNextRightClick = () => {
        if (navigationData.nextId) {
            history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching/${navigationData.nextId}`));
            setIsSpinnerRunning(true);
        }
    };

    return (
        <div className='nexus-c-right-to-match-navigation'>
            <div className='nexus-c-right-to-match-navigation-arrow' onClick={onPreviousRightClick}>
                <HipchatChevronUpIcon size='large'/>
            </div>

            {navigationData.currentPosition < 10 ? '0' : ''}{navigationData.currentPosition} of {rightMatchPageData.total}

            <div className='nexus-c-right-to-match-navigation-arrow' onClick={onNextRightClick}>
                <HipchatChevronDownIcon size='large'/>
            </div>

            {isSpinnerRunning && <Spinner size='small'/>}
        </div>
    );
};

RightToMatchNavigation.propTypes = {
    focusedRight: PropTypes.object,
    rightId: PropTypes.string,
    fetchRightMatchDataUntilFindId: PropTypes.func,
    rightMatchPageData: PropTypes.object,
    searchParams: PropTypes.object,
    availHistoryIds: PropTypes.string,
};

RightToMatchNavigation.defaultProps = {
    focusedRight: {},
    rightId: null,
    rightMatchPageData: {},
    searchParams: {},
    availHistoryIds: null,
};

const createMapStateToProps = () => {
    const rightMatchPageDataSelector = selectors.createRightMatchPageDataSelector();
    return (state, props) => ({
        rightMatchPageData: rightMatchPageDataSelector(state, props)
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchRightMatchDataUntilFindId: payload => dispatch(fetchRightMatchDataUntilFindId(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatchNavigation); // eslint-disable-line

