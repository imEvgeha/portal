import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
import {Link} from 'react-router-dom';
import isEqual from 'lodash.isequal';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button, {ButtonGroup} from '@atlaskit/button';
import './MatchRightsView.scss';
import * as selectors from '../rightMatchingSelectors';
import {
    createRightMatchingColumnDefs,
    fetchAndStoreFocusedRight,
    fetchCombinedRight,
    fetchMatchedRights,
    saveCombinedRight,
} from '../rightMatchingActions';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import {URL, isObjectEmpty} from '../../../util/Common';
import withEditableColumns from '../../../ui-elements/nexus-grid/hoc/withEditableColumns';
import {backArrowColor} from '../../../constants/avails/constants';
import useDOPIntegration from '../util/hooks/useDOPIntegration';
import {defineCheckboxSelectionColumn} from '../../../ui-elements/nexus-grid/elements/columnDefinitions';
import usePrevious from '../../../util/hooks/usePrevious';

const EditableNexusGrid = withEditableColumns()(NexusGrid);

function MatchRightView({
    history,
    match,
    focusedRight,
    matchedRights,
    combinedRight,
    fetchFocusedRight,
    fetchMatchedRight,
    fetchCombinedRight,
    saveCombinedRight,
    createRightMatchingColumnDefs, 
    columnDefs, 
    mapping,
}) {
    const [saveButtonDisabled, setSaveButtonDisabled] =  useState(false);
    const [editedCombinedRight, setEditedCombinedRight] = useState();
    const previousMatchedRights = usePrevious(matchedRights);
    const {params} = match || {};
    const {availHistoryIds, rightId, matchedRightIds} = params || {};
    const [matchedRightList, setMatchedRightList] = useState(matchedRightIds.split(','));

    // DOP Integration
    useDOPIntegration(null, 'rightMatchingDOP');

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs]);

    useEffect(() => {
        if (rightId && matchedRightIds && columnDefs.length) {
            if (!focusedRight || (focusedRight.id !== rightId)) {
                fetchFocusedRight(rightId);
            }
            fetchMatchedRight(matchedRightList);
        }
    },[matchedRightIds, rightId, columnDefs.length]);

    // fetch combined rights
    useEffect(() => {
        if (!isEqual(previousMatchedRights, matchedRights) || matchedRightList) {
            // matchedRightId from url should be correct one.
            fetchCombinedRight([rightId, ...matchedRightList]);
        }
    }, [matchedRightIds, rightId, matchedRights, matchedRightList]);

    useEffect(() => {
        if (combinedRight) {
            setSaveButtonDisabled(false);
        }
    }, [combinedRight]);

    // TODO:  we should handle this via router Link
    const onCancel = () => {
        const {params} = match || {};
        const {rightId, availHistoryIds} = params || {};
        history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right-matching/${rightId}`));
    };

    const onSaveCombinedRight = () => {
        const {params} = match || {};
        const {rightId, matchedRightIds} = params || {};
        const redirectPath = `/avails/history/${availHistoryIds}/right-matching`;
        setSaveButtonDisabled(true);
        const payload = {
            rightIds: [rightId, ...matchedRightIds.split(',')],
            combinedRight,
            redirectPath,
        };
        // TODO: fix this
        if (editedCombinedRight) {
            saveCombinedRight({...payload, combinedRight: editedCombinedRight});
            return;
        }
        saveCombinedRight(payload);
    };

    // Sorted by start field. desc
    const matchedRightRowData = [focusedRight, ...matchedRights].sort((a,b) => a && b && moment.utc(b.originallyReceivedAt).diff(moment.utc(a.originallyReceivedAt)));

    const handleGridEvent = ({type, api}) => {
        let result = [];
        // TODO: add all grid event to constant
        if (type === 'cellValueChanged') {
            api.forEachNode(({data}) => result.push(data));
            setEditedCombinedRight(result[0]);
        }
    };

    const onMatchRightGridEvent = ({type, api}) => {
        if (type === 'firstDataRendered') {
            api.selectAll();
        } else if (type === 'selectionChanged') {
            const selectedRows = api.getSelectedRows();
             if (selectedRows.length && (selectedRows.length !== matchedRightList.length + 1)) {
                 setMatchedRightList(selectedRows.map(el => el.id));
             }
        }
    };

    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn();
    const matchedRightColumnDefs = columnDefs.length  && matchedRightRowData.length > 1 ? [checkboxSelectionColumnDef, ...columnDefs] : columnDefs;

    return (
        <div className="nexus-c-match-right-view">
            <NexusTitle>
                <Link to={URL.keepEmbedded(`/avails/history/${availHistoryIds}/right-matching/${rightId}`)}>
                    <ArrowLeftIcon size='large' primaryColor={backArrowColor}/> 
                </Link>
                <span>Right Matching Preview</span>
            </NexusTitle>
            <div className="nexus-c-match-right-view__matched">
                <NexusTitle isSubTitle>Matched Rights</NexusTitle>
                {!!columnDefs && (
                    <NexusGrid
                        columnDefs={matchedRightColumnDefs}
                        rowData={matchedRightIds.split(',').length === matchedRights.length ?  matchedRightRowData : []}
                        domLayout="autoHeight"
                        rowSelection="multiple"
                        suppressRowClickSelection={true}
                        onGridEvent={onMatchRightGridEvent}
                    />
                )}
            </div>
            <div className="nexus-c-match-right-view__combined">
                <NexusTitle isSubTitle>Combined Rights</NexusTitle>
                {!!columnDefs && (
                    <EditableNexusGrid
                        columnDefs={columnDefs}
                        rowData={isObjectEmpty(combinedRight) ? [] : [combinedRight]}
                        onGridEvent={handleGridEvent}
                        mapping={mapping}
                        domLayout="autoHeight"
                    />
                )}
            </div>
            <div className="nexus-c-match-right-view__buttons">
                <ButtonGroup>
                    <Button 
                        onClick={onCancel}
                        className="nexus-c-button"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="nexus-c-button"
                        appearance="primary"
                        onClick={onSaveCombinedRight}
                        isDisabled={saveButtonDisabled || !focusedRight.id || matchedRights.length === 0 || !combinedRight.id}
                    >
                        Save
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}

MatchRightView.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    focusedRight: PropTypes.object,
    matchedRights: PropTypes.array,
    combinedRight: PropTypes.object,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    fetchFocusedRight: PropTypes.func,
    fetchMatchedRight: PropTypes.func,
    fetchCombinedRight: PropTypes.func,
    saveCombinedRight: PropTypes.func,
    createRightMatchingColumnDefs: PropTypes.func,
};

MatchRightView.defaultProps = {
    history: null,
    match: null,
    focusedRight: null,
    matchedRights: [],
    combinedRight: null,
    columnDefs: [],
    mapping: null,
    fetchFocusedRight: null,
    fetchMatchedRight: null,
    fetchCombinedRight: null,
    saveCombinedRight: null,
    createRightMatchingColumnDefs: null,
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const matchedRightsSelector = selectors.createMatchedRightsSelector();
    const combinedRightSelector = selectors.createCombinedRightSelector();
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const rightMatchingMappingSelector = selectors.createAvailsMappingSelector();

    return (state, props) => ({
        focusedRight: focusedRightSelector(state, props),
        matchedRights: matchedRightsSelector(state, props),
        combinedRight: combinedRightSelector(state, props),
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: rightMatchingMappingSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchAndStoreFocusedRight(payload)),
    fetchMatchedRight: payload => dispatch(fetchMatchedRights(payload)),
    fetchCombinedRight: (focusedRightId, matchedRightIds) => dispatch(fetchCombinedRight(focusedRightId, matchedRightIds)),
    saveCombinedRight: payload => dispatch(saveCombinedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(MatchRightView); // eslint-disable-line
