import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button';
import './LegacyTitleReconciliationView.scss';
import {NexusTitle, NexusGrid} from '../../ui-elements/';
import {TITLE, SECTION_MESSAGE, FOCUSED_TITLE, SAVE_BTN} from './constants';
import {fetchTitle} from '../metadataActions';
import {createColumnDefs} from '../../avails/title-matching/titleMatchingActions';
import * as selectors from '../metadataSelectors';
import {getColumnDefs} from '../../avails/title-matching/titleMatchingSelectors';
import {getColumnDefsWithCleanContentType} from '../../ui-elements/nexus-grid/elements/columnDefinitions';
import CandidatesList from './components/CandidatesList';

const LegacyTitleReconciliationView = ({
    titleMetadata,
    getColumnDefs,
    match,
    columnDefs,
    fetchTitle,
    createColumnDefs,
}) => {
    const {params = {}} = match;

    const [isDoneDisabled, setIsDoneButtonDisabled] = useState(true);

    // TODO: this should be generate on initial app load
    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs]);

    useEffect(() => {
        const {id} = params || {};
        fetchTitle({id});
    }, []);

    const {title, contentType} = titleMetadata || {};

    const handleDoneClick = values => values;

    const handleDataChange = ({matchList = {}, duplicateList = {}}) => {
        const hasItem = Object.keys(matchList).length || Object.keys(duplicateList).length;
        setIsDoneButtonDisabled(!hasItem);
    };

    return (
        <div className="nexus-c-legacy-title-reconciliation-view">
            <NexusTitle>{TITLE}</NexusTitle>
            <div className="nexus-c-legacy-title-reconciliation-view__title-metadata">
                <NexusTitle isSubTitle>{FOCUSED_TITLE}</NexusTitle>
                <NexusGrid 
                    columnDefs={getColumnDefsWithCleanContentType(columnDefs)}
                    rowData={[titleMetadata]}
                    domLayout="autoHeight"
                />
            </div>
            <SectionMessage appearance='info'>
                <p className="nexus-c-legacy-title-reconciliation-view__section-message">{SECTION_MESSAGE}</p>
            </SectionMessage>
            <CandidatesList
                titleId={params.id}
                columnDefs={columnDefs}
                // TODO: Capitalized variable name due to invalid BE requirement
                queryParams={{ContentType: contentType, title}}
                onDataChange={handleDataChange}
            />
            <div className="nexus-c-legacy-title-reconciliation-view__buttons">
                <Button
                    className="nexus-c-button"
                    appearance="primary"
                    onClick={handleDoneClick}
                    isDisabled={isDoneDisabled}
                >
                    {SAVE_BTN}
                </Button>
            </div>
        </div>
    );
};

LegacyTitleReconciliationView.propsTypes = {
    titleMetadata: PropTypes.object,
    createColumnDefs: PropTypes.func.isRequired,
    fetchTitle: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
};

LegacyTitleReconciliationView.defaultProps = {
    titleMetadata: null,
};

const createMapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    return (state, props) => ({
        titleMetadata: titleSelector(state, props),
        columnDefs: getColumnDefs(state),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchTitle: payload => dispatch(fetchTitle(payload)),
    createColumnDefs: () => dispatch(createColumnDefs()),
});

export default connect(createMapStateToProps, mapDispatchToProps)(LegacyTitleReconciliationView); // eslint-disable-line
