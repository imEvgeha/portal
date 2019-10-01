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
import {createRightMatchingColumnDefs} from './rightMatchingActions';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/CustomActionsCellRenderer';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling(getRightMatchingList)(NexusGrid));

const RightMatchingView = ({createRightMatchingColumnDefs, mapping, columnDefs, history, location}) => {
    const [totalCount, setTotalCount] = useState(0);
    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [mapping, columnDefs]);

    const onFocusButtonClick = (rightId) => {
        history.push(`${location.pathname}/${rightId}`);
    };

    const getTotalCount = totalRightsForMatching => setTotalCount(totalRightsForMatching);

    const createCellRenderer = ({data}) => ( // eslint-disable-line
        <CustomActionsCellRenderer id={data && data.id}>
            <Button onClick={() => onFocusButtonClick(data.id)}>Focus</Button>
        </CustomActionsCellRenderer>
    );

    const aditionalColumnDef = {
        field: 'buttons',
        headerName: 'Actions',
        colId: 'actions',
        id: 'actions',
        width: 100,
        pinned: 'left',
        resizable: false,
        suppressSizeToFit: true,
        cellRendererFramework: createCellRenderer,
        suppressMovable: true,
        lockPosition: true,
        sorting: false,
    };

    const updatedColumnDefs = columnDefs.length ? [aditionalColumnDef, ...columnDefs]: columnDefs;

    return (
        <div className="nexus-c-right-matching-view">
            <NexusTitle>
                Right Matching {totalCount && `(${totalCount})`}
            </NexusTitle> 
            <NexusGridWithInfiniteScrolling
                columnDefs={updatedColumnDefs}
                context={{
                    onFocusButtonClick,
                    getTotalCount,
                }}
                deltaRowDataMode={true}
                getRowNodeId={data => data.id}
                suppressAnimationFrame={true}
            />
        </div>
    );
};

RightMatchingView.propTypes = {
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    history: PropTypes.object,
    location: PropTypes.object,
};

RightMatchingView.defaultProps = {
    columnDefs: [],
    mapping: [],
    location: {},
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch) => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightMatchingView); // eslint-disable-line
