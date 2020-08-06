import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {connect} from 'react-redux';
import MoreIcon from '../../../assets/more-icon.svg';
import withToasts from '../../../ui/toast/hoc/withToasts';
import {ADD_TO_SELECTED_PLANNING, REMOVE_PRE_PLAN_TAB} from './constants';
import './PrePlanActions.scss';

export const PrePlanActions = ({
    selectedPrePlanRights,
    setSelectedPrePlanRights,
    setPreplanRights,
    prePlanRepoRights,
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const node = useRef();
    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeRightsFromPrePlan = () => {
        // TODO: Use selected from preplan - not rights repo
        const selectedPrePlanRightsId = selectedPrePlanRights.map(right => right.id);
        const notSelectedRights = prePlanRepoRights.filter(right => !selectedPrePlanRightsId.includes(right.id));
        setPreplanRights([...notSelectedRights]);
        setSelectedPrePlanRights([]);
        clickHandler();
    };

    const addToSelectedforPlanning = () => {
        //Todo - validate rights and call DOP service
        console.log('selectedPrePlanRights: ', selectedPrePlanRights);
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
                        onClick={selectedPrePlanRights.length ? addToSelectedforPlanning : null}
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
