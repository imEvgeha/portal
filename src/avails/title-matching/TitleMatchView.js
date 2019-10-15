import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import TitlesList from './TitlesList';
import { getFocusedRight, getColumnDefs } from './titleMatchingSelectors';
import { fetchFocusedRight, createColumnDefs } from './titleMatchingActions';
import Constants from './titleMatchingConstants';
import './TitleMatchView.scss';

const TitleMatchView = ({match, fetchFocusedRight, createColumnDefs,
                            focusedRight, columnDefs}) => {

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
            <div className="nexus-c-title-to-match-header">
                <NexusTitle>Title Matching</NexusTitle>
            </div>
            <NexusTitle>Incoming Right</NexusTitle>
            <div className="nexus-c-title-to-match-grid">
                <NexusGrid
                    columnDefs={[newTitleButton, ...columnDefs]}
                    rowData={[focusedRight]}
                />
            </div>
            <SectionMessage>
                <p>Select titles from the repository that match the Incoming right or declare it as a NEW title from the
                    action menu.</p>
            </SectionMessage>
            <TitlesList columnDefs={columnDefs} />
        </div>
    );
};

TitleMatchView.propTypes = {
    fetchFocusedRight: PropTypes.func.isRequired,
    createColumnDefs: PropTypes.func.isRequired,
    match: PropTypes.object,
    focusedRight: PropTypes.object,
    columnDefs: PropTypes.array,
};

TitleMatchView.defaultProps = {
    focusedRight: {},
    columnDefs: [],
};

const createMapStateToProps = () => {
    return (state) => ({
        focusedRight: getFocusedRight(state),
        columnDefs: getColumnDefs(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchFocusedRight: payload => dispatch(fetchFocusedRight(payload)),
    createColumnDefs: () => dispatch(createColumnDefs()),
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchView); // eslint-disable-line
