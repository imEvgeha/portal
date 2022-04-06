import React, {useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withMatchAndDuplicateList from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withMatchAndDuplicateList';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {set} from 'lodash';
import {ProgressSpinner} from 'primereact/progressspinner';
import {connect} from 'react-redux';
import {compose} from 'redux';
import './LegacyTitleReconciliationView.scss';
import {NexusTitle, NexusGrid} from '../../../ui/elements';
import {createColumnDefs} from '../../avails/title-matching/titleMatchingActions';
import {getColumnDefs} from '../../avails/title-matching/titleMatchingSelectors';
import {getRepositoryCell} from '../../avails/utils';
import {fetchTitle, reconcileTitles} from '../metadataActions';
import * as selectors from '../metadataSelectors';
import CandidatesList from './components/CandidatesList';
import {TITLE, SECTION_MESSAGE, FOCUSED_TITLE, SAVE_BTN} from './constants';

const Candidates = compose(withMatchAndDuplicateList(true))(CandidatesList);

const LegacyTitleReconciliationView = ({
    titleMetadata,
    match,
    columnDefs,
    fetchTitle,
    onDone,
    createColumnDefs,
    isMerging,
}) => {
    const NexusGridWithColumnResizing = compose(withColumnsResizing())(NexusGrid);

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

    const colDefsWithTitleLink = () => {
        const [title] = columnDefs.filter(col => col.cellRendererParams.link);
        set(title, 'cellRendererParams.link', '/metadata/detail/');
        return columnDefs;
    };

    const updatedColumnDefs = [getRepositoryCell({headerName: 'Repository'}), ...colDefsWithTitleLink()];

    return (
        <div className="nexus-c-legacy-title-reconciliation-view">
            <NexusTitle>{TITLE}</NexusTitle>
            <div className="nexus-c-legacy-title-reconciliation-view__title-metadata">
                <NexusTitle isSubTitle>{FOCUSED_TITLE}</NexusTitle>
                <NexusGridWithColumnResizing
                    columnDefs={updatedColumnDefs}
                    rowData={[titleMetadata]}
                    domLayout="autoHeight"
                />
            </div>
            <SectionMessage appearance="info">
                <p className="nexus-c-legacy-title-reconciliation-view__section-message">{SECTION_MESSAGE}</p>
            </SectionMessage>
            <Candidates
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
                    isDisabled={isDoneDisabled || isMerging}
                    isLoading={isMerging}
                >
                    {isMerging ? (
                        <ProgressSpinner className="nexus-c-legacy-title-reconciliation-view__spinner" />
                    ) : (
                        <span>{SAVE_BTN}</span>
                    )}
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
