import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SectionMessage from '@atlaskit/section-message';
import './TitleMergingView.scss';
import {NexusTitle, NexusGrid} from '../../ui-elements/';
import {TITLE, SECTION_MESSAGE, FOCUSED_TITLE} from './constants';
import {fetchTitle} from './metadataActions';
import * as selectors from './metadataSelectors';
import {getColumnDefs} from './titleMatchingSelectors';

const TitleMergingView = ({focusedTitle}) => {
    const columnDefs = [];

    return (
        <div className="nexus-c-title-merging-view">
            <NexusTitle>{TITLE}</NexusTitle>
            <div className="nexus-c-title-merging-view__focused-title">
                <NexusTitle isSubTitle>{FOCUSED_TITLE}</NexusTitle>
                <NexusGrid 
                    columnDefs={columnDefs}
                    rowData={[focusedTitle]}
                />
            </div>
            <SectionMessage appearance='info'>
                <p className="nexus-c-title-merging-view__section-message">{SECTION_MESSAGE}</p>
            </SectionMessage>
            <div className="nexus-c-title-merging-view__candidates" />
        </div>
    );
};

TitleMergingView.propsTypes = {
    focusedTitle: PropTypes.object,
};

TitleMergingView.defaultProps = {
    focusedTitle: null,
};

const createMapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    return (state, props) => ({
        focusedTitle: titleSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchTitle: payload => dispatch(fetchTitle(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMergingView); // eslint-disable-line
