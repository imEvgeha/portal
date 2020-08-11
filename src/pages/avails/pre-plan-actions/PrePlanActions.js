import React, {useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MoreIcon from '../../../assets/more-icon.svg';
import {NexusModalContext} from "../../../ui/elements/nexus-modal/NexusModal";
import {SUCCESS_ICON, SUCCESS_TITLE} from "../../../ui/elements/nexus-toast-notification/constants";
import withToasts from '../../../ui/toast/hoc/withToasts';
import { rightsService } from '../../legacy/containers/avail/service/RightsService';
import {getEligibleRights} from '../menu-actions/actions';
import './PrePlanActions.scss';
import StatusCheck from "../rights-repository/components/status-check/StatusCheck";
import  DOPService from '../selected-for-planning/DOP-services';
import {STATUS_CHECK_HEADER, STATUS_CHECK_MSG} from '../selected-rights-actions/constants';
import {ADD_TO_SELECTED_PLANNING, REMOVE_PRE_PLAN_TAB, getSuccessToastMsg} from './constants';

export const PrePlanActions = ({
    selectedPrePlanRights,
    addToast,
    removeToast,
    setSelectedPrePlanRights,
    setPreplanRights,
    prePlanRepoRights,
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const node = useRef();
    const {setModalContentAndTitle, close} = useContext(NexusModalContext);
    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeRightsFromPrePlan = () => {
        const selectedPrePlanRightsId = selectedPrePlanRights.map(right => right.id);
        const notSelectedRights = prePlanRepoRights.filter(right => !selectedPrePlanRightsId.includes(right.id));
        setPreplanRights([...notSelectedRights]);
        setSelectedPrePlanRights([]);
        clickHandler();
    };

    const addToSelectedForPlanning = () => {
        Promise.all(selectedPrePlanRights.map(right => rightsService.get(right.id, true)))
        .then(result => {
            const [eligibleRights, nonEligibleRights] = getEligibleRights(result);
            if(nonEligibleRights && nonEligibleRights.length) {
                setModalContentAndTitle(
                    <StatusCheck
                        message={STATUS_CHECK_MSG}
                        nonEligibleTitles={nonEligibleRights}
                        onClose={close}
                    />,
                    STATUS_CHECK_HEADER
                );
            }
            if(eligibleRights && eligibleRights.length) {
                const requestData = DOPService.createProjectRequestData(eligibleRights);
                DOPService.createProject(requestData).then(res => {
                    console.log(res);
                    if(res.id) {
                        const projectId = res.id;
                        //call update avails api
                        //call DOP start project api
                        //show successful toast
                        //remove above rights from preplan tab
                        dispatchSuccessToast(eligibleRights.length);
                        removeRightsFromPrePlan();
                    }
                });
            }
        });
    }

    const dispatchSuccessToast = noOfItems => {
        addToast({
            title: SUCCESS_TITLE,
            description: getSuccessToastMsg(noOfItems),
            icon: SUCCESS_ICON,
            isAutoDismiss: true,
            isWithOverlay: false,
        });
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
                            selectedPrePlanRights.length && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="add-to-pre-plan"
                        onClick={selectedPrePlanRights.length ? addToSelectedForPlanning : null}
                    >
                        <div>{ADD_TO_SELECTED_PLANNING}</div>
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-selected-rights-actions__menu-item',
                            selectedPrePlanRights.length && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="remove-pre-plan"
                        onClick={selectedPrePlanRights.length ? removeRightsFromPrePlan : null}
                    >
                        <div>{REMOVE_PRE_PLAN_TAB}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

PrePlanActions.propTypes = {
    selectedPrePlanRights: PropTypes.array,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    setSelectedPrePlanRights: PropTypes.func.isRequired,
    prePlanRepoRights: PropTypes.array,
    setPreplanRights: PropTypes.func.isRequired,
};

PrePlanActions.defaultProps = {
    selectedPrePlanRights: [],
    addToast: () => null,
    removeToast: () => null,
    prePlanRepoRights: [],
};

export default withToasts(PrePlanActions);
