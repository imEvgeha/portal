import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {connect} from 'react-redux';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {REPLAY_EVENT, REPLICATE_EVENT} from '../../../eventManagementActionTypes';
import {replayEvent, replicateEvent} from '../../../eventManagementActions';
import './EventDrawerHeader.scss';
import {download} from '../../../../../util/Common';

export const EventDrawerH = ({event, isReplaying, onReplay, isReplicating, onReplicate}) => {
    const onInnerReplay = () => {
        const payload = {eventId: event.eventId};
        onReplay(payload);
    };

    const onInnerReplicate = () => {
        const payload = {eventId: event.eventId};
        onReplicate(payload);
    };

    const onDownload = () => {
        download(JSON.stringify(event), event.eventId, 'application/json');
    };

    return (
        <div className='nexus-c-event-drawer-header'>
            <Button
                className='nexus-c-event-drawer-header__replay-button'
                onClick={onInnerReplay}
                isLoading={isReplaying}
                disabled={!event || !event.eventId}
            >
                Replay
            </Button>
            <Button
                className='nexus-c-event-drawer-header__replicate-button'
                onClick={onInnerReplicate}
                isLoading={isReplicating}
                disabled={!event || !event.eventId}
            >
                Replicate
            </Button>
            <Button
                className='nexus-c-event-drawer-header__download-button'
                onClick={onDownload}
                disabled={!event || !event.eventId}
            >
                Download
            </Button>
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