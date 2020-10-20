import React, {useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {uniq, cloneDeep} from 'lodash';
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
import BulkSet from './components/BulkSet/BulkSet';
import {
    ADD_TO_SELECTED_PLANNING,
    REMOVE_PRE_PLAN_TAB,
    getSuccessToastMsg,
    NO_TERRITORIES_SELECTED,
    BULK_SET,
} from './constants';

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
    const [territories, setTerritories] = useState([]);
    const [keywords, setKeywords] = useState('');

    const node = useRef();
    const {openModal, closeModal} = useContext(NexusModalContext);
    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeRightsFromPrePlan = keepUnselected => {
        const selectedRights = [];
        const selectedPrePlanRightsId = selectedPrePlanRights.map(right => {
            const unselectedTerritory = keepUnselected ? [] : right.territory.filter(t => !t.selected);
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
                    openModal(
                        <StatusCheck
                            message={STATUS_CHECK_MSG}
                            nonEligibleTitles={nonEligibleRights}
                            onClose={closeModal}
                        />,
                        {title: STATUS_CHECK_HEADER}
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
                                                removeRightsFromPrePlan(false);
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

    const bulkSetInTable = () => {
        const bulkTerritories = territories.map(t => t.value);
        const rightsList = cloneDeep(prePlanRepoRights);
        let updatedRight = {};
        selectedPrePlanRights.forEach(right => {
            right.territory.forEach(t => {
                if (bulkTerritories.includes(t.country)) {
                    updatedRight = rightsList.filter(r => r.id === right.id)[0];
                    updatedRight.territory.filter(tr => tr.country === t.country)[0].selected = true;
                    updatedRight.keywords = Array.from(new Set(`${keywords},${right.keywords}`.split(','))).join(',');
                }
            });
        });
        setPreplanRights({[username]: rightsList});
        closeModal();
    };

    const openBulkSetModal = () => {
        setMenuOpened(false);
        openModal(<BulkSet setTerritories={setTerritories} setKeywords={setKeywords} />, {
            title: BULK_SET,
            actions: [
                {
                    text: 'Set',
                    onClick: bulkSetInTable,
                },
                {
                    text: 'Cancel',
                    onClick: closeModal,
                },
            ],
            width: 'small',
        });
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

    const actions = [
        {
            id: 'remove-pre-plan',
            label: REMOVE_PRE_PLAN_TAB,
            onClick: removeRightsFromPrePlan,
        },
        {
            id: 'bulk-set-territories-keywords',
            label: BULK_SET,
            onClick: openBulkSetModal,
        },
        {
            id: 'add-to-select-for-planning',
            label: ADD_TO_SELECTED_PLANNING,
            onClick: addToSelectedForPlanning,
        },
    ];

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
                    {actions.map(({id, label, onClick}) => (
                        <div
                            className={classNames(
                                'nexus-c-selected-rights-actions__menu-item',
                                selectedPrePlanRights.length &&
                                    isFetchDOP === false &&
                                    'nexus-c-selected-rights-actions__menu-item--is-active'
                            )}
                            key={id}
                            data-test-id={id}
                            onClick={selectedPrePlanRights.length ? onClick : null}
                        >
                            <div>{label}</div>
                        </div>
                    ))}
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
