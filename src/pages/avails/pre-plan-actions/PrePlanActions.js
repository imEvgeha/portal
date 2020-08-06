import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {connect} from 'react-redux';
import MoreIcon from '../../../assets/more-icon.svg';
import {toggleRefreshGridData} from '../../../ui/grid/gridActions';
import withToasts from '../../../ui/toast/hoc/withToasts';
import {ADD_TO_SELECTED_PLANNING, REMOVE_PRE_PLAN_TAB} from './constants';
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
    prePlanRepoRights,
    activeTab,
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const node = useRef();
    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeRightsFromPrePlan = () => {
        // TODO: Use selected from preplan - not rights repo
        const selectedRights = selectedRights.map(right => right.id);
        const notSelectedRights = prePlanRepoRights.filter(right => !selectedRights.includes(right.id));
        setPrePlanRepoRights([...notSelectedRights]);
        setPrePlanRepoRights(selectedRights);
        gridApi.deselectAll();
        setSelectedRights([]);
        toggleRefreshGridData(true);
    };

    const addToSelectedforPlanning = () => {
        //Todo - validate rights and call DOP service
        //console.log('selectedRights: ', selectedRights);
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
                            selectedRights.length && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="add-to-preplan"
                        onClick={selectedRights.length ? addToSelectedforPlanning : null}
                    >
                            <div>{ADD_TO_SELECTED_PLANNING}</div>
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-selected-rights-actions__menu-item',
                            prePlanRepoRights.length && 'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="remove-pre-plan"
                        onClick={selectedRights.length ? removeRightsFromPrePlan : null}
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
    prePlanRepoRights: PropTypes.array,
};

PrePlanActions.defaultProps = {
    selectedRights: [],
    addToast: () => null,
    removeToast: () => null,
    selectedRightGridApi: {},
    gridApi: {},
    prePlanRepoRights: [],
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(withToasts(PrePlanActions));
