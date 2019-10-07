import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Link} from 'react-router-dom';
import Button, {ButtonGroup} from '@atlaskit/button';
import './RightToMatchView.scss';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import * as selectors from '../rightMatchingSelectors';
import {createRightMatchingColumnDefs, fetchRightMatchingFieldSearchCriteria, fetchAndStoreFocusedRight} from '../rightMatchingActions';
import {getRightMatchingList} from '../rightMatchingService';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling(getRightMatchingList)(NexusGrid));

const RightToMatchView = ({
    match, 
    columnDefs, 
    mapping, 
    createRightMatchingColumnDefs, 
    fetchRightMatchingFieldSearchCriteria, 
    fetchFocusedRight,
    fieldSearchCriteria,
    focusedRight,
}) => {
    const [totalCount, setTotalCount] = useState(0);
    const {params = {}} = match;
    const {rightId, availHistoryIds} = params || {}; 
    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [mapping, columnDefs]);
    useEffect(() => {
        fetchFocusedRight(rightId);
        fetchRightMatchingFieldSearchCriteria(availHistoryIds);
    }, [rightId]);

    const getParams = (right, searchCriteria) => {
        const params = right && searchCriteria && Object.keys(right).reduce((object, prop) => {
            if (searchCriteria.some(el => el.fieldName.toLowerCase() === prop)) {
                object[prop] = right[prop]; 
            }
            return object;
        }, {});
        return params;
    };

    const queryString = Array.isArray(fieldSearchCriteria) && fieldSearchCriteria.length > 0 && getParams(focusedRight, fieldSearchCriteria);

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

    return (
        <div className="nexus-c-right-to-match-view">
            <NexusTitle><Link to={`/avails/history/${availHistoryIds}/right_matching`}>Right Matching</Link></NexusTitle> 
            <div className="nexus-c-right-to-match-view__focused-right" />
            <div className="nexus-c-right-to-match-view__avails-table">
                <NexusTitle className="nexus-c-title--small">Rights Repository {`(${totalCount})`}</NexusTitle> 
                {queryString ? (
                    <NexusGridWithInfiniteScrolling
                        columnDefs={updatedColumnDefs}
                        params={queryString}
                        setTotalCount={setTotalCount}
                    />
                ) : null}
            </div>
            <div className="nexus-c-right-to-match-view__buttons">
                <ButtonGroup>
                    <Button className="nexus-c-button">Cancel</Button>
                    <Button className="nexus-c-button" appearance="primary">Match</Button>
                </ButtonGroup> 
            </div>
        </div>
    );
};

RightToMatchView.propTypes = {
    createRightMatchingColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    mapping: PropTypes.array,
    history: PropTypes.object,
    match: PropTypes.object,
    fieldSearchCriteria: PropTypes.array,
    fetchRightMatchingFieldSearchCriteria: PropTypes.func,
    fetchFocusedRight: PropTypes.func,
    focusedRight: PropTypes.object,
};

RightToMatchView.defaultProps = {
    columnDefs: [],
    mapping: [],
    match: {},
    fieldSearchCriteria: null,
    fetchRightMatchingFieldSearchCriteria: null,
    fetchFocusedRight: null,
    focusedRight: null,
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
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatchView); // eslint-disable-line


