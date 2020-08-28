import React, {useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';
import classNames from 'classnames';
import {uniq} from 'lodash';
import MoreIcon from '../../../assets/more-icon.svg';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import {
    SUCCESS_ICON,
    SUCCESS_TITLE,
    WARNING_ICON,
    WARNING_TITLE,
} from '../../../ui/elements/nexus-toast-notification/constants';
import withToasts from '../../../ui/toast/hoc/withToasts';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {getEligibleRights} from '../menu-actions/actions';
import './PrePlanActions.scss';
import StatusCheck from '../rights-repository/components/status-check/StatusCheck';
import DOPService from '../selected-for-planning/DOP-services';
import {STATUS_CHECK_HEADER, STATUS_CHECK_MSG} from '../selected-rights-actions/constants';
import {ADD_TO_SELECTED_PLANNING, REMOVE_PRE_PLAN_TAB, getSuccessToastMsg, NO_TERRITORIES_SELECTED} from './constants';

export const PrePlanActions = ({
    selectedPrePlanRights,
    addToast,
    setSelectedPrePlanRights,
    setPreplanRights,
    prePlanRepoRights = [],
    username,
}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const [isFetchDOP, setIsFetchDOP] = useState(false);
    const node = useRef();
    const {setModalContentAndTitle, close} = useContext(NexusModalContext);
    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeRightsFromPrePlan = () => {
        const selectedRights = [];
        const selectedPrePlanRightsId = selectedPrePlanRights.map(right => {
            const unselectedTerritory = right.territory.filter(t => !t.selected);
            unselectedTerritory.length &&
                selectedRights.push({
                    ...right,
                    territory: unselectedTerritory,
                });
            return right.id;
        });
        const notSelectedRights = prePlanRepoRights.filter(right => !selectedPrePlanRightsId.includes(right.id)) || [];
        setPreplanRights({[username]: [...notSelectedRights, ...selectedRights]});
        setSelectedPrePlanRights([]);
        clickHandler();
    };

    const addToSelectedForPlanning = () => {
        const selectedList = selectedPrePlanRights.every(right => {
            return right['territory'].some(t => t.selected);
        });
        if (!selectedList) {
            addToast({
                title: WARNING_TITLE,
                description: NO_TERRITORIES_SELECTED,
                icon: WARNING_ICON,
                isAutoDismiss: true,
                isWithOverlay: false,
            });
            return;
        }
        setIsFetchDOP(true);
        Promise.all(selectedPrePlanRights.map(right => rightsService.get(right.id, {isWithErrorHandling: true})))
            .then(result => {
                const [eligibleRights, nonEligibleRights] = getEligibleRights(result);
                const DOPRequestRights = [];
                if (nonEligibleRights && nonEligibleRights.length) {
                    setModalContentAndTitle(
                        <StatusCheck
                            message={STATUS_CHECK_MSG}
                            nonEligibleTitles={nonEligibleRights}
                            onClose={close}
                        />,
                        STATUS_CHECK_HEADER
                    );
                }
                if (eligibleRights && eligibleRights.length) {
                    const mergedWithSelectedRights = eligibleRights.map(right => {
                        const previousRight = selectedPrePlanRights.find(obj => obj.id === right.id);
                        const prevKeywords = Array.isArray(previousRight['keywords'])
                            ? previousRight['keywords']
                            : previousRight['keywords'].split(',');
                        const prevTerritory = [];
                        const updatedRight = {
                            id: right.id,
                            keywords: uniq(prevKeywords.concat(right['keywords'])),
                            territory: right['territory'].map(territory => {
                                const selected = previousRight['territory'].find(
                                    obj => obj.country === territory.country && obj.selected
                                );
                                selected && prevTerritory.push(selected);
                                return selected || territory;
                            }),
                        };
                        DOPRequestRights.push({
                            id: right.id,
                            territory: prevTerritory,
                        });
                        return updatedRight;
                    });
                    const requestData = DOPService.createProjectRequestData(DOPRequestRights);
                    DOPService.createProject(requestData)
                        .then(res => {
                            if (res.id) {
                                const projectId = res.id;
                                Promise.all(
                                    mergedWithSelectedRights.map(right => {
                                        return rightsService.update(right, right.id);
                                    })
                                )
                                    .then(() => {
                                        DOPService.startProject(projectId)
                                            .then(() => {
                                                dispatchSuccessToast(eligibleRights.length);
                                                removeRightsFromPrePlan();
                                                setIsFetchDOP(false);
                                            })
                                            .catch(() => {
                                                setIsFetchDOP(false);
                                            });
                                    })
                                    .catch(() => setIsFetchDOP(false));
                            }
                        })
                        .catch(() => setIsFetchDOP(false));
                }
            })
            .catch(() => setIsFetchDOP(false));
    };

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
                            selectedPrePlanRights.length &&
                                isFetchDOP === false &&
                                'nexus-c-selected-rights-actions__menu-item--is-active'
                        )}
                        data-test-id="add-to-pre-plan"
                        onClick={selectedPrePlanRights.length ? addToSelectedForPlanning : null}
                    >
                        <div>
                            {ADD_TO_SELECTED_PLANNING}
                            {isFetchDOP && (
                                <span>
                                    {' '}
                                    <Spinner size="small" />
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={classNames(
                            'nexus-c-selected-rights-actions__menu-item',
                            selectedPrePlanRights.length &&
                                isFetchDOP === false &&
                                'nexus-c-selected-rights-actions__menu-item--is-active'
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
    setSelectedPrePlanRights: PropTypes.func.isRequired,
    prePlanRepoRights: PropTypes.array,
    setPreplanRights: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
};

PrePlanActions.defaultProps = {
    selectedPrePlanRights: [],
    addToast: () => null,
    prePlanRepoRights: [],
};

export default withToasts(PrePlanActions);
