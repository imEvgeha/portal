import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import * as selectors from '../right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs, fetchFocusedRight} from '../right-matching/rightMatchingActions';
import './TitleMatchView.scss';
import {titleServiceManager} from '../../containers/metadata/service/TitleServiceManager';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling(titleServiceManager.doSearch)(NexusGrid));

const TitleMatchView = ({match, createRightMatchingColumnDefs, fetchFocusedRight, focusedRight, columnDefs, mapping}) => {
    const [totalCount, setTotalCount] = useState(0);

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
            <div className="nexus-c-title-to-match-header">
                <NexusTitle>Title Matching</NexusTitle>
            </div>
            <NexusTitle>Incoming Right</NexusTitle>
            <div className="nexus-c-title-to-match-grid">
                <NexusGrid
                    columnDefs={columnDefs}
                    rowData={[focusedRight]}
                />
            </div>
            <SectionMessage>
                <p>Select titles from the repository that match the Incoming right or declare it as a NEW title from the
                    action menu.</p>
            </SectionMessage>
            <NexusTitle>Title Repositories ({totalCount})</NexusTitle>
            <NexusGridWithInfiniteScrolling
                columnDefs={columnDefs}
                setTotalCount={setTotalCount}
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
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView); // eslint-disable-line
