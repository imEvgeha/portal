import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {isEmpty, isEqual} from 'lodash';
import moment from 'moment';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import {NexusGrid, NexusTitle} from '../../../../ui/elements';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import {
    defineCheckboxSelectionColumn,
    defineColumn,
    updateColumnDefs,
} from '../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withEditableColumns from '../../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import {createLoadingSelector} from '../../../../ui/loading/loadingSelectors';
import {URL} from '../../../../util/Common';
import usePrevious from '../../../../util/hooks/usePrevious';
import {backArrowColor} from '../../../legacy/constants/avails/constants';
import {prepareRight} from '../../../legacy/containers/avail/service/RightsService';
import {addCellClass, createColumnSchema, createSchemaForColoring, HIGHLIGHTED_CELL_CLASS} from '../../utils';
import {SAVE_COMBINED_RIGHT} from '../rightMatchingActionTypes';
import {
    createRightMatchingColumnDefs,
    fetchAndStoreFocusedRight,
    fetchCombinedRight,
    fetchMatchedRights,
    saveCombinedRight,
} from '../rightMatchingActions';
import {
    CANCEL_BUTTON,
    COMBINED_RIGHTS,
    MATCH_RIGHT_TITLE,
    MATCHED_RIGHTS,
    RIGHT_MATCHING_DOP_STORAGE,
    SAVE_BUTTON,
} from '../rightMatchingConstants';
import * as selectors from '../rightMatchingSelectors';
import useDOPIntegration from '../util/hooks/useDOPIntegration';
import './MatchRightsView.scss';

const UNSELECTED_STATUSES = ['Pending', 'Error'];
const MIN_SELECTED_ROWS = 2;
const FIELDS_WITHOUT_COLOURING = ['id', 'status'];

const CombinedRightNexusGrid = compose(withColumnsResizing(), withEditableColumns())(NexusGrid);
const MatchedRightsNexusGrid = withColumnsResizing()(NexusGrid);

