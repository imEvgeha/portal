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
import {defineEpisodeAndSeasonNumberColumn} from '../../ui-elements/nexus-grid/elements/columnDefinitions';
import {GRID_EVENTS} from '../../ui-elements/nexus-grid/constants';
import CandidatesList from './components/CandidatesList';

const LegacyTitleReconciliationView = ({
    titleMetadata,
    getColumnDefs,
    match,
    columnDefs,
    fetchTitle,
    createColumnDefs,
}) => {
    const [isDoneDisabled, setIsDoneButtonDisabled] = useState(true);
    const {params = {}} = match;
    const {title, contentType} = titleMetadata || {};

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

    const handleDoneClick = values => values;

    const handleCandidatesChange = ({matchList = {}, duplicateList = {}}) => {
        const hasItem = Object.keys(matchList).length || Object.keys(duplicateList).length;
        setIsDoneButtonDisabled(!hasItem);
    };

    const handleGridEvent = ({type, columnApi}) => {
        if (GRID_EVENTS.READY) {
            const contentTypeIndex = updatedColumnDefs.findIndex(({field}) => field === 'contentType');
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex);
        }
    };

    const episodeAndSeasonNumberColumnDef = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = [episodeAndSeasonNumberColumnDef, ...columnDefs];

    return (
        <div className="nexus-c-legacy-title-reconciliation-view">
            <NexusTitle>{TITLE}</NexusTitle>
            <div className="nexus-c-legacy-title-reconciliation-view__title-metadata">
                <NexusTitle isSubTitle>{FOCUSED_TITLE}</NexusTitle>
                <NexusGrid 
                    columnDefs={updatedColumnDefs}
                    rowData={[titleMetadata]}
                    onGridEvent={handleGridEvent}
                    domLayout="autoHeight"
                />
            </div>
            <SectionMessage appearance='info'>
                <p className="nexus-c-legacy-title-reconciliation-view__section-message">{SECTION_MESSAGE}</p>
            </SectionMessage>
            <CandidatesList
                titleId={params.id}
                columnDefs={updatedColumnDefs}
                // TODO: Capitalized variable name due to invalid BE requirement
                queryParams={{ContentType: contentType, title}}
                onCandidatesChange={handleCandidatesChange}
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
