import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import * as selectors from '../rightMatchingSelectors';

const RightToMatch = ({match}) => {
    const {params = {}} = match;
    const {rightId} = params || {}; 

    return (
        <div className="nexus-c-right-to-match">
            <NexusTitle>Right Matching</NexusTitle> 
            <NexusTitle className="nexus-c-title--small">Rights Repository ()</NexusTitle> 
        </div>
    );
};

RightToMatch.propTypes = {
    match: PropTypes.object,
};

RightToMatch.defaultProps = {
    match: {},
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
    // createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatch); // eslint-disable-line


