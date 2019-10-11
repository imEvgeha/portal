import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import * as selectors from '../right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs, fetchAndStoreFocusedRight} from '../right-matching/rightMatchingActions';
import './TitleMatchView.scss';

const TitleMatchView = ({match, createRightMatchingColumnDefs, fetchFocusedRight, focusedRight, columnDefs, mapping}) => {
    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [columnDefs, mapping]);

    useEffect(() => {
        if (match && match.params.rightId) {
            fetchFocusedRight(match.params.rightId);
        }
    }, [match]);
    
    return (
        <div className="nexus-c-title-to-match">
            <NexusGrid
                columnDefs={columnDefs}
                rowData={[focusedRight]}
            />
        </div>
    );
};

TitleMatchView.propTypes = {
    fetchFocusedRight: PropTypes.func.isRequired,
    match: PropTypes.object,
    focusedRight: PropTypes.object,
    mapping: PropTypes.array,
    columnDefs: PropTypes.array,
    createRightMatchingColumnDefs: PropTypes.func
};

TitleMatchView.defaultProps = {
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
    fetchFocusedRight: payload => dispatch(fetchAndStoreFocusedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView); // eslint-disable-line
