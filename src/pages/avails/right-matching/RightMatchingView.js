import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import CustomActionsCellRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
import {compose} from 'redux';
import {NexusGrid, NexusTitle} from '../../../ui/elements';
import {
    cleanStoredRightMatchDataWithIds,
    createRightMatchingColumnDefs,
    storeRightMatchDataWithIds,
} from './rightMatchingActions';
import {FOCUS_BUTTON, RIGHT_MATCHING_DOP_STORAGE, RIGHT_MATCHING_TITLE} from './rightMatchingConstants';
import * as selectors from './rightMatchingSelectors';
import {getRightMatchingList} from './rightMatchingService';
import useDOPIntegration from './util/hooks/useDOPIntegration';
import './RightMatchingView.scss';

const NexusGridWithInfiniteScrolling = compose(
    withInfiniteScrolling({fetchData: getRightMatchingList}),
    withSorting()
)(NexusGrid);

const RightMatchingView = ({
    createRightMatchingColumnDefs,
    columnDefs,
    storeRightMatchDataWithIds,
    cleanStoredRightMatchDataWithIds,
}) => {
    const [totalCount, setTotalCount] = useState();
    const navigate = useNavigate();
    const routeParams = useParams();
    const location = useLocation();

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
        navigate(URL.keepEmbedded(`${location.pathname}/${rightId}`));
    };

    // eslint-disable-next-line
    const createCellRenderer = ({data}) => {
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button
                    className="p-button-outlined p-button-secondary"
                    label={FOCUS_BUTTON}
                    onClick={() => onFocusButtonClick(id)}
                />
            </CustomActionsCellRenderer>
        );
    };

    // TODO: refactor this
    const storeData = (page, data) => {
        if (storeRightMatchDataWithIds) {
            const pages = {};
            // eslint-disable-next-line react/prop-types
            pages[page] = data.data.map(e => e.id);
            // eslint-disable-next-line react/prop-types
            const rightMatchPageData = {pages, total: data.total};
            storeRightMatchDataWithIds({rightMatchPageData});
        }
    };

    const actionCol = {
        field: 'id',
        headerName: 'Actions',
        colId: 'id',
        cellRendererFramework: createCellRenderer,
        width: 100,
    };

    const updatedColumnDefs = columnDefs.length ? [actionCol, ...columnDefs] : columnDefs;

    const {availHistoryIds} = routeParams;

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
};

RightMatchingView.defaultProps = {
    columnDefs: [],
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

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    storeRightMatchDataWithIds: payload => dispatch(storeRightMatchDataWithIds(payload)),
    cleanStoredRightMatchDataWithIds: payload => dispatch(cleanStoredRightMatchDataWithIds(payload)),
});

// eslint-disable-next-line
export default connect(createMapStateToProps, mapDispatchToProps)(RightMatchingView);
