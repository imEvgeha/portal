import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup, LoadingButton} from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {
    defineColumn,
    updateColumnDefs,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {get, isEmpty} from 'lodash';
import moment from 'moment';
import {connect} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {backArrowColor} from '../../../../../packages/styles/constants';
import {NexusGrid, NexusTitle} from '../../../../ui/elements';
import {prepareRight} from '../../../legacy/containers/avail/service/RightsService';
import {AVAILS_PATH} from '../../availsRoutes';
import {addCellClass, createColumnSchema, createSchemaForColoring, HIGHLIGHTED_CELL_CLASS} from '../../utils';
import {SAVE_COMBINED_RIGHT} from '../rightMatchingActionTypes';
import {
    createRightMatchingColumnDefs,
    fetchAndStoreFocusedRight,
    fetchCombinedRight,
    saveCombinedRight,
    validateConflictingRights,
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
import {UNSELECTED_STATUSES, MIN_SELECTED_ROWS, FIELDS_WITHOUT_COLOURING, FIELDS_FOR_COLOURING} from './constants';
import './MatchRightsView.scss';

const CombinedRightNexusGrid = withColumnsResizing()(NexusGrid);
const MatchedRightsNexusGrid = withColumnsResizing()(NexusGrid);

const MatchRightView = ({
    focusedRight,
    combinedRight,
    fetchFocusedRight,
    fetchCombinedRight,
    saveCombinedRight,
    createRightMatchingColumnDefs,
    columnDefs,
    mapping,
    isMatching,
    pendingRight,
    mergeRights,
    rightsForMatching,
    validateRights,
}) => {
    const activeFocusedRight = mergeRights ? {...prepareRight(pendingRight), id: null} : focusedRight;
    const {availHistoryIds, rightId, matchedRightIds} = useParams();
    const navigate = useNavigate();

    const selectedMatchedRights = [activeFocusedRight, ...rightsForMatching];
    const [cellColoringSchema, setCellColoringSchema] = useState();
    const previousRoute = mergeRights
        ? `/avails/right-matching`
        : `/avails/history/${availHistoryIds}/right-matching/${rightId}`;

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

    // fetch combined right
    useEffect(() => {
        const schemas = createSchemaForColoring(selectedMatchedRights, columnDefs);
        setCellColoringSchema(schemas);
        const ids = selectedMatchedRights.filter(right => right.id).map(right => right.id);
        if (ids.length) {
            fetchCombinedRight({
                rights: mergeRights ? activeFocusedRight : null,
                rightIds: ids,
                mapping,
            });
        }
    }, [fetchCombinedRight, selectedMatchedRights.length]);

    // TODO:  we should handle this via router Link
    const onCancel = () => {
        navigate(URL.keepEmbedded(previousRoute));
    };

    const onSaveCombinedRight = () => {
        validateRights({
            rightId,
            tpr: get(activeFocusedRight, 'temporaryPriceReduction', false),
            rightData: prepareRight(pendingRight),
            selectedRights: rightsForMatching.map(right => right.id),
            callback: () => {
                const redirectPath = mergeRights ? AVAILS_PATH : `/avails/history/${availHistoryIds}/right-matching`;
                const payload = {
                    rightIds: selectedMatchedRights.filter(right => right.id).map(right => right.id),
                    combinedRight: [combinedRight, ...(mergeRights ? [activeFocusedRight] : [])],
                    redirectPath,
                };
                saveCombinedRight(payload);
            },
        });
    };

    const onMatchRightGridEvent = ({type, api}) => {
        const {FIRST_DATA_RENDERED} = GRID_EVENTS;
        if (type === FIRST_DATA_RENDERED) {
            api.selectAll();
        }
    };

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
        return '';
    };

    // Sorted by start field. desc
    const matchedRightRowData =
        selectedMatchedRights.sort(
            (a, b) => a && b && moment.utc(a.originallyReceivedAt).diff(moment.utc(b.originallyReceivedAt))
        ) || [];

    // checkboxes disabled
    // const checkboxSelectionColumnDef = defineCheckboxSelectionColumn();

    // TODO: refactor column defs
    const updatedMatchedRightColumnDefs = updateColumnDefs(columnDefs, {cellClass: applyColumnRule});
    const matchedRightColumnDefs =
        columnDefs.length && matchedRightRowData.length > 1 ? [...updatedMatchedRightColumnDefs] : columnDefs;

    const updatedCombinedColumnDefs = cellColoringSchema
        ? updateColumnDefs(columnDefs, {
              cellClass: ({colDef, context}) => {
                  const {field} = colDef || {};

                  if (FIELDS_FOR_COLOURING.includes(field)) {
                      if (colDef.colId === 'selected') return;

                      const {values} = context[field] || {};
                      const isCellHighlighted = values && Object.keys(values).length > 1;

                      return isCellHighlighted && HIGHLIGHTED_CELL_CLASS;
                  }
                  return '';
              },
          })
        : columnDefs;
    const combinedRightColumnDefs = columnDefs.length
        ? [defineColumn({width: 70}), ...updatedCombinedColumnDefs]
        : columnDefs;

    return (
        <div className="nexus-c-match-right-view">
            <NexusTitle>
                <Link to={URL.keepEmbedded(previousRoute)}>
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
                        onGridEvent={onMatchRightGridEvent}
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
                        rowData={!isEmpty(combinedRight) ? [combinedRight] : []}
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
                    <LoadingButton
                        className="nexus-c-button"
                        appearance="primary"
                        onClick={onSaveCombinedRight}
                        isDisabled={!combinedRight.id}
                        isLoading={isMatching}
                    >
                        {SAVE_BUTTON}
                    </LoadingButton>
                </ButtonGroup>
            </div>
        </div>
    );
};

MatchRightView.propTypes = {
    focusedRight: PropTypes.object,
    combinedRight: PropTypes.object,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    fetchFocusedRight: PropTypes.func,
    fetchCombinedRight: PropTypes.func,
    saveCombinedRight: PropTypes.func,
    createRightMatchingColumnDefs: PropTypes.func,
    isMatching: PropTypes.bool,
    pendingRight: PropTypes.object,
    mergeRights: PropTypes.bool,
    rightsForMatching: PropTypes.array,
    validateRights: PropTypes.func.isRequired,
};

MatchRightView.defaultProps = {
    focusedRight: {},
    combinedRight: {},
    columnDefs: [],
    mapping: null,
    fetchFocusedRight: null,
    fetchCombinedRight: null,
    saveCombinedRight: null,
    createRightMatchingColumnDefs: null,
    isMatching: false,
    pendingRight: null,
    mergeRights: false,
    rightsForMatching: [],
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const combinedRightSelector = selectors.createCombinedRightSelector();
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const rightMatchingMappingSelector = selectors.createAvailsMappingSelector();
    const loadingSelector = createLoadingSelector([SAVE_COMBINED_RIGHT]);
    const pendingRightSelector = selectors.createPendingRightSelector();
    const rightsForMatchingSelector = selectors.createRightsForMatchingSelector();

    return state => ({
        focusedRight: focusedRightSelector(state),
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
    fetchCombinedRight: payload => dispatch(fetchCombinedRight(payload)),
    saveCombinedRight: payload => dispatch(saveCombinedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    validateRights: payload => dispatch(validateConflictingRights(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(MatchRightView);
