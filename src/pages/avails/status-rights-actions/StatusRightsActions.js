import React, {useState, useRef} from 'react';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import classNames from 'classnames';
import { RE_SYNC, RE_SYNC_TOOLTIP } from './constants';
import './StatusRightsActions.scss';

export const StatusRightsActions = () => {
    const node = useRef();
    const [isReSyncActive, setIsReSyncActive] = useState(false);

    return (
        <>
            <div className="nexus-c-status-rights-actions d-flex align-items-center" ref={node}>
                <div
                    className={classNames('nexus-c-status-rights-actions__menu-item', {
                        'nexus-c-status-rights-actions__menu-item--is-active': isReSyncActive,
                    })}
                    data-test-id="bulk-match"
                    onClick={() => setIsReSyncActive(!isReSyncActive)}
                >
                    <NexusTooltip
                        content={RE_SYNC_TOOLTIP}
                        isDisabled={false}
                    >
                        <div>{RE_SYNC}</div>
                    </NexusTooltip>
                </div>
            </div>
        </>
    );
};

export default StatusRightsActions;
