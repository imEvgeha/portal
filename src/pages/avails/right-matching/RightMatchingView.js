import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Button from '@atlaskit/button';
import {NexusGrid, NexusTitle} from '../../../ui/elements';
import withInfiniteScrolling from '../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import CustomActionsCellRenderer from '../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineActionButtonColumn} from '../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withSorting from '../../../ui/elements/nexus-grid/hoc/withSorting';
import {getRightMatchingList} from './rightMatchingService';
import * as selectors from './rightMatchingSelectors';
import {
    cleanStoredRightMatchDataWithIds,
    createRightMatchingColumnDefs,
    storeRightMatchDataWithIds,
} from './rightMatchingActions';
import {URL} from '../../../util/Common';
import useDOPIntegration from './util/hooks/useDOPIntegration';
import {RIGHT_MATCHING_TITLE, FOCUS_BUTTON, RIGHT_MATCHING_DOP_STORAGE} from './rightMatchingConstants';
import './RightMatchingView.scss';

const NexusGridWithInfiniteScrolling = compose(
    withInfiniteScrolling({fetchData: getRightMatchingList}),
    withSorting(),
)(NexusGrid);

const RightMatchingView = ({
    createRightMatchingColumnDefs,
    columnDefs,
    history,
    match,
    location,
    storeRightMatchDataWithIds,
    cleanStoredRightMatchDataWithIds,
}) => {
    const [totalCount, setTotalCount] = useState();
    // DOP integration
    useDOPIntegration(totalCount, RIGHT_MATCHING_DOP_STORAGE);

    // TODO: refactor this
    useEffect(() => {
        cleanStoredRightMatchDataWithIds();
    }, [cleanStoredRightMatchDataWithIds]);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, createRightMatchingColumnDefs]);

    const onFocusButtonClick = rightId => {
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
            const pages = {};
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
    storeRightMatchDataWithIds: PropTypes.func,
    cleanStoredRightMatchDataWithIds: PropTypes.func,
    createRightMatchingColumnDefs: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
};

RightMatchingView.defaultProps = {
    columnDefs: [],
    storeRightMatchDataWithIds: null,
    cleanStoredRightMatchDataWithIds: null,
    createRightMatchingColumnDefs: null,
    history: {push: () => null},
    location: {},
    match: {},
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    storeRightMatchDataWithIds: payload => dispatch(storeRightMatchDataWithIds(payload)),
    cleanStoredRightMatchDataWithIds: payload => dispatch(cleanStoredRightMatchDataWithIds(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightMatchingView); // eslint-disable-line
