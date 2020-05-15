import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {connect} from 'react-redux';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {REPLAY_EVENT} from '../../../eventManagementActionTypes';
import {replayEvent} from '../../../eventManagementActions';

const EventDrawerHeader = ({event, isReplaying, onReplay}) => {
    const onInnerReplay = () => {
        const payload = {eventId: event.eventId};
        onReplay(payload);
    };

    return (
        <div className='nexus-c-event-drawer-header'>
            <Button onClick={onInnerReplay} isLoading={isReplaying} disabled={!event || !event.eventId}>Replay</Button>
        </div>
    );
};

EventDrawerHeader.propTypes = {
    event: PropTypes.object,
    isReplaying: PropTypes.bool,
    onReplay: PropTypes.func
};

EventDrawerHeader.defaultProps = {
    event: null,
    isReplaying: false,
    onReplay: null
};

const createMapStateToProps = () => {
    const loadingSelector = createLoadingSelector([REPLAY_EVENT]);
    return (state) => ({
        isReplaying: loadingSelector(state)
    });
};
const mapDispatchToProps = (dispatch) => ({
    onReplay: payload => dispatch(replayEvent(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(EventDrawerHeader);