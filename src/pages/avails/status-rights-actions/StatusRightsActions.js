import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {createStatusLogResyncRightsSelector} from '../rights-repository/rightsSelectors';
import {postReSync} from '../status-log-rights-table/StatusLogService';
import {RE_SYNC, RE_SYNC_TOOLTIP} from './constants';
import './StatusRightsActions.scss';

export const StatusRightsActions = ({statusLogResyncRights}) => {
    const node = useRef();
    // const [isReSyncActive, setIsReSyncActive] = useState(false);

    console.log('%cstatusLogResyncRights', 'color: gold; font-size: 12px;', statusLogResyncRights);

    return (
        <>
            <div className="nexus-c-status-rights-actions d-flex align-items-center" ref={node}>
                <div
                    // className={classNames('nexus-c-status-rights-actions__menu-item', {
                    //     'nexus-c-status-rights-actions__menu-item--is-active': isReSyncActive,
                    // })}
                    data-test-id="bulk-match"
                    // onClick={() => setIsReSyncActive(!isReSyncActive)}
                    onClick={() => postReSync(statusLogResyncRights)}
                >
                    <NexusTooltip content={RE_SYNC_TOOLTIP} isDisabled={false}>
                        <div>{RE_SYNC}</div>
                    </NexusTooltip>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = () => {
    const statusLogResyncRightsSelector = createStatusLogResyncRightsSelector();

    return (state, props) => ({
        statusLogResyncRights: statusLogResyncRightsSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StatusRightsActions);

StatusRightsActions.propTypes = {
    statusLogResyncRights: PropTypes.object,
};

StatusRightsActions.defaultProps = {
    statusLogResyncRights: {},
};
