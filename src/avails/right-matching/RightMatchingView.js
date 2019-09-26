import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import './RightMatchingView.scss';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import withInfinitScroll from '../../ui-elements/nexus-grid/hoc/withInfinitScroll';
import {getRightMatchingList} from './rightMatchingService';
import * as selectors from './rightMatchingSelectors';
import {createRightMatchingColumnDefs} from './rightMatchingActions';
import CustomActionsCellRenderer from './components/CustomActionsCellRenderer';

const NexusGridWithInfinitScroll = compose(withInfinitScroll(getRightMatchingList)(NexusGrid));

const RightMatchingView = ({createRightMatchingColumnDefs, mapping, columnDefs}) => {
    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }    
    }, [mapping, columnDefs]); // eslint-disable-line
    const getGridApi = (api, columnApi) => {};

    const onFocusButtonClick = (cell) => {
       console.log(cell, 'cell') 
    }

    return (
        <div className="nexus-c-right-matching-view">
            Right Matching
            <NexusGridWithInfinitScroll
                columnDefs={columnDefs}
                getGridApi={getGridApi}
                context={{onFocusButtonClick}}
            />
        </div>
    );
};

RightMatchingView.propTypes = {
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
};

RightMatchingView.defaultProps = {
    columnDefs: [],
    mapping: [],
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector(CustomActionsCellRenderer);
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
