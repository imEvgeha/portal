import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Link} from 'react-router-dom';
import Button, {ButtonGroup} from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import SectionMessage from '@atlaskit/section-message';
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
import DOP from '../../../util/DOP';
import useLocalStorage from '../../../util/hooks/useLocalStorage';
import {defineCheckboxSelectionColumn, defineActionButtonColumn} from '../../../ui-elements/nexus-grid/elements/columnDefinitions';
import NexusToastNotificationContext from '../../../ui-elements/nexus-toast-notification/NexusToastNotificationContext';
import {NEW_RIGHT_BUTTON_CLICK_MESSAGE} from '../../../ui-elements/nexus-toast-notification/constants';

const SECTION_MESSAGE = 'Select rights from the repository that match the focused right or declare it as a NEW right from the action menu above.';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling(getRightToMatchList)(NexusGrid));

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
    createNewRight
}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [isMatchDisabled, setIsMatchDisabled] = useState(true); // eslint-disable-line
    const [selectedRows, setSelectedRows] = useState([]);
    const {addToast, removeToast} = useContext(NexusToastNotificationContext);
    const {params = {}} = match;
    const {rightId, availHistoryIds} = params || {}; 
    const previousPageRoute = `/avails/history/${availHistoryIds}/right_matching`;
    const [showConfirmationFlag, setShowConfirmationFlag] = useState(false);
    const previousPageRoute = `/avails/history/${availHistoryIds}/right-matching`;
    const [dopCount] = useLocalStorage('rightMatchingDOP');

    // DOP Integration
    useEffect(() => {
        DOP.setErrorsCount(dopCount);
    }, [dopCount]);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [mapping, columnDefs]);

    useEffect(() => {
        fetchFocusedRight(rightId);
        fetchRightMatchingFieldSearchCriteria(availHistoryIds);
    }, [rightId]);

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn();
    const updatedColumnDefs = columnDefs.length ? [checkboxSelectionColumnDef, ...columnDefs] : columnDefs;

    const onDeclareNewRight = () => {
        removeToast();
        const {params: {rightId}} = match || {};
        createNewRight({rightId, addToast});
    };

    const onNewRightClick = () => {
        addToast({
            title: 'Warning',
            description: NEW_RIGHT_BUTTON_CLICK_MESSAGE,
            icon: 'warning',
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

    const actionNewButtonColumnDef = defineActionButtonColumn('buttons', createNewButtonCellRenderer);
    const updatedFocusedRightColumnDefs = columnDefs.length ? [actionNewButtonColumnDef, ...columnDefs] : columnDefs;
    const updatedFocusedRight = focusedRight && rightId === focusedRight.id ? [focusedRight] : [];

    const handleSelectionChange = api => {
        const selectedRows = api.getSelectedRows();
        setSelectedRows(selectedRows);
        setIsMatchDisabled(!selectedRows.length);
    };

    const handleMatchClick = () => {
        if (Array.isArray(selectedRows) && selectedRows.length) {
            const firstRow = selectedRows[0];
            history.push(URL.keepEmbedded(`${location.pathname}/match/${firstRow.id}`));
        }
    };

    return (
        <div className="nexus-c-right-to-match-view">
            <Link to={URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching`)} className="nexus-c-right-to-match-view__header" >
                <div className="nexus-c-right-to-match-view__header-content">
                    <ArrowLeftIcon size='xlarge' primaryColor={'#42526E'}/> 
                    <span className="nexus-c-right-to-match-view__header-title">Right to Right Matching</span>
                </div>
            </Link>
            <div className="nexus-c-right-to-match-view__table-header">
                <NexusTitle className="nexus-c-title--small">Focused Right</NexusTitle>
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
                <NexusTitle className="nexus-c-title--small">Rights Repository {`(${totalCount})`}</NexusTitle> 
                {fieldSearchCriteria && (
                    <NexusGridWithInfiniteScrolling
                        columnDefs={updatedColumnDefs}
                        setTotalCount={setTotalCount}
                        params={fieldSearchCriteria}
                        handleSelectionChange={handleSelectionChange}
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

