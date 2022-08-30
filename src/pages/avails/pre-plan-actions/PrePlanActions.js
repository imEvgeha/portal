import React, {useState, useRef, useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import classNames from 'classnames';
import {uniq, cloneDeep} from 'lodash';
import {useDispatch} from 'react-redux';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import BulkMatching from '../bulk-matching/BulkMatching';
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
    setSelectedPrePlanRights,
    setPreplanRights,
    prePlanRepoRights = [],
    username,
    singleRightMatch,
    setSingleRightMatch,
}) => {
    const dispatch = useDispatch();
    const [menuOpened, setMenuOpened] = useState(false);
    const [isFetchDOP, setIsFetchDOP] = useState(false);
    const [territories, setTerritories] = useState([]);
    const [keywords, setKeywords] = useState('');
    const [bulkUpdate, setBulkUpdate] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [headerText, setHeaderText] = useState('');
    const node = useRef();

    useEffect(() => {
        window.addEventListener('click', removeMenu);

        return () => {
            window.removeEventListener('click', removeMenu);
        };
    }, []);

    useEffect(() => {
        if (territories.length) {
            bulkSetInTable();
        }
    }, [bulkUpdate]);

    const {openModal, closeModal} = useContext(NexusModalContext);
    const clickHandler = () => setMenuOpened(!menuOpened);

    const removeMenu = e => {
        if (!node.current.contains(e.target)) {
            setMenuOpened(false);
        }
    };

    const removeRightsFromPrePlan = keepUnselected => {
        const selectedRights = [];
        const selectedPrePlanRightsId = selectedPrePlanRights.map(right => {
            const unselectedTerritory = keepUnselected
                ? []
                : right.territory.filter(
                      t => !t.selected && !t.withdrawn && !right.territoryExcluded.includes(t.country)
                  );
            unselectedTerritory.length &&
                selectedRights.push({
                    ...right,
                    territorySelected: right.territorySelected.concat(
                        right.territory.filter(t => t.selected).map(t => t.country)
                    ),
                    territory: right.territory.filter(t => !t.selected),
                    planKeywords: '',
                    keywords: uniq(right.keywords.concat(right.planKeywords?.split(','))),
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
            dispatch(
                addToast({
                    detail: NO_TERRITORIES_SELECTED,
                    severity: 'warn',
                })
            );
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
                        {title: STATUS_CHECK_HEADER, width: '100%'}
                    );
                    setIsFetchDOP(false);
                }
                if (eligibleRights && eligibleRights.length) {
                    const mergedWithSelectedRights = eligibleRights.map(right => {
                        const previousRight = selectedPrePlanRights.find(obj => obj.id === right.id);
                        const prevTerritory = previousRight.territory
                            .filter(obj => obj.isDirty && obj.selected)
                            .map(t => t.country);
                        const updatedRight = {
                            id: right.id,
                            properties: {
                                keywords: uniq(previousRight.keywords.concat(previousRight.planKeywords?.split(','))),
                                selected: prevTerritory,
                            },
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
                                rightsService
                                    .bulkUpdate(mergedWithSelectedRights)
                                    .then(response => {
                                        DOPService.startProject(projectId)
                                            .then(() => {
                                                dispatchSuccessToast(response.length);
                                                removeRightsFromPrePlan(false);
                                                setSelectedPrePlanRights([]);
                                                clickHandler();
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
            updatedRight = rightsList.find(r => r.id === right.id);
            if (updatedRight) {
                updatedRight.planKeywords = updatedRight.planKeywords
                    ? uniq(keywords.split(',').concat(updatedRight.planKeywords?.split(','))).join(',')
                    : keywords;
                right.territory.forEach(t => {
                    if (bulkTerritories.includes(t.country)) {
                        // eslint-disable-next-line prefer-destructuring
                        updatedRight.territory.filter(tr => tr.country === t.country)[0].selected = true;
                        updatedRight.territory.filter(tr => tr.country === t.country)[0].isDirty = true;
                    }
                });
            }
        });
        setPreplanRights({[username]: rightsList});
        closeModal();
    };

    const openBulkSetModal = () => {
        setMenuOpened(false);
        setTerritories([]);
        setKeywords('');
        openModal(<BulkSet setTerritories={setTerritories} setKeywords={setKeywords} />, {
            title: BULK_SET,
            actions: [
                {
                    text: 'Set',
                    onClick: () => setBulkUpdate(!bulkUpdate),
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
        dispatch(
            addToast({
                detail: getSuccessToastMsg(noOfItems),
                severity: 'success',
            })
        );
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

    const openDrawer = () => {
        setDrawerOpen(true);
        setHeaderText('Title Matching');
    };

    const closeDrawer = () => {
        singleRightMatch.length && setSingleRightMatch([]);
        setDrawerOpen(false);
    };

    // single title match flow (from popover)
    useEffect(() => {
        if (singleRightMatch.length && !drawerOpen) {
            openDrawer();
        }
    }, [singleRightMatch, openDrawer, drawerOpen]);

    return (
        <>
            <div className="nexus-c-selected-rights-actions d-flex align-items-center" ref={node}>
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
            <NexusDrawer
                onClose={closeDrawer}
                isOpen={drawerOpen}
                isClosedOnBlur={false}
                width="wider"
                title={headerText}
            >
                <BulkMatching
                    data={singleRightMatch}
                    closeDrawer={closeDrawer}
                    setHeaderText={setHeaderText}
                    headerText={headerText}
                />
            </NexusDrawer>
        </>
    );
};

PrePlanActions.propTypes = {
    selectedPrePlanRights: PropTypes.array,
    setSelectedPrePlanRights: PropTypes.func,
    prePlanRepoRights: PropTypes.array,
    setPreplanRights: PropTypes.func,
    username: PropTypes.string,
    singleRightMatch: PropTypes.array,
    setSingleRightMatch: PropTypes.func,
};

PrePlanActions.defaultProps = {
    selectedPrePlanRights: [],
    setSelectedPrePlanRights: () => null,
    prePlanRepoRights: [],
    setPreplanRights: () => null,
    username: '',
    singleRightMatch: [],
    setSingleRightMatch: () => null,
};

export default PrePlanActions;
