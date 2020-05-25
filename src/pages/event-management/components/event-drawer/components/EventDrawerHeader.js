import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@atlaskit/button';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {REPLAY_EVENT, REPLICATE_EVENT} from '../../../eventManagementActionTypes';
import {replayEvent, replicateEvent} from '../../../eventManagementActions';
import NexusDownload from '../../../../../ui/elements/nexus-download/NexusDownload';
import './EventDrawerHeader.scss';

export const EventDrawerH = ({event, isReplaying, onReplay, isReplicating, onReplicate}) => {
    const onInnerReplay = () => {
        const payload = {eventId: event.eventId};
        onReplay(payload);
    };

    const onInnerReplicate = () => {
        const payload = {eventId: event.eventId};
        onReplicate(payload);
    };

    return (
        <div className="nexus-c-event-drawer-header">
            <Button
                className="nexus-c-event-drawer-header__replay-button"
                onClick={onInnerReplay}
                isLoading={isReplaying}
                isDisabled={!event || !event.eventId}
            >
                Replay
            </Button>
            <Button
                className="nexus-c-event-drawer-header__replicate-button"
                onClick={onInnerReplicate}
                isLoading={isReplicating}
                isDisabled={!event || !event.eventId}
            >
                Replicate
            </Button>
            <NexusDownload
                className="nexus-c-event-drawer-header__download-button"
                data={event}
                filename={event.eventId}
                isDisabled={!event || !event.eventId}
            />
        </div>
    );
};

EventDrawerH.propTypes = {
    event: PropTypes.object,
    isReplaying: PropTypes.bool,
    onReplay: PropTypes.func,
    isReplicating: PropTypes.bool,
    onReplicate: PropTypes.func
};

EventDrawerH.defaultProps = {
    event: null,
    isReplaying: false,
    onReplay: null,
    isReplicating: false,
    onReplicate: null
};

const createMapStateToProps = () => {
    const replayingLoadingSelector = createLoadingSelector([REPLAY_EVENT]);
    const replicatingLoadingSelector = createLoadingSelector([REPLICATE_EVENT]);
    return (state) => ({
        isReplaying: replayingLoadingSelector(state),
        isReplicating: replicatingLoadingSelector(state)
    });
};
const mapDispatchToProps = (dispatch) => ({
    onReplay: payload => dispatch(replayEvent(payload)),
    onReplicate: payload => dispatch(replicateEvent(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(EventDrawerH);