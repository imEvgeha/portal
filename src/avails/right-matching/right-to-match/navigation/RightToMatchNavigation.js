import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {fetchRightMatchDataUntilFindId} from '../../rightMatchingActions';
import * as selectors from '../../rightMatchingSelectors';
import {RIGHT_MATCHING_PAGE_SIZE} from '../../../../constants/rightMatching';

const RightToMatchNavigation = ({searchParams, focusedRight, fetchRightMatchDataUntilFindId, rightMatchPageData}) => {

    const [navigationData, setNavigationData] = useState({});

    useEffect(() => {
        if (focusedRight.id && navigationData.currentPosition !== null) {
            const pages = Object.keys(rightMatchPageData.pages || {}).sort();
            const pageNumber = pages.length > 0 ? parseInt(pages[pages.length - 1]) : 0;
            fetchRightMatchDataUntilFindId({
                id: focusedRight.id,
                pageNumber,
                pageSize: RIGHT_MATCHING_PAGE_SIZE,
                searchParams
            });
        }
    }, [focusedRight]);

    useEffect(() => {
        updateNavigationIds();
    }, [rightMatchPageData]);

    const updateNavigationIds = () => {
        const pages = Object.keys(rightMatchPageData.pages || {}).sort();

        loop:
            for (let i = 0; i < pages.length; i++) {
                let items = rightMatchPageData.pages[pages[i]];
                for (let j = 0; j < items.length; j++) {
                    if (items[j] === focusedRight.id) {
                        const previousId = j > 0 ? items[j - 1] : (i > 0 ? rightMatchPageData.pages[pages[i - 1]][RIGHT_MATCHING_PAGE_SIZE - 1] : null);
                        const nextId = j + 1 < items.length ? items[j + 1] : (i + 1 < pages.length ? rightMatchPageData.pages[pages[i + 1]][0] : null);
                        const currentPosition = (i + 1) * RIGHT_MATCHING_PAGE_SIZE + (j + 1);

                        setNavigationData({previousId, currentPosition, nextId});
                        console.log(navigationData)

                        break loop;
                    }
                }
            }
    };

    return (
        <div>
            Navigation
        </div>
    );
};

RightToMatchNavigation.propTypes = {
    focusedRight: PropTypes.object,
    fetchRightMatchDataUntilFindId: PropTypes.func,
    rightMatchPageData: PropTypes.object,
    searchParams: PropTypes.object
};

RightToMatchNavigation.defaultProps = {
    focusedRight: {},
    rightMatchPageData: {},
    searchParams: {}
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const rightMatchPageDataSelector = selectors.createRightMatchPageDataSelector();
    return (state, props) => ({
        focusedRight: focusedRightSelector(state, props),
        rightMatchPageData: rightMatchPageDataSelector(state, props)
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchRightMatchDataUntilFindId: payload => dispatch(fetchRightMatchDataUntilFindId(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatchNavigation); // eslint-disable-line

