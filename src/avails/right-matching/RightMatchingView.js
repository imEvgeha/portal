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
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';

const NexusGridWithInfinitScroll = compose(withInfinitScroll(getRightMatchingList)(NexusGrid));

const RightMatchingView = ({createRightMatchingColumnDefs, mapping, columnDefs, history, location}) => {
    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }    
    }, [mapping, columnDefs]);
    const getGridApi = (api, columnApi) => {}; // eslint-disable-line

    const onFocusButtonClick = (rightId) => {
        history.push(`${location.pathname}/${rightId}`);
    };

    return (
        <div className="nexus-c-right-matching-view">
            <NexusTitle>
                Right Matching
            </NexusTitle> 
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
    history: PropTypes.object,
    location: PropTypes.object,
};

RightMatchingView.defaultProps = {
    columnDefs: [],
    mapping: [],
    location: {},
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
