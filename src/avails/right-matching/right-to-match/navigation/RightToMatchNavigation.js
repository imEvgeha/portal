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

const RightToMatchNavigation = ({searchParams, fetchRightMatchDataUntilFindId, focusedRightId, rightMatchPageData, history}) => {

    const [navigationData, setNavigationData] = useState({
        previousId: null,
        currentPosition: null,
        focusedRightId: null,
        nextId: null
    });
    const [isSpinnerRunning, setIsSpinnerRunning] = useState(true);

    useEffect(() => {
        setIsSpinnerRunning(true);
    }, []);

    useEffect(() => {
        if (focusedRightId && focusedRightId !== navigationData.focusedRightId) {
            const pages = Object.keys(rightMatchPageData.pages || {}).sort();
            const pageNumber = pages.length > 0 ? parseInt(pages[pages.length - 1]) + 1: 0;
            const updatedNavigationData = getNavigationDataIfExist();
            if(updatedNavigationData !== null) {
                setNavigationData(updatedNavigationData);
                setIsSpinnerRunning(false);
            } else {
                fetchRightMatchDataUntilFindId({
                    id: focusedRightId,
                    pageNumber,
                    pageSize: RIGHT_PAGE_SIZE,
                    searchParams
                });
            }
        }
    }, [focusedRightId]);

    useEffect(() => {
        if (rightMatchPageData.pages) {
            let navigationData = getNavigationDataIfExist();
            if(navigationData) {
                setNavigationData(navigationData);
                setIsSpinnerRunning(false);
            }
        }
    }, [rightMatchPageData]);

    const getNavigationDataIfExist = () => {
        const pages = Object.keys(rightMatchPageData.pages || {}).sort();
        let navigationData = null;
        loop:
            for (let i = 0; i < pages.length; i++) {
                let items = rightMatchPageData.pages[pages[i]];
                for (let j = 0; j < items.length; j++) {
                    if (items[j] === focusedRightId) {
                        const previousId = j > 0 ? items[j - 1] : (i > 0 ? rightMatchPageData.pages[pages[i - 1]][RIGHT_PAGE_SIZE - 1] : null);
                        const nextId = j + 1 < items.length ? items[j + 1] : (i + 1 < pages.length ? rightMatchPageData.pages[pages[i + 1]][0] : null);
                        const currentPosition = i * RIGHT_PAGE_SIZE + pages[i].length + j;

                        navigationData = {previousId, currentPosition, focusedRightId, nextId};

                        break loop;
                    }
                }
            }
        return navigationData;
    };

    const onPreviousRightClick = () => {
        if (navigationData.previousId) {
            const indexToRemove = location.pathname.lastIndexOf('/');
            history.push(URL.keepEmbedded(`${location.pathname.substr(0, indexToRemove)}/${navigationData.previousId}`));
            setIsSpinnerRunning(true);
        }
    };

    const onNextRightClick = () => {
        if (navigationData.nextId) {
            const indexToRemove = location.pathname.lastIndexOf('/');
            history.push(URL.keepEmbedded(`${location.pathname.substr(0, indexToRemove)}/${navigationData.nextId}`));
            setIsSpinnerRunning(true);
        }
    };

    const renderNavigationData = () => {
        if(isSpinnerRunning) {
            return (<Spinner size='small'/>);
        }
        return (
            `${navigationData.currentPosition < 10 ? '0' : ''}${navigationData.currentPosition} of ${rightMatchPageData.total}`
        );
    };

    return (
        <div className='nexus-c-right-to-match-navigation'>
            <div className='nexus-c-right-to-match-navigation-arrow' onClick={() => onPreviousRightClick()}>
                <HipchatChevronUpIcon size='large'/>
            </div>

            {renderNavigationData()}

            <div className='nexus-c-right-to-match-navigation-arrow' onClick={() => onNextRightClick()}>
                <HipchatChevronDownIcon size='large'/>
            </div>

        </div>
    );
};

RightToMatchNavigation.propTypes = {
    fetchRightMatchDataUntilFindId: PropTypes.func,
    rightMatchPageData: PropTypes.object,
    searchParams: PropTypes.object,
    history: PropTypes.object,
    focusedRightId: PropTypes.string
};

RightToMatchNavigation.defaultProps = {
    rightMatchPageData: {},
    searchParams: {},
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

