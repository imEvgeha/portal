import React, {useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {defineEpisodeAndSeasonNumberColumn} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {set} from 'lodash';
import {connect} from 'react-redux';
import './LegacyTitleReconciliationView.scss';
import {NexusTitle, NexusGrid} from '../../../ui/elements';
import {createColumnDefs} from '../../avails/title-matching/titleMatchingActions';
import {getColumnDefs} from '../../avails/title-matching/titleMatchingSelectors';
import {getRepositoryCell} from '../../avails/utils';
import {fetchTitle, reconcileTitles} from '../metadataActions';
import * as selectors from '../metadataSelectors';
import CandidatesList from './components/CandidatesList';
import {TITLE, SECTION_MESSAGE, FOCUSED_TITLE, SAVE_BTN} from './constants';

const LegacyTitleReconciliationView = ({
    titleMetadata,
    match,
    columnDefs,
    fetchTitle,
    onDone,
    createColumnDefs,
    isMerging,
}) => {
    const [isDoneDisabled, setIsDoneButtonDisabled] = useState(true);
    const [selectedList, setSelectedList] = useState({});
    const {params = {}} = match;
    const {title, contentType = '', releaseYear} = titleMetadata || {};

    // TODO: this should be generate on initial app load
    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs, createColumnDefs]);

    useEffect(() => {
        const {id} = params || {};
        fetchTitle({id});
    }, [fetchTitle, params]);

    const handleDoneClick = () => {
        onDone(selectedList);
    };

    const handleCandidatesChange = useCallback(({matchList, duplicateList}) => {
        const hasItem = Object.keys(matchList).length;
        setIsDoneButtonDisabled(!hasItem);
        setSelectedList({matchList, duplicateList});
    }, []);

    const handleGridEvent = ({type, columnApi, api}) => {
        if (GRID_EVENTS.READY === type) {
            const directorIndex = columnApi.columnController.columnDefs.findIndex(
                ({field}) => field === 'castCrew.director'
            );
            columnApi.moveColumn('episodeAndSeasonNumber', directorIndex);
        }
    };

    const colDefsWithTitleLink = () => {
        const [title] = columnDefs.filter(col => col.cellRendererParams.link);
        set(title, 'cellRendererParams.link', '/metadata/detail/');
        return columnDefs;
    };

    const episodeAndSeasonNumberColumnDef = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = [
        getRepositoryCell({headerName: 'Repository'}),
        ...colDefsWithTitleLink(),
        episodeAndSeasonNumberColumnDef,
    ];

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
            <SectionMessage appearance="info">
                <p className="nexus-c-legacy-title-reconciliation-view__section-message">{SECTION_MESSAGE}</p>
            </SectionMessage>
            <CandidatesList
                titleId={params.id}
                columnDefs={updatedColumnDefs}
                queryParams={{
                    contentType: `${contentType.slice(0, 1)}${contentType.slice(1).toLowerCase()}`,
                    title,
                    releaseYear,
                }}
                onCandidatesChange={handleCandidatesChange}
            />
            <div className="nexus-c-legacy-title-reconciliation-view__buttons">
                <Button
                    className="nexus-c-button"
                    appearance="primary"
                    onClick={handleDoneClick}
                    isDisabled={isDoneDisabled}
                    isLoading={isMerging}
                >
                    {SAVE_BTN}
                </Button>
            </div>
        </div>
    );
};

LegacyTitleReconciliationView.propTypes = {
    titleMetadata: PropTypes.object,
    createColumnDefs: PropTypes.func.isRequired,
    fetchTitle: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    match: PropTypes.object,
    columnDefs: PropTypes.array,
    isMerging: PropTypes.bool,
};

LegacyTitleReconciliationView.defaultProps = {
    titleMetadata: null,
    isMerging: false,
    columnDefs: null,
    match: {},
};

const createMapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    const loadingSelector = createLoadingSelector(['TITLES_RECONCILE']);

    return (state, props) => ({
        titleMetadata: titleSelector(state, props),
        columnDefs: getColumnDefs(state),
        isMerging: loadingSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchTitle: payload => dispatch(fetchTitle(payload)),
    createColumnDefs: () => dispatch(createColumnDefs()),
    onDone: payload => dispatch(reconcileTitles(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(LegacyTitleReconciliationView);
