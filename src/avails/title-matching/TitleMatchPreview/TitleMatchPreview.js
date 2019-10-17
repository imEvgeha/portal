import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import {getColumnDefs, getTitles} from '../titleMatchingSelectors';
import {createColumnDefs} from '../titleMatchingActions';
import { getRepositoryCell } from '../../utils';
import './TitleMatchPreview.scss';

const TitleMatchPreview = ({columnDefs, matchedTitles}) => {

    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs]);

    return (
        <div className="nexus-c-title-to-match-preview">
            <div className="nexus-c-title-to-match-preview__header">
                <NexusTitle>Title Matching Preview</NexusTitle>
            </div>
            <NexusTitle>Matched Titles</NexusTitle>
            <NexusGrid
                columnDefs={[getRepositoryCell(), ...columnDefs]}
                rowData={Object.values(matchedTitles)}
            />
        </div>
    );
};

TitleMatchPreview.propTypes = {
    columnDefs: PropTypes.array,
    matchedTitles: PropTypes.obj,
};

TitleMatchPreview.defaultProps = {
    columnDefs: [],
    matchedTitles: {},
};

const createMapStateToProps = () => {
    return (state) => ({
        columnDefs: getColumnDefs(state),
        matchedTitles: getTitles(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    createColumnDefs: () => dispatch(createColumnDefs()),
});


export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchPreview); // eslint-disable-line