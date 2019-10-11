import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import Flag, {FlagGroup} from '@atlaskit/flag';
import Warning from '@atlaskit/icon/glyph/warning';
import {colors} from '@atlaskit/theme';

import './RightToMatchView.scss';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import {createRightMatchingColumnDefs, fetchFocusedRight, createNewRight} from '../rightMatchingActions';
import * as selectors from '../rightMatchingSelectors';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import CustomActionsCellRenderer
    from '../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import RightToMatchNavigation from './navigation/RightToMatchNavigation';
import {URL} from '../../../util/Common';
import BackNavigationByUrl from '../../../ui-elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';

const RightToMatch = ({match, createRightMatchingColumnDefs, fetchFocusedRight, focusedRight, columnDefs, mapping, history, createNewRight}) => {
    const [showConfirmationFlag, setShowConfirmationFlag] = useState(false);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs(mapping);
        }
    }, [columnDefs, mapping]);

    useEffect(() => {
        if (match && match.params.rightId && match.params.rightId !== focusedRight.id) {
            fetchFocusedRight(match.params.rightId);
        }
    }, [match.params.rightId]);

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

    const navigateToRightMatch = () => {
        const indexToRemove = location.pathname.lastIndexOf('/');
        history.push(URL.keepEmbedded(`${location.pathname.substr(0, indexToRemove)}`));
    };

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
    const updatedFocusedRight = match.params.rightId === focusedRight.id ? [focusedRight] : [{}];

    return (
        <div className="nexus-c-right-to-match">
            <BackNavigationByUrl
                title={'Right to Right Matching'}
                onNavigationClick={navigateToRightMatch}
            />
            <div className="nexus-c-right-to-match-table-header">
                <NexusTitle>Focused Right</NexusTitle>
                <RightToMatchNavigation
                    searchParams={{availHistoryIds: match.params.availHistoryIds}}
                    history={history}
                    focusedRightId={match.params.rightId}
                />
            </div>
            <NexusGrid
                columnDefs={updatedFocusedRightColumnDefs}
                rowData={updatedFocusedRight}
            />
            <SectionMessage>
                <p>Select rights from the repository that match the focused right or declare it as a NEW right from the
                    action menu above. </p>
            </SectionMessage>
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

RightToMatch.propTypes = {
    fetchFocusedRight: PropTypes.func.isRequired,
    match: PropTypes.object,
    focusedRight: PropTypes.object,
    mapping: PropTypes.array,
    history: PropTypes.object,
    columnDefs: PropTypes.array,
    createRightMatchingColumnDefs: PropTypes.func,
    createNewRight: PropTypes.func
};

RightToMatch.defaultProps = {
    focusedRight: {},
    mapping: [],
    columnDefs: [],
};

const createMapStateToProps = () => {
    const focusedRightSelector = selectors.createFocusedRightSelector();
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
        focusedRight: focusedRightSelector(state, props)
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
    createNewRight: payload => dispatch(createNewRight(payload))
});

export default connect(createMapStateToProps, mapDispatchToProps)(RightToMatch); // eslint-disable-line

