import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import SectionMessage from '@atlaskit/section-message';
import {AG_GRID_COLUMN_FILTER} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineActionButtonColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {NEW_RIGHT_BUTTON_CLICK_MESSAGE, WARNING_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import sortTableHeaders from '@vubiquity-nexus/portal-utils/lib/sortTableHeaders';
import {get, isEmpty} from 'lodash';
import {Button as PrimeReactButton} from 'primereact/button';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import {backArrowColor} from '../../../../../packages/styles/constants';
import {NexusTitle, NexusGrid} from '../../../../ui/elements';
import {prepareRight, rightsService} from '../../../legacy/containers/avail/service/RightsService';
import {AVAILS_PATH} from '../../availsRoutes';
import {
    createRightMatchingColumnDefs,
    fetchAndStoreFocusedRight,
    storeMatchedRights,
    validateConflictingRights,
} from '../rightMatchingActions';
import {
    RIGHT_TO_MATCH_TITLE,
    NEW_BUTTON,
    RIGHT_MATCHING_DOP_STORAGE,
    PENDING_RIGHT,
    CONFLICTING_RIGHTS,
    CANCEL_BUTTON,
    MATCH_BUTTON,
    SECTION_MESSAGE,
} from '../rightMatchingConstants';
import * as selectors from '../rightMatchingSelectors';
import {getMatchingCandidates} from '../rightMatchingService';
import useDOPIntegration from '../util/hooks/useDOPIntegration';
import RightToMatchNavigation from './components/navigation/RightToMatchNavigation';
import {TABLE_HEADERS, FIELDS, TABLE_NAMES} from './constants';
import './RightToMatchView.scss';

const RightRepositoryNexusGrid = compose(withColumnsResizing(), withSideBar())(NexusGrid);

const IncomingRightNexusGrid = withColumnsResizing()(NexusGrid);

const RightToMatchView = ({
    match,
    columnDefs,
    mapping,
    createRightMatchingColumnDefs,
    fetchFocusedRight,
    focusedRight,
    history,
    location,
    addToast,
    removeToast,
    pendingRight,
    mergeRights,
    storeMatchedRights,
    validateRights,
}) => {
    const [matchingCandidates, setMatchingCandidates] = useState([]);
    const [newPendingRight, setNewPendingRight] = useState([]);
    const {params = {}} = match;
    const {rightId, availHistoryIds} = params || {};
    const previousPageRoute = URL.isEmbedded()
        ? `/avails/history/${availHistoryIds}/right-matching?embedded=true`
        : focusedRight.id
        ? `/avails/rights/${focusedRight.id}`
        : AVAILS_PATH;

    // DOP Integration
    useDOPIntegration(null, RIGHT_MATCHING_DOP_STORAGE);

    useEffect(() => {
        (focusedRight.id || newPendingRight.length) &&
            getMatchingCandidates(rightId, getTpr(), get(newPendingRight, '[0]', '')).then(response => {
                const rights = response.filter(r => r.id !== rightId) || []; // as candidates API returns pending right in response
                setMatchingCandidates(rights);
            });
    }, [focusedRight.id, newPendingRight]);

    useEffect(() => {
        // TODO: refactor this - unnecessary call
        if (!columnDefs.length || !mapping) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, mapping, createRightMatchingColumnDefs]);

    useEffect(() => {
        if (mergeRights && !isEmpty(pendingRight)) {
            setNewPendingRight([prepareRight(pendingRight)]);
        } else {
            fetchFocusedRight(rightId);
        }
    }, [availHistoryIds, fetchFocusedRight, rightId]);

    const getTpr = () => {
        return (
            get(newPendingRight, '[0].temporaryPriceReduction', false) ||
            get(focusedRight, 'temporaryPriceReduction', false)
        );
    };

    const onUpdateRight = e => {
        e.preventDefault();
        removeToast();
        rightsService
            .updateRightWithFullData({...focusedRight, status: 'Ready'}, focusedRight.id, true)
            .then(() => history.push(URL.keepEmbedded(`/avails/rights/${focusedRight.id}`)));
    };

    const onUpdateRightClick = () => {
        addToast({
            severity: 'warn',
            closable: false,
            content: (
                <ToastBody summary={WARNING_TITLE} detail={NEW_RIGHT_BUTTON_CLICK_MESSAGE} severity="warn">
                    <div className="d-flex align-items-center">
                        <PrimeReactButton
                            label="Cancel"
                            className="p-button-link p-toast-left-button"
                            onClick={() => removeToast()}
                        />
                        <PrimeReactButton
                            label="Continue"
                            className="p-button-link p-toast-right-button"
                            onClick={onUpdateRight}
                        />
                    </div>
                </ToastBody>
            ),
            sticky: true,
        });
    };

    // eslint-disable-next-line react/prop-types
    const createNewButtonCellRenderer = ({data}) => {
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id || '0'}>
                <Button onClick={onUpdateRightClick}>{NEW_BUTTON}</Button>
            </CustomActionsCellRenderer>
        );
    };

    const actionNewButtonColumnDef = defineActionButtonColumn({
        cellRendererFramework: createNewButtonCellRenderer,
    });
    const updatedFocusedRight = focusedRight && rightId === focusedRight.id ? [focusedRight] : [];

    const handleMatchClick = () => {
        if (matchingCandidates?.length > 0) {
            const matchedRightIds = matchingCandidates.map(el => el.id);
            validateRights({
                rightId,
                setMatchingCandidates,
                tpr: getTpr(),
                rightData: get(newPendingRight, '[0]', ''),
                selectedRights: matchedRightIds,
                callback: () => {
                    storeMatchedRights({rightsForMatching: matchingCandidates});
                    if (mergeRights) {
                        return history.push(URL.keepEmbedded(`${location.pathname}/preview`));
                    }
                    history.push(URL.keepEmbedded(`${location.pathname}/match/${matchedRightIds.join()}`));
                },
            });
        }
    };

    const highlightDiffCells = columnDefinitions => {
        const pendingRightData = Object.keys(pendingRight).length === 0 ? focusedRight : pendingRight;
        if (Object.keys(pendingRightData).length === 0) return;
        const {START, END, AVAIL_START, AVAIL_END, TERRITORY, FORMAT} = FIELDS;

        columnDefinitions.forEach(def => {
            def.cellClass = params => {
                const key = params.colDef.field;
                let areTerritoriesEqual = true;
                let areFormatsEqual = true;
                switch (key) {
                    case START:
                    case END:
                    case AVAIL_START:
                    case AVAIL_END: {
                        const or =
                            (!pendingRightData[key] && params.value) ||
                            (pendingRightData[key] && !params.value) ||
                            (pendingRightData[key] && params.value);
                        if (or && pendingRightData[key] !== params.value) {
                            return 'nexus-c-right-to-match-view__grid-column--highlighted';
                        }
                        break;
                    }
                    case TERRITORY:
                        if (params.colDef.colId === 'selected') {
                            return '';
                        }
                        if (pendingRightData[key].length !== params.value.length) {
                            return 'nexus-c-right-to-match-view__grid-column--highlighted';
                        }
                        pendingRightData[key].forEach(territory => {
                            if (!params.value.find(country => country.country === territory.country)) {
                                areTerritoriesEqual = false;
                            }
                        });
                        if (!areTerritoriesEqual) {
                            return 'nexus-c-right-to-match-view__grid-column--highlighted';
                        }
                        break;
                    case FORMAT:
                        if (pendingRightData[key].length !== params.value.length) {
                            return 'nexus-c-right-to-match-view__grid-column--highlighted';
                        }
                        pendingRightData[key].forEach(format => {
                            if (
                                !params.value.find(val => val === (typeof format === 'string' ? format : format.value))
                            ) {
                                areFormatsEqual = false;
                            }
                        });
                        if (!areFormatsEqual) {
                            return 'nexus-c-right-to-match-view__grid-column--highlighted';
                        }
                        break;
                    default:
                        return '';
                }

                return '';
            };
        });
    };

    const reorderConflictingRightsHeaders = tableName => {
        if (columnDefs.length === 1) return [];
        if (matchingCandidates === null) return;

        const {PENDING_RIGHT, CONFLICTING_RIGHTS} = TABLE_NAMES;
        const {ACTIONS, RIGHT_ID, REMOVED_CATALOG, TITLE, TERRITORY, FORMAT, AVAIL_START, AVAIL_END, START, END} =
            TABLE_HEADERS;
        const headerNames = [RIGHT_ID, REMOVED_CATALOG, TITLE, TERRITORY, FORMAT, AVAIL_START, AVAIL_END, START, END];

        let columnDefinitions = columnDefs?.filter(elem => elem);
        if (tableName === PENDING_RIGHT) {
            if (matchingCandidates.length === 0 && get(focusedRight, 'id')) {
                headerNames.unshift(ACTIONS);
                columnDefinitions = [actionNewButtonColumnDef, ...columnDefs];
            } else {
                columnDefinitions = [...columnDefs];
            }
        }

        const reorderedHeaders = sortTableHeaders(columnDefinitions, headerNames)?.filter(elem => elem);

        if (tableName === CONFLICTING_RIGHTS) {
            highlightDiffCells(reorderedHeaders);
        }

        return reorderedHeaders.map(column => ({...column, floatingFilter: true}));
    };

    return (
        <div className="nexus-c-right-to-match-view">
            <NexusTitle>
                <Link to={URL.keepEmbedded(previousPageRoute)}>
                    <ArrowLeftIcon size="large" primaryColor={backArrowColor} />
                </Link>
                <span>{RIGHT_TO_MATCH_TITLE}</span>
            </NexusTitle>
            {columnDefs && columnDefs.length > 0 && (
                <>
                    <div className="nexus-c-right-to-match-view__table-header">
                        <NexusTitle isSubTitle isInline>
                            {PENDING_RIGHT}
                        </NexusTitle>
                        {!mergeRights && (
                            <RightToMatchNavigation
                                searchParams={{availHistoryIds}}
                                focusedRightId={rightId}
                                focusedRight={focusedRight}
                                availHistoryIds={availHistoryIds}
                                history={history}
                            />
                        )}
                    </div>
                    <div className="nexus-c-right-to-match-view__focused-right">
                        <IncomingRightNexusGrid
                            id="incomingRightRightsMatching"
                            columnDefs={reorderConflictingRightsHeaders(TABLE_NAMES.PENDING_RIGHT)}
                            rowData={newPendingRight.length ? newPendingRight : updatedFocusedRight}
                            domLayout="autoHeight"
                        />
                    </div>
                    <SectionMessage appearance="info">
                        <p className="nexus-c-right-to-match-view__section-message">{SECTION_MESSAGE}</p>
                    </SectionMessage>
                    <div className="nexus-c-right-to-match-view__rights-to-match">
                        <NexusTitle isSubTitle>
                            {CONFLICTING_RIGHTS} {`(${matchingCandidates?.length})`}
                        </NexusTitle>
                        {matchingCandidates.length && (
                            <RightRepositoryNexusGrid
                                id="rightsMatchingRepo"
                                columnDefs={reorderConflictingRightsHeaders(TABLE_NAMES.CONFLICTING_RIGHTS)}
                                mapping={mapping}
                                rowSelection="multiple"
                                rowData={matchingCandidates}
                                suppressRowClickSelection={true}
                                defaultColDef={{
                                    filter: AG_GRID_COLUMN_FILTER.TEXT,
                                    sortable: true,
                                }}
                                columnTypes={{
                                    dateColumn: {
                                        filter: false,
                                    },
                                }}
                            />
                        )}
                    </div>
                    <div className="nexus-c-right-to-match-view__buttons">
                        <ButtonGroup>
                            <Button
                                className="nexus-c-button"
                                onClick={() => history.push(URL.keepEmbedded(previousPageRoute))}
                            >
                                {CANCEL_BUTTON}
                            </Button>
                            <Button className="nexus-c-button" appearance="primary" onClick={handleMatchClick}>
                                {MATCH_BUTTON}
                            </Button>
                        </ButtonGroup>
                    </div>
                </>
            )}
        </div>
    );
};

