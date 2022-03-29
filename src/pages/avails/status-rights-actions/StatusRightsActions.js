import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import classNames from 'classnames';
import {useDispatch} from 'react-redux';
import {postReSyncRights} from '../status-log-rights-table/statusLogActions';
import {RE_SYNC, RE_SYNC_TOOLTIP} from './constants';
import './StatusRightsActions.scss';

export const StatusRightsActions = ({rights}) => {
    const node = useRef();
    const dispatch = useDispatch();

    const onReSync = () => {
        const mappedRights = {rights: rights.map(x => ({id: x?.entityId}))};
        dispatch(postReSyncRights(mappedRights));
    };

    return (
        <>
            <div
                className={`nexus-c-status-rights-actions${
                    rights.length ? '--is-active' : ''
                } d-flex align-items-center`}
                ref={node}
            >
                <div
                    className={classNames('nexus-c-status-rights-actions__menu-item', {
                        'nexus-c-status-rights-actions__menu-item--is-active': rights.length,
                    })}
                    data-test-id="bulk-match"
                    onClick={onReSync}
                >
                    <NexusTooltip content={RE_SYNC_TOOLTIP} isDisabled={false}>
                        <div>{RE_SYNC}</div>
                    </NexusTooltip>
                </div>
            </div>
        </>
    );
};

export default StatusRightsActions;

StatusRightsActions.propTypes = {
    rights: PropTypes.array,
};

StatusRightsActions.defaultProps = {
    rights: [],
};
