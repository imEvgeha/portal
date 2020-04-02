import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button';
import './LegacyTitleReconciliationView.scss';
import {NexusTitle, NexusGrid} from '../../ui/elements/';
import {
    TITLE,
    SECTION_MESSAGE,
    FOCUSED_TITLE,
    SAVE_BTN,
} from './constants';
import {GRID_EVENTS} from '../../ui/elements/nexus-grid/constants';
import {defineEpisodeAndSeasonNumberColumn} from '../../ui/elements/nexus-grid/elements/columnDefinitions';
import {createLoadingSelector} from '../../ui/loading/loadingSelectors';
import {fetchTitle, reconcileTitles} from '../metadataActions';
import {createColumnDefs} from '../../avails/title-matching/titleMatchingActions';
import * as selectors from '../metadataSelectors';
import {getColumnDefs} from '../../avails/title-matching/titleMatchingSelectors';
import CandidatesList from './components/CandidatesList';
import {getRepositoryCell} from '../../avails/utils';

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
    const [gridApi, setGridApi] = useState();
    const {params = {}} = match;
    const {title, contentType = '', releaseYear} = titleMetadata || {};

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

    const handleDoneClick = () => {
        onDone(selectedList);
    };

    const handleCandidatesChange = ({matchList = {}, duplicateList = {}}) => {
        const hasItem = Object.keys(matchList).length;
        setIsDoneButtonDisabled(!hasItem);
        setSelectedList({matchList, duplicateList});
    };

    const handleGridEvent = ({type, columnApi, api}) => {
        if (GRID_EVENTS.READY === type) {
            setGridApi(api);
            const contentTypeIndex = updatedColumnDefs.findIndex(({field}) => field === 'contentType');
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex);
        }
    };

    const episodeAndSeasonNumberColumnDef = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = [
        getRepositoryCell({headerName: 'Repository'}),
        episodeAndSeasonNumberColumnDef,
        ...columnDefs
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
            <SectionMessage appearance='info'>
                <p className="nexus-c-legacy-title-reconciliation-view__section-message">{SECTION_MESSAGE}</p>
            </SectionMessage>
            <CandidatesList
                titleId={params.id}
                columnDefs={updatedColumnDefs}
                queryParams={{contentType: `${contentType.slice(0, 1)}${contentType.slice(1).toLowerCase()}`, title, releaseYear}}
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

LegacyTitleReconciliationView.propsTypes = {
    titleMetadata: PropTypes.object,
    createColumnDefs: PropTypes.func.isRequired,
    fetchTitle: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    isMerging: PropTypes.bool,
};

LegacyTitleReconciliationView.defaultProps = {
    titleMetadata: null,
    isMerging: false,
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

export default connect(createMapStateToProps, mapDispatchToProps)(LegacyTitleReconciliationView); // eslint-disable-line