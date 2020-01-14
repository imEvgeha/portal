import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Link} from 'react-router-dom';
import Button, {ButtonGroup} from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import SectionMessage from '@atlaskit/section-message';
import EditorMediaWrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import ReactTooltip from 'react-tooltip';
import './RightToMatchView.scss';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import {createRightMatchingColumnDefs, createNewRight, fetchRightMatchingFieldSearchCriteria, fetchAndStoreFocusedRight} from '../rightMatchingActions';
import * as selectors from '../rightMatchingSelectors';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import CustomActionsCellRenderer from '../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {getRightToMatchList} from '../rightMatchingService';
import RightToMatchNavigation from './components/navigation/RightToMatchNavigation';
import {URL} from '../../../util/Common';
import {
    defineCheckboxSelectionColumn,
    defineActionButtonColumn,
    defineButtonColumn
} from '../../../ui-elements/nexus-grid/elements/columnDefinitions';
import NexusToastNotificationContext from '../../../ui-elements/nexus-toast-notification/NexusToastNotificationContext';
import {NEW_RIGHT_BUTTON_CLICK_MESSAGE, WARNING_TITLE, WARNING_ICON} from '../../../ui-elements/nexus-toast-notification/constants';
import {backArrowColor} from '../../../constants/avails/constants';
import useDOPIntegration from '../util/hooks/useDOPIntegration';
import withSideBar from '../../../ui-elements/nexus-grid/hoc/withSideBar';
import withFilterableColumns from '../../../ui-elements/nexus-grid/hoc/withFilterableColumns';

const SECTION_MESSAGE = 'Select rights from the repository that match the focused right or declare it as a NEW right from the action menu above.';

const RightRepositoryNexusGrid = compose(
    withFilterableColumns(),
    withSideBar(),
    withInfiniteScrolling({fetchData: getRightToMatchList})
)(NexusGrid);

