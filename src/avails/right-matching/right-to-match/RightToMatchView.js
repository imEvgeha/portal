import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './RightToMatchView.scss';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import {
    fetchFocusedRight,
    createRightMatchingColumnDefs
} from '../rightMatchingActions';
import * as selectors from '../rightMatchingSelectors';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import CustomActionsCellRenderer from '../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import RightToMatchNavigation from './navigation/RightToMatchNavigation';

const RightToMatch = ({match, createRightMatchingColumnDefs, fetchFocusedRight, focusedRight, columnDefs, mapping}) => {

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [columnDefs, mapping]);

    useEffect(() => {
       if(match && match.params.rightId) {
            fetchFocusedRight(match.params.rightId);
       }
    }, [match]);

    const onNewButtonClick = () => {
    };

    const createNewButtonCellRenderer = ({data}) => ( // eslint-disable-line
        <CustomActionsCellRenderer id={data && data.id}>
            <Button onClick={onNewButtonClick}>New</Button>
        </CustomActionsCellRenderer>
    );

    const additionalColumnDef = {
        field: 'buttons',
        headerName: 'Actions',
        colId: 'actions',
        width: 100,
        pinned: 'left',
        resizable: false,
        suppressSizeToFit: true,
        cellRendererFramework: createNewButtonCellRenderer,
        suppressMovable: true,
        lockPosition: true,
        sortable: false,
    };

    const updatedColumnDefs = columnDefs.length ? [additionalColumnDef, ...columnDefs]: columnDefs;

    return (
        <div className="nexus-c-right-to-match">
            <NexusTitle>Focused Right</NexusTitle>
            <RightToMatchNavigation
                searchParams={{availHistoryIds: match.params.availHistoryIds}}
            />
            <NexusGrid
                columnDefs={updatedColumnDefs}
                rowData={[focusedRight]}
            />
        </div>
    );
};

RightToMatch.propTypes = {
    fetchFocusedRight: PropTypes.func.isRequired,
    match: PropTypes.object,
    focusedRight: PropTypes.object,
    mapping: PropTypes.array,
    columnDefs: PropTypes.array,
    createRightMatchingColumnDefs: PropTypes.func
};

RightToMatch.defaultProps = {
    focusedRight: {},
    mapping: [],
    columnDefs: [],
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        focusedRight: focusedRightSelector(state, props)
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatch); // eslint-disable-line

