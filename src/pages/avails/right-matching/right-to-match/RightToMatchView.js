import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import SectionMessage from '@atlaskit/section-message';
import {get, isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import {NexusTitle, NexusGrid} from '../../../../ui/elements';
import {AG_GRID_COLUMN_FILTER, GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {
    defineCheckboxSelectionColumn,
    defineActionButtonColumn,
} from '../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import {WARNING_TITLE, WARNING_ICON} from '../../../../ui/elements/nexus-toast-notification/constants';
import {NEW_RIGHT_BUTTON_CLICK_MESSAGE} from '../../../../ui/toast/constants';
import withToasts from '../../../../ui/toast/hoc/withToasts';
import {URL} from '../../../../util/Common';
import {backArrowColor} from '../../../legacy/constants/avails/constants';
import {prepareRight} from '../../../legacy/containers/avail/service/RightsService';
import {
    createRightMatchingColumnDefs,
    createNewRight,
    fetchAndStoreFocusedRight,
    storeMatchedRights,
} from '../rightMatchingActions';
import {
    RIGHT_TO_MATCH_TITLE,
    NEW_BUTTON,
    RIGHT_MATCHING_DOP_STORAGE,
    PENDING_RIGHT,
    CONFLICTING_RIGHTS,
    CANCEL_BUTTON,
    MATCH_BUTTON,
} from '../rightMatchingConstants';
import * as selectors from '../rightMatchingSelectors';
import {getMatchingCandidates} from '../rightMatchingService';
import useDOPIntegration from '../util/hooks/useDOPIntegration';
import RightToMatchNavigation from './components/navigation/RightToMatchNavigation';
import './RightToMatchView.scss';

const SECTION_MESSAGE = `Select rights from the repository that match the focused right or declare it as a NEW right
from the action menu above.`;

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
    createNewRight,
    addToast,
    removeToast,
    pendingRight,
    mergeRights,
    storeMatchedRights,
}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [isMatchDisabled, setIsMatchDisabled] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [matchingCandidates, setMatchingCandidates] = useState([]);
    const [newPendingRight, setNewPendingRight] = useState([]);
    const {params = {}} = match;
    const {rightId, availHistoryIds} = params || {};
    const previousPageRoute = mergeRights ? '/avails/v2' : `/avails/history/${availHistoryIds}/right-matching`;

    // DOP Integration
    useDOPIntegration(null, RIGHT_MATCHING_DOP_STORAGE);

    useEffect(() => {
        const tpr =
            get(newPendingRight, '[0].temporaryPriceReduction', false) ||
            get(focusedRight, 'temporaryPriceReduction', false) ||
            false;
        (focusedRight.id || newPendingRight.length) &&
            getMatchingCandidates(rightId, tpr, get(newPendingRight, '[0]', '')).then(response => {
                setTotalCount(response.length);
                setMatchingCandidates(response);
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

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn({headerName: 'Actions'});
    const updatedColumnDefs = columnDefs.length ? [checkboxSelectionColumnDef, ...columnDefs] : columnDefs;

    const onDeclareNewRight = () => {
        removeToast();
        const redirectPath = `/avails/history/${availHistoryIds}/right-matching`;
        createNewRight({rightId, redirectPath});
    };

    const onNewRightClick = () => {
        addToast({
            title: WARNING_TITLE,
            description: NEW_RIGHT_BUTTON_CLICK_MESSAGE,
            icon: WARNING_ICON,
            actions: [
                {content: 'Cancel', onClick: () => removeToast()},
                {content: 'OK', onClick: onDeclareNewRight},
            ],
            isWithOverlay: true,
        });
    };

    // eslint-disable-next-line
    const createNewButtonCellRenderer = ({data}) => {
        const {id = '0'} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button onClick={onNewRightClick}>{NEW_BUTTON}</Button>
            </CustomActionsCellRenderer>
        );
    };

    const actionNewButtonColumnDef = defineActionButtonColumn({
        cellRendererFramework: createNewButtonCellRenderer,
    });
    const updatedFocusedRightColumnDefs = columnDefs.length ? [actionNewButtonColumnDef, ...columnDefs] : columnDefs;
    const updatedFocusedRight = focusedRight && rightId === focusedRight.id ? [focusedRight] : [];

    const handleGridEvent = ({type, api}) => {
        const {SELECTION_CHANGED} = GRID_EVENTS;
        if (type === SELECTION_CHANGED) {
            const selectedRows = api.getSelectedRows();
            setSelectedRows(selectedRows);
            setIsMatchDisabled(!selectedRows.length);
        }
    };

    const handleMatchClick = () => {
        if (Array.isArray(selectedRows) && selectedRows.length > 0) {
            const matchedRightIds = selectedRows.map(el => el.id).join();
            if (mergeRights) {
                storeMatchedRights({rightsForMatching: selectedRows});
                return history.push(URL.keepEmbedded(`${location.pathname}/preview`));
            }
            history.push(URL.keepEmbedded(`${location.pathname}/match/${matchedRightIds}`));
        }
    };

    return (
        <div className="nexus-c-right-to-match-view">
            <NexusTitle>
                <Link to={URL.keepEmbedded(previousPageRoute)}>
                    <ArrowLeftIcon size="large" primaryColor={backArrowColor} />
                </Link>
                <span>{RIGHT_TO_MATCH_TITLE}</span>
            </NexusTitle>
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
                    columnDefs={updatedFocusedRightColumnDefs}
                    rowData={newPendingRight.length ? newPendingRight : updatedFocusedRight}
                    domLayout="autoHeight"
                />
            </div>
            <SectionMessage appearance="info">
                <p className="nexus-c-right-to-match-view__section-message">{SECTION_MESSAGE}</p>
            </SectionMessage>
            <div className="nexus-c-right-to-match-view__rights-to-match">
                <NexusTitle isSubTitle>
                    {CONFLICTING_RIGHTS} {`(${totalCount})`}
                </NexusTitle>
                <RightRepositoryNexusGrid
                    id="rightsMatchingRepo"
                    columnDefs={updatedColumnDefs}
                    mapping={mapping}
                    onGridEvent={handleGridEvent}
                    rowSelection="multiple"
                    rowData={matchingCandidates}
                    suppressRowClickSelection={true}
                    floatingFilter={true}
                    defaultColDef={{
                        filter: AG_GRID_COLUMN_FILTER.TEXT,
                        sort: true,
                    }}
                    columnTypes={{
                        dateColumn: {
                            filter: AG_GRID_COLUMN_FILTER.DATE,
                            filterParams: {
                                inRangeInclusive: true,
                            },
                        },
                    }}
                />
            </div>
            <div className="nexus-c-right-to-match-view__buttons">
                <ButtonGroup>
                    <Button
                        className="nexus-c-button"
                        onClick={() => history.push(URL.keepEmbedded(previousPageRoute))}
                    >
                        {CANCEL_BUTTON}
                    </Button>
                    <Button
                        className="nexus-c-button"
                        appearance="primary"
                        onClick={handleMatchClick}
                        isDisabled={isMatchDisabled}
                    >
                        {MATCH_BUTTON}
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

RightToMatchView.propTypes = {
    focusedRight: PropTypes.object,
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    fetchFocusedRight: PropTypes.func,
    createNewRight: PropTypes.func,
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
};

RightToMatchView.defaultProps = {
    focusedRight: null,
    fetchFocusedRight: null,
    createNewRight: null,
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

    return state => ({
        columnDefs: rightMatchingColumnDefsSelector(state),
        mapping: availsMappingSelector(state),
        focusedRight: focusedRightSelector(state),
        pendingRight: pendingRightSelector(state),
        mergeRights: state.avails.rightMatching.mergeRights,
    });
};

const mapDispatchToProps = dispatch => ({
    fetchFocusedRight: payload => dispatch(fetchAndStoreFocusedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    createNewRight: payload => dispatch(createNewRight(payload)),
    storeMatchedRights: payload => dispatch(storeMatchedRights(payload)),
});

export default compose(
    withToasts,
    // eslint-disable-next-line
    connect(createMapStateToProps, mapDispatchToProps)
)(RightToMatchView);
