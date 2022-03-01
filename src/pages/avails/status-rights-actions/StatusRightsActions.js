import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import classNames from 'classnames';
import {isEmpty} from 'lodash';
import {useDispatch} from 'react-redux';
import {postReSync} from '../status-log-rights-table/StatusLogService';
import {RE_SYNC, RE_SYNC_TOOLTIP} from './constants';
import './StatusRightsActions.scss';

export const StatusRightsActions = ({statusLogResyncRights}) => {
    const node = useRef();
    const dispatch = useDispatch();
    const [isReSyncActive, setIsReSyncActive] = useState(false);

    useEffect(() => {
        statusLogResyncRights && !isEmpty(statusLogResyncRights.rights)
            ? setIsReSyncActive(true)
            : setIsReSyncActive(false);
    }, [statusLogResyncRights]);

    const successToast = {
        summary: 'Success',
        severity: 'success',
        detail: ' Successfully updated',
    };

    const reSync = statusLogResyncRights => {
        postReSync(statusLogResyncRights).then(res => {
            dispatch(addToast(successToast));
        });
    };

    return (
        <>
            <div
                className={`${
                    !isReSyncActive ? 'nexus-c-status-rights-actions' : 'nexus-c-status-rights-actions--is-active'
                } d-flex align-items-center`}
                ref={node}
            >
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
