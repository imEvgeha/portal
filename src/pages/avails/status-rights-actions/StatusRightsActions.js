import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import classNames from 'classnames';
import {useDispatch} from 'react-redux';
import {postReSync} from '../status-log-rights-table/StatusLogService';
import {RE_SYNC, RE_SYNC_TOOLTIP} from './constants';
import './StatusRightsActions.scss';

export const StatusRightsActions = ({statusLogResyncRights}) => {
    const node = useRef();
    const dispatch = useDispatch();
    const [isReSyncActive, setIsReSyncActive] = useState(true);

    const successToast = {
        summary: 'Success',
        severity: 'success',
        detail: ' Successfully updated',
    };

    const reSync = statusLogResyncRights => {
        setIsReSyncActive(false);
        postReSync(statusLogResyncRights)
            .then(res => {
                setIsReSyncActive(true);
                dispatch(addToast(successToast));
            })
            .catch(setIsReSyncActive(true));
    };

    return (
        <>
            <div className="nexus-c-status-rights-actions d-flex align-items-center" ref={node}>
                <div
                    className={classNames('nexus-c-status-rights-actions__menu-item', {
                        'nexus-c-status-rights-actions__menu-item--is-active': isReSyncActive,
                    })}
                    data-test-id="bulk-match"
                    onClick={() => reSync(statusLogResyncRights)}
                >
                    <NexusTooltip content={RE_SYNC_TOOLTIP} isDisabled={false}>
                        <div>{RE_SYNC}</div>
                    </NexusTooltip>
                </div>
            </div>
        </>
    );
};

export default withToasts(StatusRightsActions);

StatusRightsActions.propTypes = {
    statusLogResyncRights: PropTypes.object,
};

StatusRightsActions.defaultProps = {
    statusLogResyncRights: {},
};
