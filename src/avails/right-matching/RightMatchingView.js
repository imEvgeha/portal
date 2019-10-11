import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Button from '@atlaskit/button';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import {FlagGroup, AutoDismissFlag} from '@atlaskit/flag';
import {colors} from '@atlaskit/theme';
import './RightMatchingView.scss';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {getRightMatchingList} from './rightMatchingService';
import * as selectors from './rightMatchingSelectors';
import {
    cleanStoredRightMatchDataWithIds,
    createRightMatchingColumnDefs,
    storeRightMatchDataWithIds,
    setRightSuccessFlag
} from './rightMatchingActions';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';
import {RIGHT_PAGE_SIZE} from '../../constants/rightFetching';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling(getRightMatchingList)(NexusGrid));

const RightMatchingView = ({
        createRightMatchingColumnDefs, 
        mapping, 
        columnDefs, 
        history, 
        match, 
        storeRightMatchDataWithIds, 
        cleanStoredRightMatchDataWithIds,
        isNewRightSuccessFlagVisible,
        setSuccessFlag
    }) => {
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        cleanStoredRightMatchDataWithIds();
    }, []);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [mapping, columnDefs]);

    const onFocusButtonClick = (rightId) => {
        history.push(`${location.pathname}/${rightId}`);
    };

    const createCellRenderer = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button onClick={() => onFocusButtonClick(id)}>Focus</Button>
            </CustomActionsCellRenderer>
        );
    };

    const storeData = (page, data) => {
        if(storeRightMatchDataWithIds) {
            let pages = {};
            pages[page] = data.data.map(e => e.id);
            const rightMatchPageData = {pages, total: data.total};
            storeRightMatchDataWithIds({ rightMatchPageData });
        }
    };

    const additionalColumnDef = {
        field: 'buttons',
        headerName: 'Actions',
        colId: 'actions',
        width: 100,
        pinned: 'left',
        resizable: false,
        suppressSizeToFit: true,
        cellRendererFramework: createCellRenderer,
        suppressMovable: true,
        lockPosition: true,
        sortable: false,
    };

    const updatedColumnDefs = columnDefs.length ? [additionalColumnDef, ...columnDefs]: columnDefs;

    const {params = {}} = match;
    const {availHistoryIds} = params || {};

    return (
        <div className="nexus-c-right-matching-view">
            <NexusTitle>
                Right Matching {totalCount && `(${totalCount})`}
            </NexusTitle> 
            <NexusGridWithInfiniteScrolling
                columnDefs={updatedColumnDefs}
                setTotalCount={setTotalCount}
                params={{availHistoryIds}}
                storeRightMatchDataWithIds={storeRightMatchDataWithIds}
                infiniteProps={{
                    paginationPageSize: RIGHT_PAGE_SIZE
                }}
                succesDataFetchCallback={storeData}
            />
            {isNewRightSuccessFlagVisible && (
                    <FlagGroup onDismissed={() => setSuccessFlag(false)}>
                        <AutoDismissFlag
                            appearance="normal"
                            id="success-flag"
                            icon={
                            <SuccessIcon
                                label="Success"
                                size="medium"
                                primaryColor={colors.G300}
                            />
                            }
                            title="Success"
                            description="You have successfully declared a new right."
                        />
                    </FlagGroup>
            )}
        </div>
    );
};

RightMatchingView.propTypes = {
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    history: PropTypes.object,
    match: PropTypes.object,
    storeRightMatchDataWithIds: PropTypes.func,
    cleanStoredRightMatchDataWithIds: PropTypes.func,
    setSuccessFlag: PropTypes.func,
    isNewRightSuccessFlagVisible: PropTypes.bool
};

RightMatchingView.defaultProps = {
    columnDefs: [],
    mapping: [],
    match: {},
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();
    const isNewRightSuccessFlagVisible = selectors.getSuccessStatusSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        isNewRightSuccessFlagVisible: isNewRightSuccessFlagVisible(state, props)
    });
};

const mapDispatchToProps = (dispatch) => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    storeRightMatchDataWithIds: payload => dispatch(storeRightMatchDataWithIds(payload)),
    cleanStoredRightMatchDataWithIds: payload => dispatch(cleanStoredRightMatchDataWithIds(payload)),
    setSuccessFlag: payload => dispatch(setRightSuccessFlag(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightMatchingView); // eslint-disable-line