RightToMatchView.propTypes = {
    focusedRight: PropTypes.object,
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    fetchFocusedRight: PropTypes.func,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    pendingRight: PropTypes.object,
    // eslint-disable-next-line react/boolean-prop-naming
    mergeRights: PropTypes.bool,
    storeMatchedRights: PropTypes.func,
    validateRights: PropTypes.func.isRequired,
};

RightToMatchView.defaultProps = {
    focusedRight: null,
    fetchFocusedRight: null,
    addToast: () => null,
    removeToast: () => null,
    columnDefs: [],
    mapping: [],
    history: {push: () => null},
    match: {},
    location: {},
    pendingRight: null,
    mergeRights: false,
    storeMatchedRights: () => null,
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const pendingRightSelector = selectors.createPendingRightSelector();
    const mergeRightsSelector = selectors.createMergeRightsSelector();

    return state => ({
        columnDefs: rightMatchingColumnDefsSelector(state),
        mapping: availsMappingSelector(state),
        focusedRight: focusedRightSelector(state),
        pendingRight: pendingRightSelector(state),
        mergeRights: mergeRightsSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchFocusedRight: payload => dispatch(fetchAndStoreFocusedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    storeMatchedRights: payload => dispatch(storeMatchedRights(payload)),
    validateRights: payload => dispatch(validateConflictingRights(payload)),
});

export default compose(
    withToasts,
    // eslint-disable-next-line
    connect(createMapStateToProps, mapDispatchToProps)
)(RightToMatchView);
