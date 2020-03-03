import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Button from '@atlaskit/button';
import './RightMatchingView.scss';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {getRightMatchingList} from './rightMatchingService';
import * as selectors from './rightMatchingSelectors';
import {
    cleanStoredRightMatchDataWithIds,
    createRightMatchingColumnDefs,
    storeRightMatchDataWithIds,
} from './rightMatchingActions';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';
import {URL} from '../../util/Common';
import {defineActionButtonColumn} from '../../ui-elements/nexus-grid/elements/columnDefinitions';
import useDOPIntegration from './util/hooks/useDOPIntegration';
import {RIGHT_MATCHING_TITLE, FOCUS_BUTTON, RIGHT_MATCHING_DOP_STORAGE} from './rightMatchingConstants';

const NexusGridWithInfiniteScrolling = compose(
    withInfiniteScrolling({fetchData: getRightMatchingList}),
)(NexusGrid);

const RightMatchingView = ({
        createRightMatchingColumnDefs,
        columnDefs,
        history,
        match,
        storeRightMatchDataWithIds,
        cleanStoredRightMatchDataWithIds,
    }) => {
    const [totalCount, setTotalCount] = useState();
    // DOP integration
    useDOPIntegration(totalCount, RIGHT_MATCHING_DOP_STORAGE);

    // TODO: refactor this
    useEffect(() => {
        cleanStoredRightMatchDataWithIds();
    }, []);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs]);

    const onFocusButtonClick = (rightId) => {
        history.push(URL.keepEmbedded(`${location.pathname}/${rightId}`));
    };

    const createCellRenderer = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button onClick={() => onFocusButtonClick(id)}>{FOCUS_BUTTON}</Button>
            </CustomActionsCellRenderer>
        );
    };

    // TODO: refactor this
    const storeData = (page, data) => {
        if (storeRightMatchDataWithIds) {
            let pages = {};
            pages[page] = data.data.map(e => e.id);
            const rightMatchPageData = {pages, total: data.total};
            storeRightMatchDataWithIds({rightMatchPageData});
        }
    };

    const focusButtonColumnDef = defineActionButtonColumn({cellRendererFramework: createCellRenderer});
    const updatedColumnDefs = columnDefs.length ? [focusButtonColumnDef, ...columnDefs] : columnDefs;

    const {params = {}} = match;
    const {availHistoryIds} = params || {};

    return (
        <div className="nexus-c-right-matching-view">
            <NexusTitle>
                {RIGHT_MATCHING_TITLE} {!!totalCount && `(${totalCount})`}
            </NexusTitle>
            <NexusGridWithInfiniteScrolling
                columnDefs={updatedColumnDefs}
                setTotalCount={setTotalCount}
                params={{availHistoryIds}}
                successDataFetchCallback={storeData}
            />
        </div>
    );
};

RightMatchingView.propTypes = {
    columnDefs: PropTypes.array,
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    storeRightMatchDataWithIds: PropTypes.func,
    cleanStoredRightMatchDataWithIds: PropTypes.func,
    createRightMatchingColumnDefs: PropTypes.func,
};

RightMatchingView.defaultProps = {
    columnDefs: [],
    mapping: [],
    match: {},
    history: {},
    location: {},
    storeRightMatchDataWithIds: null,
    cleanStoredRightMatchDataWithIds: null,
    createRightMatchingColumnDefs: null,
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch) => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    storeRightMatchDataWithIds: payload => dispatch(storeRightMatchDataWithIds(payload)),
    cleanStoredRightMatchDataWithIds: payload => dispatch(cleanStoredRightMatchDataWithIds(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightMatchingView); // eslint-disable-line