const MatchRightView = ({
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
    isMatching,
    pendingRight,
    mergeRights,
    rightsForMatching,
}) => {
    const activeFocusedRight = mergeRights ? prepareRight(pendingRight) : focusedRight;
    if (!activeFocusedRight.id) {
        activeFocusedRight.id = null;
    }
    const [editedCombinedRight, setEditedCombinedRight] = useState();
    const {params} = match || {};
    const {availHistoryIds, rightId, matchedRightIds} = params || {};
    const [selectedMatchedRights, setSelectedMatchedRights] = useState([activeFocusedRight, ...rightsForMatching]);
    const [cellColoringSchema, setCellColoringSchema] = useState();
    const previousMatchedRights = usePrevious(selectedMatchedRights);
    const [combinedGridApi, setCombinedGridApi] = useState();

    // disable editing of columns
    const nonEditableMappings = mapping.map(mapping => ({...mapping, enableEdit: false}));

    // DOP Integration
    useDOPIntegration(null, RIGHT_MATCHING_DOP_STORAGE);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, createRightMatchingColumnDefs]);

    useEffect(() => {
        if (rightId && matchedRightIds && columnDefs.length) {
            if (!focusedRight || focusedRight.id !== rightId) {
                fetchFocusedRight(rightId);
            }
        }
    }, [matchedRightIds, rightId, columnDefs.length, focusedRight, fetchFocusedRight]);

    // fetch combined rights
    useEffect(() => {
        const schemas = createSchemaForColoring(selectedMatchedRights, columnDefs);
        setCellColoringSchema(schemas);
        const ids = selectedMatchedRights.filter(right => right.id).map(right => right.id);
        // fetchCombinedRight(selectedMatchedRights, ids, mapping);
        fetchCombinedRight({
            rights: activeFocusedRight,
            rightIds: ids,
            mapping,
        });
    }, [columnDefs, fetchCombinedRight, mapping, rightsForMatching]);

    useEffect(() => {
        if (combinedGridApi) {
            combinedGridApi.redrawRows();
        }
    }, [cellColoringSchema, combinedGridApi]);

    // TODO:  we should handle this via router Link
    const onCancel = () => {
        const {params} = match || {};
        const {rightId, availHistoryIds} = params || {};
        history.push(URL.keepEmbedded(`/avails/history/${availHistoryIds}/right-matching/${rightId}`));
    };

    // const onSaveCombinedRight = () => {
    //     const redirectPath = `/avails/history/${availHistoryIds}/right-matching`;
    //     const payload = {
    //         rightIds: selectedMatchedRightIds,
    //         combinedRight: editedCombinedRight || combinedRight,
    //         redirectPath,
    //     };
    //     saveCombinedRight(payload);
    // };

    const onCombinedRightGridEvent = ({type, api}) => {
        const {CELL_VALUE_CHANGED, READY} = GRID_EVENTS;
        const result = [];
        if (type === CELL_VALUE_CHANGED) {
            api.forEachNode(({data}) => result.push(data));
            setEditedCombinedRight(result[0]);
        } else if (type === READY) {
            setCombinedGridApi(api);
        }
    };

    // const onMatchRightGridEvent = ({type, api}) => {
    //     const {FIRST_DATA_RENDERED, SELECTION_CHANGED} = GRID_EVENTS;
    //     if (type === FIRST_DATA_RENDERED) {
    //         api.selectAll();
    //     } else if (type === SELECTION_CHANGED) {
    //         const selectedRows = api.getSelectedRows() || [];
    //         const selectedIds = selectedRows.map(el => el.id);
    //         if (!isEqual(selectedIds, selectedMatchedRightIds)) {
    //             setSelectedMatchedRightIds(selectedIds);
    //         }
    //         // TODO: it would be better to apply via refreshCell, but it isn't working
    //         api.redrawRows();
    //     }
    // };

    const getSelectedRows = api => {
        return api.getSelectedRows() || [];
    };

    // rule for row (disable unselect, add strike through line)
    const applyRowRule = ({node, data, api}) => {
        const selectedIds = getSelectedRows(api).map(el => el.id);
        if (node.selected) {
            let rowClass = '';
            if (
                UNSELECTED_STATUSES.includes(data.status) &&
                selectedIds[selectedIds.length - 1] !== data.id &&
                selectedIds[0] !== data.id
            ) {
                rowClass = `${rowClass} nexus-c-nexus-grid__unselected`;
            }

            if (selectedIds.length <= MIN_SELECTED_ROWS) {
                rowClass = `${rowClass} nexus-c-nexus-grid__selected--disabled`;
            }

            return rowClass;
        }
    };

    const applyColumnRule = ({data, colDef, api, value}) => {
        const selectedIds = getSelectedRows(api).map(el => el.id);
        if (
            selectedIds.includes(data.id) &&
            !FIELDS_WITHOUT_COLOURING.includes(colDef.field) &&
            !(
                UNSELECTED_STATUSES.includes(data.status) &&
                selectedIds[selectedIds.length - 1] !== data.id &&
                selectedIds[0] !== data.id
            )
        ) {
            const schema = createColumnSchema(getSelectedRows(api), colDef.field);
            return addCellClass({field: colDef.field, value, schema});
        }
    };

    // Sorted by start field. desc
    const matchedRightRowData =
        selectedMatchedRights.sort(
            (a, b) => a && b && moment.utc(a.originallyReceivedAt).diff(moment.utc(b.originallyReceivedAt))
        ) || [];
    const checkboxSelectionColumnDef = defineCheckboxSelectionColumn();

    // TODO: refactor column defs
    const updatedMatchedRightColumnDefs = updateColumnDefs(columnDefs, {cellClass: applyColumnRule});
    const matchedRightColumnDefs =
        columnDefs.length && matchedRightRowData.length > 1
            ? [checkboxSelectionColumnDef, ...updatedMatchedRightColumnDefs]
            : columnDefs;

    const updatedCombinedColumnDefs = cellColoringSchema
        ? updateColumnDefs(columnDefs, {
              cellClass: ({colDef, context}) => {
                  const {field} = colDef || {};

                  if (!FIELDS_WITHOUT_COLOURING.includes(field)) {
                      const {values} = context[field] || {};
                      const isCellHighlighted = values && Object.keys(values).length > 1;

                      return isCellHighlighted && HIGHLIGHTED_CELL_CLASS;
                  }
              },
          })
        : columnDefs;
    const combinedRightColumnDefs = columnDefs.length
        ? [defineColumn({width: 70}), ...updatedCombinedColumnDefs]
        : columnDefs;

    return (
        <div className="nexus-c-match-right-view">
            <NexusTitle>
                <Link to={URL.keepEmbedded(`/avails/history/${availHistoryIds}/right-matching/${rightId}`)}>
                    <ArrowLeftIcon size="large" primaryColor={backArrowColor} />
                </Link>
                <span>{MATCH_RIGHT_TITLE}</span>
            </NexusTitle>
            <div className="nexus-c-match-right-view__matched">
                <NexusTitle isSubTitle>{MATCHED_RIGHTS}</NexusTitle>
                {!!columnDefs && (
                    <MatchedRightsNexusGrid
                        id="matchedRightsRepo"
                        columnDefs={matchedRightColumnDefs}
                        rowData={matchedRightRowData}
                        domLayout="autoHeight"
                        rowSelection="multiple"
                        suppressRowClickSelection={true}
                        onGridEvent={/* onMatchRightGridEvent */ null}
                        getRowClass={applyRowRule}
                    />
                )}
            </div>
            <div className="nexus-c-match-right-view__combined">
                <NexusTitle isSubTitle>{COMBINED_RIGHTS}</NexusTitle>
                {!!columnDefs && (
                    <CombinedRightNexusGrid
                        id="combinedRightRepo"
                        columnDefs={combinedRightColumnDefs}
                        rowData={
                            !isEmpty(combinedRight) && matchedRights.length === matchedRightIds.split(',').length
                                ? [combinedRight]
                                : []
                        }
                        onGridEvent={onCombinedRightGridEvent}
                        mapping={nonEditableMappings}
                        domLayout="autoHeight"
                        context={cellColoringSchema}
                    />
                )}
            </div>
            <div className="nexus-c-match-right-view__buttons">
                <ButtonGroup>
                    <Button onClick={onCancel} className="nexus-c-button">
                        {CANCEL_BUTTON}
                    </Button>
                    <Button
                        className="nexus-c-button"
                        appearance="primary"
                        // onClick={onSaveCombinedRight}
                        isDisabled={!focusedRight.id || matchedRights.length === 0 || !combinedRight.id}
                        isLoading={isMatching}
                    >
                        {SAVE_BUTTON}
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

MatchRightView.propTypes = {
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
    isMatching: PropTypes.bool,
    history: PropTypes.object,
    match: PropTypes.object,
    pendingRight: PropTypes.object,
    // eslint-disable-next-line react/boolean-prop-naming
    mergeRights: PropTypes.bool,
    rightsForMatching: PropTypes.array,
};

MatchRightView.defaultProps = {
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
    isMatching: false,
    history: {push: () => null},
    match: {},
    pendingRight: null,
    mergeRights: false,
    rightsForMatching: [],
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const matchedRightsSelector = selectors.createMatchedRightsSelector();
    const combinedRightSelector = selectors.createCombinedRightSelector();
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const rightMatchingMappingSelector = selectors.createAvailsMappingSelector();
    const loadingSelector = createLoadingSelector([SAVE_COMBINED_RIGHT]);
    const pendingRightSelector = selectors.createPendingRightSelector();
    const rightsForMatchingSelector = selectors.createRightsForMatchingSelector();

    return state => ({
        focusedRight: focusedRightSelector(state),
        matchedRights: matchedRightsSelector(state),
        combinedRight: combinedRightSelector(state),
        columnDefs: rightMatchingColumnDefsSelector(state),
        mapping: rightMatchingMappingSelector(state),
        isMatching: loadingSelector(state),
        pendingRight: pendingRightSelector(state),
        mergeRights: state.avails.rightMatching.mergeRights,
        rightsForMatching: rightsForMatchingSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchFocusedRight: payload => dispatch(fetchAndStoreFocusedRight(payload)),
    fetchMatchedRight: payload => dispatch(fetchMatchedRights(payload)),
    fetchCombinedRight: payload => dispatch(fetchCombinedRight(payload)),
    saveCombinedRight: payload => dispatch(saveCombinedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(MatchRightView);
