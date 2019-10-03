import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import {fetchFocusedRight} from '../rightMatchingActions';
import * as selectors from '../rightMatchingSelectors';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';

const RightToMatch = ({match, fetchFocusedRight, focusedRight, columnDefs}) => {

    useEffect(() => {
       if(match && match.params.rightId) {
            fetchFocusedRight(match.params.rightId)
       }
    }, []);

    useEffect(() => {
           console.log('loaded in component', focusedRight),
           console.log('updatedColumnDefs', updatedColumnDefs)

    }, [focusedRight]);

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
            <NexusTitle>Right Matching</NexusTitle>
            <NexusGrid
                columnDefs={updatedColumnDefs}
                rowData={[{id: '123'}, focusedRight]}
                getRowNodeId={data => data.id}
            />
        </div>
    );
}

RightToMatch.propTypes = {
    fetchFocusedRight: PropTypes.func.isRequired,
    match: PropTypes.object,
    focusedRight: PropTypes.object
};

RightToMatch.defaultProps = {
    focusedRight: {}
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    return (state, props) => ({
        focusedRight: focusedRightSelector(state, props),
        columnDefs: rightMatchingColumnDefsSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatch); // eslint-disable-line

