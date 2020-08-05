import React, {useState, useEffect, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {get, uniqBy} from 'lodash';
import {connect} from 'react-redux';
import MoreIcon from '../../../assets/more-icon.svg';
import NexusDrawer from '../../../ui/elements/nexus-drawer/NexusDrawer';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import NexusSpinner from '../../../ui/elements/nexus-spinner/NexusSpinner';
import NexusTooltip from '../../../ui/elements/nexus-tooltip/NexusTooltip';
import {toggleRefreshGridData} from '../../../ui/grid/gridActions';
import withToasts from '../../../ui/toast/hoc/withToasts';
import {URL} from '../../../util/Common';
import AuditHistoryTable from '../../legacy/components/AuditHistoryTable/AuditHistoryTable';
import {getRightsHistory} from '../availsService';
import BulkMatching from '../bulk-matching/BulkMatching';
import BulkUnmatch from '../bulk-unmatch/BulkUnmatch';
import {BULK_UNMATCH_TITLE} from '../bulk-unmatch/constants';
import StatusCheck from '../rights-repository/components/status-check/StatusCheck';
import {
    REMOVE_PRE_PLAN_TAB,
} from './constants';
import './PrePlanActions.scss';

export const PrePlanActions = ({
    selectedRights,
    addToast,
    removeToast,
    toggleRefreshGridData,
    selectedRightGridApi,
    gridApi,
    setSelectedRights,
    setPrePlanRepoRights,
    activeTab,
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const node = useRef();
    const clickHandler = () => setMenuOpened(!menuOpened);

    const openAuditHistoryModal = () => {
    };


    return (
        <>
            <div className="nexus-c-selected-rights-actions" ref={node}>
                <MoreIcon fill="#A5ADBA" onClick={clickHandler} />
                <div
                    className={classNames(
                        'nexus-c-selected-rights-actions__menu',
                        menuOpened && 'nexus-c-selected-rights-actions__menu--is-open'
                    )}
                >
                    <div
                        className={classNames(
                            'nexus-c-selected-rights-actions__menu-item',
                            selectedRights.length && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="view-history"
                        onClick={selectedRights.length ? openAuditHistoryModal : null}
                    >
                        <div>{REMOVE_PRE_PLAN_TAB}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

PrePlanActions.propTypes = {
    selectedRights: PropTypes.array,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    selectedRightGridApi: PropTypes.object,
    toggleRefreshGridData: PropTypes.func.isRequired,
    setSelectedRights: PropTypes.func.isRequired,
    setPrePlanRepoRights: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    gridApi: PropTypes.object,
};

PrePlanActions.defaultProps = {
    selectedRights: [],
    addToast: () => null,
    removeToast: () => null,
    selectedRightGridApi: {},
    gridApi: {},
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(withToasts(PrePlanActions));
