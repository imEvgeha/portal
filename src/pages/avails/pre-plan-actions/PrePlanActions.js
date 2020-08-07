import React, {useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MoreIcon from '../../../assets/more-icon.svg';
import {NexusModalContext} from "../../../ui/elements/nexus-modal/NexusModal";
import withToasts from '../../../ui/toast/hoc/withToasts';
import { rightsService } from '../../legacy/containers/avail/service/RightsService';
import {getEligibleRights} from '../menu-actions/actions';
import './PrePlanActions.scss';
import StatusCheck from "../rights-repository/components/status-check/StatusCheck";
import {STATUS_CHECK_HEADER, STATUS_CHECK_MSG} from '../selected-rights-actions/constants';
import {ADD_TO_SELECTED_PLANNING, REMOVE_PRE_PLAN_TAB} from './constants';

export const PrePlanActions = ({
    selectedPrePlanRights,
    setSelectedPrePlanRights,
    setPreplanRights,
    prePlanRepoRights,
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const node = useRef();
    const {setModalContentAndTitle, close} = useContext(NexusModalContext);
    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeRightsFromPrePlan = () => {
        // TODO: Use selected from preplan - not rights repo
        const selectedPrePlanRightsId = selectedPrePlanRights.map(right => right.id);
        const notSelectedRights = prePlanRepoRights.filter(right => !selectedPrePlanRightsId.includes(right.id));
        setPreplanRights([...notSelectedRights]);
        setSelectedPrePlanRights([]);
        clickHandler();
    };

    const addToSelectedForPlanning = () => {
        Promise.all(selectedPrePlanRights.map(right => rightsService.get(right.id)))
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
            else {
                //TODO: call update rights api
                //TODO: call DOP create/start Project apis here if all validation passed
                //TODO: add rights to next tab - selected for planning
            }
        });
    }

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
                        data-test-id="add-to-preplan"
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
    setSelectedPrePlanRights: PropTypes.func.isRequired,
    prePlanRepoRights: PropTypes.array,
    setPreplanRights: PropTypes.func.isRequired,
};

PrePlanActions.defaultProps = {
    selectedPrePlanRights: [],
    prePlanRepoRights: [],
};

export default withToasts(PrePlanActions);
