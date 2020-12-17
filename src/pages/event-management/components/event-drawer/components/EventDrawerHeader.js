import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import NexusDownload from '@vubiquity-nexus/portal-ui/lib/elements/nexus-download/NexusDownload';
import {can} from '@vubiquity-nexus/portal-utils/lib/ability';
import {connect} from 'react-redux';
import {createLoadingSelector} from '../../../../../ui/loading/loadingSelectors';
import {REPLAY_EVENT, REPLICATE_EVENT} from '../../../eventManagementActionTypes';
import {replayEvent, replicateEvent} from '../../../eventManagementActions';
import './EventDrawerHeader.scss';

export const EventDrawerH = ({event, isReplaying, onReplay, isReplicating, onReplicate}) => {
    const {eventId = '', id = ''} = event || {};
    const canReplayAndReplicate = can('create', 'EventManagement') && can('update', 'EventManagement');

    const onInnerReplay = () => {
        const payload = {docId: id};
        onReplay(payload);
    };

    const onInnerReplicate = () => {
        const payload = {docId: id};
        onReplicate(payload);
    };

    return (
        <div className="nexus-c-event-drawer-header">
            <Tooltip content={canReplayAndReplicate ? 'Replay Event' : 'Insufficient permissions'}>
                <Button
                    className="nexus-c-event-drawer-header__replay-button"
                    onClick={onInnerReplay}
                    isLoading={isReplaying}
                    isDisabled={!canReplayAndReplicate || !event || !eventId}
                >
                    Replay
                </Button>
            </Tooltip>

            <Tooltip content={canReplayAndReplicate ? 'Replicate Event' : 'Insufficient permissions'}>
                <Button
                    className="nexus-c-event-drawer-header__replicate-button"
                    onClick={onInnerReplicate}
                    isLoading={isReplicating}
                    isDisabled={!canReplayAndReplicate || !event || !eventId}
                >
                    Replicate
                </Button>
            </Tooltip>
            <NexusDownload
                className="nexus-c-event-drawer-header__download-button"
                data={event}
                filename={`${eventId} - event`}
                isDisabled={!event || !eventId}
            />
        </div>
    );
};

EventDrawerH.propTypes = {
    event: PropTypes.object,
    isReplaying: PropTypes.bool,
    onReplay: PropTypes.func,
    isReplicating: PropTypes.bool,
    onReplicate: PropTypes.func,
};

EventDrawerH.defaultProps = {
    event: null,
    isReplaying: false,
    onReplay: null,
    isReplicating: false,
    onReplicate: null,
};

const createMapStateToProps = () => {
    const replayingLoadingSelector = createLoadingSelector([REPLAY_EVENT]);
    const replicatingLoadingSelector = createLoadingSelector([REPLICATE_EVENT]);
    return state => ({
        isReplaying: replayingLoadingSelector(state),
        isReplicating: replicatingLoadingSelector(state),
    });
};
const mapDispatchToProps = dispatch => ({
    onReplay: payload => dispatch(replayEvent(payload)),
    onReplicate: payload => dispatch(replicateEvent(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(EventDrawerH);
