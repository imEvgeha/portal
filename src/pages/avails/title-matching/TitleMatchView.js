import React, {useEffect, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {cloneDeep} from 'lodash';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button';
import './TitleMatchView.scss';
import TitlesList from './components/TitlesList';
import { getFocusedRight, getColumnDefs } from './titleMatchingSelectors';
import { createColumnDefs as getRightColumns } from '../utils';
import {fetchFocusedRight, createColumnDefs, mergeTitles} from './titleMatchingActions';
import CreateTitleForm from './components/create-title-form/CreateTitleForm';
import NewTitleConstants from './components/create-title-form/CreateTitleFormConstants';
import Constants from './titleMatchingConstants';
import DOP from '../../../util/DOP';
import {
    NexusGrid,
    NexusTitle,
} from '../../../ui/elements/';
import CustomActionsCellRenderer from '../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {NexusModalContext} from '../../../ui/elements/nexus-modal/NexusModal';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import mappings from '../../../../profile/titleMatchingRightMappings';
import {getSearchCriteria} from '../../legacy/stores/selectors/metadata/titleSelectors';

const SECTION_MESSAGE = 'Select titles from the repository that match the Incoming right or declare it as a NEW title from the action menu.';

const IncomingRightTable = withColumnsResizing()(NexusGrid);

const TitleMatchView = ({
    match,
    fetchFocusedRight,
    createColumnDefs,
    mergeTitles,
    focusedRight,
    columnDefs,
    searchCriteria
}) => {
    const {setModalContentAndTitle, close} = useContext(NexusModalContext);
    const rightColumns = getRightColumns(mappings);
    const newTitleCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button
                    onClick={() => setModalContentAndTitle(
                        () => <CreateTitleForm close={close} focusedRight={focusedRight} />,
                        NewTitleConstants.NEW_TITLE_MODAL_TITLE)}
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
    }, []);

    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs]);

    const deepCloneRightColumnDefs = cloneDeep(rightColumns);
    let updatedRightColumnDefs;

    if (focusedRight && focusedRight.contentType === 'Episode') {
        updatedRightColumnDefs = deepCloneRightColumnDefs.filter(e => e.field !== 'episodic.seasonNumber');
    } else if (focusedRight && focusedRight.contentType === 'Season') {
        updatedRightColumnDefs = deepCloneRightColumnDefs.filter(e => e.field !== 'episodic.episodeNumber');
    } else {
        updatedRightColumnDefs = deepCloneRightColumnDefs.filter(e => e.field !== 'episodic.episodeNumber' && e.field !== 'episodic.seasonNumber');
    }

    // Taken from focused right to be able to filter title list table
    const {title, contentType = '', releaseYear} = focusedRight || {};

    return (
        <div className="nexus-c-title-to-match">
            <div className="nexus-c-title-to-match__header">
                <NexusTitle>Title Matching</NexusTitle>
            </div>
            {
                !!searchCriteria.title && (
                    <>
                        <NexusTitle isSubTitle>Incoming Right</NexusTitle>
                        <div className="nexus-c-title-to-match__grid">
                            <IncomingRightTable
                                id='incomingRightTitleMatching'
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
                            // TODO: Capitalized first letter of contentType value to be checed inside drop down ag grid
                            queryParams={{contentType: `${contentType.slice(0, 1)}${contentType.slice(1).toLowerCase()}`, title, releaseYear}}
                        />
                    </>
                )
            }
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
};

const createMapStateToProps = () => {
    return (state) => ({
        focusedRight: getFocusedRight(state),
        columnDefs: getColumnDefs(state),
        searchCriteria: getSearchCriteria(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
    createColumnDefs: () => dispatch(createColumnDefs()),
    mergeTitles: (matchList, duplicateList, rightId) => dispatch(mergeTitles({matchList, duplicateList, rightId}))
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView); // eslint-disable-line
