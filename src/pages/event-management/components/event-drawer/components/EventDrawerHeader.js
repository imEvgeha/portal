import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import {isAllowed} from '@portal/portal-auth/permissions';
import {Button} from '@portal/portal-components';
import NexusDownload from '@vubiquity-nexus/portal-ui/lib/elements/nexus-download/NexusDownload';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {connect} from 'react-redux';
import {REPLAY_EVENT, REPLICATE_EVENT} from '../../../eventManagementActionTypes';
import {replayEvent, replicateEvent} from '../../../eventManagementActions';
import './EventDrawerHeader.scss';

export const EventDrawerH = ({event, isReplaying, onReplay, isReplicating, onReplicate}) => {
    const {eventId = '', id = ''} = event?.headers || {};
    const canReplayAndReplicate = isAllowed('replayAndReplicate');

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
                    label="Replay"
                    className="p-button-outlined p-button-secondary nexus-c-event-drawer-header__replay-button"
                    onClick={onInnerReplay}
                    loading={isReplaying}
                    disabled={!canReplayAndReplicate || !event || !eventId}
                />
            </Tooltip>

            <Tooltip content={canReplayAndReplicate ? 'Replicate Event' : 'Insufficient permissions'}>
                <Button
                    label="Replicate"
                    className="p-button-outlined p-button-secondary nexus-c-event-drawer-header__replicate-button"
                    onClick={onInnerReplicate}
                    loading={isReplicating}
                    disabled={!canReplayAndReplicate || !event || !eventId}
                />
            </Tooltip>
            <NexusDownload
                className="p-button-outlined p-button-secondary nexus-c-event-drawer-header__download-button"
                data={{
                    headers: event.headers,
                    message: event.message,
                    metadata: event.metadata,
                }}
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