const RightToMatchView = ({
    match,
    columnDefs,
    mapping,
    createRightMatchingColumnDefs,
    fetchRightMatchingFieldSearchCriteria,
    fetchFocusedRight,
    fieldSearchCriteria,
    focusedRight,
    history,
    location,
    createNewRight,
}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [isMatchDisabled, setIsMatchDisabled] = useState(true); // eslint-disable-line
    const [selectedRows, setSelectedRows] = useState([]);
    const {addToast, removeToast} = useContext(NexusToastNotificationContext);
    const {params = {}} = match;
    const {rightId, availHistoryIds} = params || {}; 
    const previousPageRoute = `/avails/history/${availHistoryIds}/right-matching`;

    // DOP Integration
    useDOPIntegration(null, 'rightMatchingDOP');

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs]);

    useEffect(() => {
        fetchFocusedRight(rightId);
        if (!fieldSearchCriteria || (rightId !== fieldSearchCriteria.id)) {
            fetchRightMatchingFieldSearchCriteria(availHistoryIds);
        }
    }, [rightId]);

    const getMatchingButtonTooltipContent = ({id}) => {
        return <div>
            Title <br/>No matching title <br/><a href={`/avails/history/${id}/right-matching`}><b>FIND MATCH</b></a>
        </div>;
    };

    const createMatchingButtonCellRenderer = ({data}) => { // eslint-disable-line
        const {id, coreTitleId} = data || {};
        const notificationEnd = coreTitleId !== null ? '' : '--error';
        return (
            <CustomActionsCellRenderer id={id}>
                <div data-tip>
                    <EditorMediaWrapLeftIcon />
                    <span className={'nexus-c-right-to-match-view__buttons_notification' + notificationEnd}/>
                </div>
                <ReactTooltip
                    className='nexus-c-right-to-match-view__tooltip'
                    delayHide={300}
                    delayShow={200}
                    delayUpdate={300}
                    place='top'
                    multiline={true}
                    border={true}
                    type={'light'}
                    effect='solid'
                > {getMatchingButtonTooltipContent({id})} </ReactTooltip>
            </CustomActionsCellRenderer>
        );
    };

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn({headerName: 'Actions'});
    const actionMatchingButtonColumnDef = defineButtonColumn({cellRendererFramework: createMatchingButtonCellRenderer, cellClass: 'custom-cell'});
    const updatedColumnDefs = columnDefs.length ? [checkboxSelectionColumnDef, actionMatchingButtonColumnDef, ...columnDefs] : columnDefs;

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
                {content:'Cancel', onClick: removeToast},
                {content:'OK', onClick: onDeclareNewRight}
            ],
            isWithOverlay: true,
        });
    };

    const createNewButtonCellRenderer = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button onClick={onNewRightClick}>New</Button>
            </CustomActionsCellRenderer>
        );
    };

    const actionNewButtonColumnDef = defineActionButtonColumn({field: 'buttons', cellRendererFramework: createNewButtonCellRenderer});
    const updatedFocusedRightColumnDefs = columnDefs.length ? [actionNewButtonColumnDef, ...columnDefs] : columnDefs;
    const updatedFocusedRight = focusedRight && rightId === focusedRight.id ? [focusedRight] : [];

    const handleSelectionChange = api => {
        const selectedRows = api.getSelectedRows();
        setSelectedRows(selectedRows);
        setIsMatchDisabled(!selectedRows.length);
    };

    const handleMatchClick = () => {
        if (Array.isArray(selectedRows) && selectedRows.length > 0) {
            const matchedRightIds = selectedRows.map(el => el.id).join();
            history.push(URL.keepEmbedded(`${location.pathname}/match/${matchedRightIds}`));
        }
    };

    // temporary solution - when we enable date, datetime filter this
    // and params from RightRepoNexusGrid could be removed
    const rightRepoParams = fieldSearchCriteria && Object.keys(fieldSearchCriteria.params).reduce((result, key) => {
        const ENABLED_KEYS = ['startTo', 'startFrom', 'endTo', 'endFrom'];
        if (ENABLED_KEYS.includes(key)) {
            result[key] = fieldSearchCriteria.params[key];
        }

        return result;
    }, {});

    return (
        <div className="nexus-c-right-to-match-view">
            <NexusTitle>
                <Link to={URL.keepEmbedded(previousPageRoute)}>
                    <ArrowLeftIcon size='large' primaryColor={backArrowColor}/>
                </Link>
                <span>Right to Right Matching</span>
            </NexusTitle>
            <div className="nexus-c-right-to-match-view__table-header">
                <NexusTitle isSubTitle isInline>Focused Right</NexusTitle>
                <RightToMatchNavigation
                    searchParams={{availHistoryIds}}
                    focusedRightId={rightId}
                    focusedRight={focusedRight}
                    availHistoryIds={availHistoryIds}
                    history={history}
                />
            </div>
            <div className="nexus-c-right-to-match-view__focused-right">
                <NexusGrid
                    columnDefs={updatedFocusedRightColumnDefs}
                    rowData={updatedFocusedRight}
                    domLayout="autoHeight"
                />
            </div>
            <SectionMessage appearance='info'>
                <p className="nexus-c-right-to-match-view__section-message">{SECTION_MESSAGE}</p>
            </SectionMessage>
            <div className="nexus-c-right-to-match-view__rights-to-match">
                <NexusTitle isSubTitle>Rights Repository {`(${totalCount})`}</NexusTitle> 
                {fieldSearchCriteria 
                    && fieldSearchCriteria.id === rightId 
                    && (
                        <RightRepositoryNexusGrid
                            columnDefs={updatedColumnDefs}
                            mapping={mapping}
                            setTotalCount={setTotalCount}
                            params={rightRepoParams}
                            initialFilter={fieldSearchCriteria.params}
                            handleSelectionChange={handleSelectionChange}
                            rowSelection="multiple"
                            suppressRowClickSelection={true}
                            suppressRowTransform={true}
                        />
                )}
            </div>
            <div className="nexus-c-right-to-match-view__buttons">
                <ButtonGroup>
                    <Button 
                        className="nexus-c-button"
                        onClick={() => history.push(URL.keepEmbedded(previousPageRoute))}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="nexus-c-button"
                        appearance="primary"
                        onClick={handleMatchClick}
                        isDisabled={isMatchDisabled}
                    >
                        Match
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

RightToMatchView.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    fieldSearchCriteria: PropTypes.object,
    focusedRight: PropTypes.object,
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    fetchRightMatchingFieldSearchCriteria: PropTypes.func,
    fetchFocusedRight: PropTypes.func,
    createNewRight: PropTypes.func,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
};

RightToMatchView.defaultProps = {
    match: {},
    history: null,
    location: {},
    fieldSearchCriteria: null,
    focusedRight: null,
    fetchRightMatchingFieldSearchCriteria: null,
    fetchFocusedRight: null,
    createNewRight: null,
    columnDefs: [],
    mapping: [],
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();
    const fieldSearchCriteriaSelector = selectors.createFieldSearchCriteriaSelector();
    const focusedRightSelector = selectors.createFocusedRightSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        fieldSearchCriteria: fieldSearchCriteriaSelector(state, props),
        focusedRight: focusedRightSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchRightMatchingFieldSearchCriteria: payload => dispatch(fetchRightMatchingFieldSearchCriteria(payload)),
    fetchFocusedRight: payload => dispatch(fetchAndStoreFocusedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    createNewRight: payload => dispatch(createNewRight(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatchView); // eslint-disable-line

