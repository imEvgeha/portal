import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import CustomActionsCellRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withMatchAndDuplicateList from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withMatchAndDuplicateList';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {cloneDeep} from 'lodash';
import {Button} from 'primereact/button';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {compose} from 'redux';
import mappings from '../../../../profile/titleMatchingRightMappings.json';
import {NexusGrid, NexusTitle} from '../../../ui/elements';
import {getSearchCriteria} from '../../legacy/stores/selectors/metadata/titleSelectors';
import TitleCreate from '../../title-metadata/components/titleCreateModal/TitleCreateModal';
import {CONTENT_TYPE_ITEMS} from '../../title-metadata/components/titleCreateModal/TitleCreateModalConstants';
import {createColumnDefs as getRightColumns} from '../utils';
import TitlesList from './components/TitlesList';
import {createColumnDefs, fetchFocusedRight, mergeTitles} from './titleMatchingActions';
import Constants from './titleMatchingConstants';
import {getColumnDefs, getFocusedRight} from './titleMatchingSelectors';
import './TitleMatchView.scss';

const SECTION_MESSAGE = `Select titles from the repository that match the Incoming right or declare it as a NEW title
from the action menu.`;

const IncomingRightTable = withColumnsResizing()(NexusGrid);
const Titles = compose(withMatchAndDuplicateList())(TitlesList);

const TitleMatchView = ({
    fetchFocusedRight,
    createColumnDefs,
    mergeTitles,
    focusedRight,
    columnDefs,
    searchCriteria,
    isMerging,
    toggleRefreshGridData,
}) => {
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const routeParams = useParams();
    const rightColumns = getRightColumns(mappings);
    const {contentType: focusedContentType} = focusedRight;

    const handleOpenModal = () => {
        setShowModal(true);
        setError('');
    };

    // eslint-disable-next-line
    const newTitleCell = ({data}) => {
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button
                    className="p-button-text nexus-c-title-matching-custom-button"
                    label="New Title"
                    onClick={handleOpenModal}
                />
            </CustomActionsCellRenderer>
        );
    };

    const closeModalAndRefreshTable = () => {
        setShowModal(false);
        toggleRefreshGridData(true);
    };

    const newTitleButton = {
        ...Constants.ADDITIONAL_COLUMN_DEF,
        colId: 'newTitle',
        field: 'newTitle',
        headerName: '',
        cellRendererFramework: newTitleCell,
    };

    useEffect(() => {
        if (routeParams.rightId) {
            fetchFocusedRight(routeParams.rightId);
            DOP.setErrorsCount(1);
        }
    }, [fetchFocusedRight, routeParams]);

    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs, createColumnDefs]);

    const deepCloneRightColumnDefs = cloneDeep(rightColumns);
    let updatedRightColumnDefs = [];

    if (focusedRight && focusedRight.contentType === 'Episode') {
        updatedRightColumnDefs = deepCloneRightColumnDefs.filter(e => e.field !== 'episodic.seasonNumber');
    } else if (focusedRight && focusedRight.contentType === 'Season') {
        updatedRightColumnDefs = deepCloneRightColumnDefs.filter(e => e.field !== 'episodic.episodeNumber');
    } else {
        updatedRightColumnDefs = deepCloneRightColumnDefs.filter(
            e => e.field !== 'episodic.episodeNumber' && e.field !== 'episodic.seasonNumber'
        );
    }

    // Taken from focused right to be able to filter title list table
    const {title, contentType = '', releaseYear} = focusedRight || {};

    return (
        <div className="nexus-c-title-to-match">
            <div className="nexus-c-title-to-match__header">
                <NexusTitle>Title Matching</NexusTitle>
            </div>
            {!!searchCriteria.title && (
                <>
                    <NexusTitle isSubTitle>Incoming Right</NexusTitle>
                    <div className="nexus-c-title-to-match__grid">
                        <IncomingRightTable
                            id="incomingRightTitleMatching"
                            columnDefs={[newTitleButton, ...updatedRightColumnDefs]}
                            rowData={[focusedRight]}
                        />
                    </div>
                    <SectionMessage>
                        <p className="nexus-c-right-to-match-view__section-message">{SECTION_MESSAGE}</p>
                    </SectionMessage>
                    <br />
                    <Titles
                        rightId={routeParams.rightId}
                        columnDefs={columnDefs}
                        mergeTitles={mergeTitles}
                        // TODO: Capitalize first letter of contentType value to be checked inside drop down ag grid
                        queryParams={{
                            contentType: `${contentType.slice(0, 1)}${contentType.slice(1).toLowerCase()}`,
                            title,
                            releaseYear,
                        }}
                        isMerging={isMerging}
                    />
                </>
            )}
            <TitleCreate
                display={showModal}
                onSave={closeModalAndRefreshTable}
                onCloseModal={() => setShowModal(false)}
                isItMatching={true}
                defaultValues={{
                    ...focusedRight,
                    contentType: CONTENT_TYPE_ITEMS?.find(item => item.label === focusedContentType)?.value,
                }}
                error={error}
            />
        </div>
    );
};

TitleMatchView.propTypes = {
    fetchFocusedRight: PropTypes.func.isRequired,
    createColumnDefs: PropTypes.func.isRequired,
    mergeTitles: PropTypes.func.isRequired,
    focusedRight: PropTypes.object,
    searchCriteria: PropTypes.object,
    columnDefs: PropTypes.array,
    isMerging: PropTypes.bool,
    toggleRefreshGridData: PropTypes.func,
};

TitleMatchView.defaultProps = {
    focusedRight: {},
    columnDefs: [],
    searchCriteria: {},
    isMerging: false,
    toggleRefreshGridData: () => null,
};

const createMapStateToProps = () => {
    const loadingSelector = createLoadingSelector(['TITLE_MATCHING_MERGE_TITLES']);

    return state => ({
        focusedRight: getFocusedRight(state),
        columnDefs: getColumnDefs(state),
        searchCriteria: getSearchCriteria(state),
        isMerging: loadingSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
    createColumnDefs: () => dispatch(createColumnDefs()),
    mergeTitles: (matchList, duplicateList, rightId) => dispatch(mergeTitles({matchList, duplicateList, rightId})),
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView);
