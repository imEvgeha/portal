import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Link} from 'react-router-dom';
import Button from '@atlaskit/button';
import PageHeader from '@atlaskit/page-header';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import SectionMessage from '@atlaskit/section-message';
import Flag, {FlagGroup} from '@atlaskit/flag';
import Warning from '@atlaskit/icon/glyph/warning';
import {colors} from '@atlaskit/theme';

import './RightToMatchView.scss';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import {createRightMatchingColumnDefs, createNewRight, fetchRightMatchingFieldSearchCriteria, fetchAndStoreFocusedRight} from '../rightMatchingActions';
import * as selectors from '../rightMatchingSelectors';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import CustomActionsCellRenderer from '../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {getRightToMatchList} from '../rightMatchingService';
import {URL} from '../../../util/Common';
import RightToMatchNavigation from './components/navigation/RightToMatchNavigation';
import BottomButtons from '../components/bottom-buttons/BottomButons';

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
    const {params = {}} = match;
    const {rightId, availHistoryIds} = params || {}; 
    const [showConfirmationFlag, setShowConfirmationFlag] = useState(false);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [mapping, columnDefs]);

    useEffect(() => {
        fetchFocusedRight(rightId);
        fetchRightMatchingFieldSearchCriteria(availHistoryIds);
    }, [rightId]);

    const additionalColumnDef = {
        field: 'checkbox',
        headerName: 'Action',
        colId: 'action',
        width: 70,
        pinned: 'left',
        resizable: false,
        suppressSizeToFit: true,
        suppressMovable: true,
        lockPosition: true,
        sortable: false,
        checkboxSelection: true,
    };
    const updatedColumnDefs = columnDefs.length ? [additionalColumnDef, ...columnDefs] : columnDefs;

    const onNewButtonClick = () => {
        setShowConfirmationFlag(true);
    };

    const onDeclareNewRight = () => {
        setShowConfirmationFlag(false);     
        const {params: {rightId}} = match || {};
        createNewRight(rightId);
    };

    const onCancelNewRight = () => {
        setShowConfirmationFlag(false);
    };
    
    const createNewButtonCellRenderer = ({data}) => ( // eslint-disable-line
        <CustomActionsCellRenderer id={data && data.id}>
            <Button onClick={() => onNewButtonClick()}>New</Button>
        </CustomActionsCellRenderer>
    );

    const additionalFocusedRightColumnDef = {
        field: 'buttons',
        headerName: 'Actions',
        colId: 'actions',
        width: 100,
        pinned: 'left',
        resizable: false,
        suppressSizeToFit: true,
        cellRendererFramework: createNewButtonCellRenderer,
        suppressMovable: true,
        lockPosition: true,
        sortable: false,
    };
    const updatedFocusedRightColumnDefs = columnDefs.length ? [additionalFocusedRightColumnDef, ...columnDefs] : columnDefs;
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
            <div className='nexus-c-right-to-match-view__navigation-arrow'>
                <PageHeader>
                    <Link to={URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching`)} className="nexus-c-right-to-match-view__link" >
                        <ArrowLeftIcon size='large'/> 
                        Right to Right Matching
                    </Link>
                </PageHeader>
            </div>
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
            <SectionMessage>
                <p>{SECTION_MESSAGE}</p>
            </SectionMessage>
            <div className="nexus-c-right-to-match-view__rights-to-match">
                <NexusTitle className="nexus-c-title--small">Rights Repository {`(${totalCount})`}</NexusTitle> 
                {fieldSearchCriteria ? (
                    <NexusGridWithInfiniteScrolling
                        columnDefs={updatedColumnDefs}
                        setTotalCount={setTotalCount}
                        params={{fieldSearchCriteria}}
                        handleSelectionChange={handleSelectionChange}
                    />
                ) : null}
            </div>

            <BottomButtons buttons={[
                {
                    name: 'Cancel',
                    onClick: () => history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right_matching`)),
                },
                {
                    name: 'Match',
                    onClick: handleMatchClick,
                    isDisabled: isMatchDisabled,
                    appearance: 'primary'
                }
            ]}/>
            {showConfirmationFlag && (
                <FlagGroup onDismissed={() => onCancelNewRight()}>
                    <Flag
                        description="You are about to declare a new right."
                        icon={<Warning label="Warning icon" primaryColor={colors.Y300} />}
                        id="warning-flag"
                        title="Warning"
                        actions={[
                            {content:'Cancel', onClick: () => onCancelNewRight()},
                            {content:'OK', onClick: () => onDeclareNewRight()}
                        ]}
                    />
                </FlagGroup>
            )}
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
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    createNewRight: PropTypes.func
};

RightToMatchView.defaultProps = {
    match: {},
    history: null,
    location: {},
    fieldSearchCriteria: null,
    focusedRight: null,
    fetchRightMatchingFieldSearchCriteria: null,
    fetchFocusedRight: null,
    columnDefs: [],
    mapping: [],
    createNewRight: null
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

