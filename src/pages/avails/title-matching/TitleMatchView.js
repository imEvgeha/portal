import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {cloneDeep} from 'lodash';
import {connect} from 'react-redux';
import mappings from '../../../../profile/titleMatchingRightMappings.json';
import {NexusGrid, NexusTitle} from '../../../ui/elements';
import CustomActionsCellRenderer from '../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import {getSearchCriteria} from '../../legacy/stores/selectors/metadata/titleSelectors';
import {createColumnDefs as getRightColumns} from '../utils';
import TitlesList from './components/TitlesList';
import CreateTitleForm from './components/create-title-form/CreateTitleForm';
import NewTitleConstants from './components/create-title-form/CreateTitleFormConstants';
import {fetchFocusedRight, createColumnDefs, mergeTitles} from './titleMatchingActions';
import Constants from './titleMatchingConstants';
import {getFocusedRight, getColumnDefs} from './titleMatchingSelectors';
import './TitleMatchView.scss';

const SECTION_MESSAGE = `Select titles from the repository that match the Incoming right or declare it as a NEW title
from the action menu.`;

const IncomingRightTable = withColumnsResizing()(NexusGrid);

const TitleMatchView = ({
    match,
    fetchFocusedRight,
    createColumnDefs,
    mergeTitles,
    focusedRight,
    columnDefs,
    searchCriteria,
}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const rightColumns = getRightColumns(mappings);
    // eslint-disable-next-line
    const newTitleCell = ({data}) => {
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button
                    onClick={() =>
                        openModal(<CreateTitleForm close={closeModal} focusedRight={focusedRight} />, {
                            title: NewTitleConstants.NEW_TITLE_MODAL_TITLE,
                        })
                    }
                >
                    New Title
                </Button>
            </CustomActionsCellRenderer>
        );
    };
    const newTitleButton = {
        ...Constants.ADDITIONAL_COLUMN_DEF,
        colId: 'newTitle',
        field: 'newTitle',
        headerName: '',
        cellRendererFramework: newTitleCell,
    };

    useEffect(() => {
        if (match && match.params.rightId) {
            fetchFocusedRight(match.params.rightId);
            DOP.setErrorsCount(1);
        }
    }, [fetchFocusedRight, match]);

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
                    <TitlesList
                        rightId={match && match.params.rightId}
                        columnDefs={columnDefs}
                        mergeTitles={mergeTitles}
                        // TODO: Capitalize first letter of contentType value to be checked inside drop down ag grid
                        queryParams={{
                            contentType: `${contentType.slice(0, 1)}${contentType.slice(1).toLowerCase()}`,
                            title,
                            releaseYear,
                        }}
                    />
                </>
            )}
        </div>
    );
};

TitleMatchView.propTypes = {
    fetchFocusedRight: PropTypes.func.isRequired,
    createColumnDefs: PropTypes.func.isRequired,
    mergeTitles: PropTypes.func.isRequired,
    match: PropTypes.object,
    focusedRight: PropTypes.object,
    searchCriteria: PropTypes.object,
    columnDefs: PropTypes.array,
};

TitleMatchView.defaultProps = {
    focusedRight: {},
    columnDefs: [],
    searchCriteria: {},
    match: {},
};

const createMapStateToProps = () => {
    return state => ({
        focusedRight: getFocusedRight(state),
        columnDefs: getColumnDefs(state),
        searchCriteria: getSearchCriteria(state),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
    createColumnDefs: () => dispatch(createColumnDefs()),
    mergeTitles: (matchList, duplicateList, rightId) => dispatch(mergeTitles({matchList, duplicateList, rightId})),
});

// eslint-disable-next-line
export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView);
