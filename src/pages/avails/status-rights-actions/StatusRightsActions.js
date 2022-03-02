import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import classNames from 'classnames';
import {isEmpty} from 'lodash';
import {useDispatch} from 'react-redux';
import {postReSyncRights} from '../status-log-rights-table/statusLogActions';
import {RE_SYNC, RE_SYNC_TOOLTIP} from './constants';
import './StatusRightsActions.scss';

export const StatusRightsActions = ({statusLogResyncRights}) => {
    const node = useRef();
    const dispatch = useDispatch();

    const isReSyncInactive = isEmpty(statusLogResyncRights.rights);

    return (
        <>
            <div
                className={`${
                    isReSyncInactive ? 'nexus-c-status-rights-actions' : 'nexus-c-status-rights-actions--is-active'
                }
                     d-flex align-items-center`}
                ref={node}
            >
                <div
                    className={classNames('nexus-c-status-rights-actions__menu-item', {
                        'nexus-c-status-rights-actions__menu-item--is-active': !isReSyncInactive,
                    })}
                    data-test-id="bulk-match"
                    onClick={() => dispatch(postReSyncRights(statusLogResyncRights))}
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
    statusLogResyncRights: PropTypes.object,
};

StatusRightsActions.defaultProps = {
    statusLogResyncRights: {},
};
