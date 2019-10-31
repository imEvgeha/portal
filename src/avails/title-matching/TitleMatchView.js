import React, {useEffect, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {NexusModalContext} from '../../ui-elements/nexus-modal/NexusModal';
import NexusToastNotificationContext from '../../ui-elements/nexus-toast-notification/NexusToastNotificationContext';
import TitlesList from './components/TitlesList';
import { getFocusedRight, getColumnDefs } from './titleMatchingSelectors';
import { getSearchCriteria } from '../../stores/selectors/metadata/titleSelectors';
import { createColumnDefs as getRightColumns } from '../utils';
import mappings from '../../../profile/titleMatchingRightMappings';
import {fetchFocusedRight, createColumnDefs, mergeTitles} from './titleMatchingActions';
import CreateTitleForm from './components/create-title-form/CreateTitleForm';
import NewTitleConstants from './components/create-title-form/CreateTitleFormConstants';
import Constants from './titleMatchingConstants';
import './TitleMatchView.scss';


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
    const toastApi = useContext(NexusToastNotificationContext);
    const rightColumns = getRightColumns(mappings);
    const newTitleCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button
                    onClick={() => setModalContentAndTitle(() => <CreateTitleForm close={close} />, NewTitleConstants.NEW_TITLE_MODAL_TITLE)}
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
        }
    }, [match]);

    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs]);

    return (
        <div className="nexus-c-title-to-match">
            <div className="nexus-c-title-to-match__header">
                <NexusTitle>Title Matching</NexusTitle>
            </div>
            {
                !!searchCriteria.title && (
                    <React.Fragment>
                        <NexusTitle>Incoming Right</NexusTitle>
                        <div className="nexus-c-title-to-match__grid">
                            <NexusGrid
                                columnDefs={[newTitleButton, ...rightColumns]}
                                rowData={[focusedRight]}
                            />
                        </div>
                        <SectionMessage>
                            <p>Select titles from the repository that match the Incoming right or declare it as a NEW title from the
                                action menu.</p>
                        </SectionMessage>
                        <TitlesList columnDefs={columnDefs}
                                    mergeTitles={(matchList, duplicateList) => mergeTitles(matchList, duplicateList, toastApi)}/>
                    </React.Fragment>
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
    mergeTitles: (matchList, duplicateList, toastApi) => dispatch(mergeTitles(matchList, duplicateList, toastApi))
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView); // eslint-disable-line
