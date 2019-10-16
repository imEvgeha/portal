import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import TitlesList from './TitlesList';
import { getFocusedRight, getColumnDefs } from './titleMatchingSelectors';
import { getSearchCriteria } from '../../stores/selectors/metadata/titleSelectors';
import { fetchFocusedRight, createColumnDefs } from './titleMatchingActions';
import Constants from './titleMatchingConstants';
import './TitleMatchView.scss';

const TitleMatchView = ({match, fetchFocusedRight, createColumnDefs,
                            focusedRight, columnDefs, searchCriteria}) => {
    const newTitleCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Button>New Title</Button>
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
                                columnDefs={[newTitleButton, ...columnDefs]}
                                rowData={[focusedRight]}
                            />
                        </div>
                        <SectionMessage>
                            <p>Select titles from the repository that match the Incoming right or declare it as a NEW title from the
                                action menu.</p>
                        </SectionMessage>
                        <TitlesList columnDefs={columnDefs}/>
                    </React.Fragment>
                )
            }
        </div>
    );
};

TitleMatchView.propTypes = {
    fetchFocusedRight: PropTypes.func.isRequired,
    createColumnDefs: PropTypes.func.isRequired,
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
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView); // eslint-disable-line
