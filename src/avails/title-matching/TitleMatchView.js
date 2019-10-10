import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import { getFocusedRight } from './titleMatchingSelectors';
import { fetchFocusedRight } from './titleMatchingActions';
import {titleServiceManager} from '../../containers/metadata/service/TitleServiceManager';
import { createColumnDefs } from '../utils';
import mappings from './titleMatchingMappings.json';
import './TitleMatchView.scss';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling(titleServiceManager.doSearch)(NexusGrid));

const TitleMatchView = ({match, fetchFocusedRight, focusedRight}) => {
    const [totalCount, setTotalCount] = useState(0);
    const columnDefs = createColumnDefs(mappings);

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
};

TitleMatchView.defaultProps = {
    focusedRight: {},
};

const createMapStateToProps = () => {
    return (state) => ({
        focusedRight: getFocusedRight(state)
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView); // eslint-disable-line
