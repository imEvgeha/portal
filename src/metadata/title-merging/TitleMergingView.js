import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {isEqual} from 'lodash.isequal';
import SectionMessage from '@atlaskit/section-message';
import './TitleMergingView.scss';
import {NexusTitle, NexusGrid} from '../../ui-elements/';
import {TITLE, SECTION_MESSAGE, FOCUSED_TITLE} from './constants';
import {fetchTitle} from '../metadataActions';
import * as selectors from '../metadataSelectors';
import {getColumnDefs} from '../../avails/title-matching/titleMatchingSelectors';
import {createColumnDefs} from '../../avails/title-matching/titleMatchingActions';
import usePrevious from '../../util/hooks/usePrevious';

const TitleMergingView = ({focusedTitle, getColumnDefs, match}) => {
    const previousColumnDefs = usePrevious(columnDefs);
    const {params = {}} = match;

    // TODO: this should be generate on initial app load
    useEffect(() => {
        if (!isEqual(previousColumnDefs, columnDefs)) {
            createColumnDefs();
        }
    }, [columnDefs]);

    useEffect(() => {
        const {id} = params || {};
        fetchTitle({id});
    }, []);

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
    createColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
};

TitleMergingView.defaultProps = {
    focusedTitle: null,
};

const createMapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    return (state, props) => ({
        focusedTitle: titleSelector(state, props),
        columnDefs: getColumnDefs(state),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchTitle: payload => dispatch(fetchTitle(payload)),
    createColumnDefs: () => dispatch(createColumnDefs()),
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMergingView); // eslint-disable-line
