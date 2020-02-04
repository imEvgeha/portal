import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './LegacyTitleReconciliationReview.scss';
import {NexusTitle, NexusGrid} from '../../../ui-elements/';
import {TITLE, MASTER_TABLE, DUPLICATES_TABLE, CREATED_TITLE_TABLE} from './constants';
import {createColumnDefs} from '../../../avails/title-matching/titleMatchingActions';
import {getColumnDefs} from '../../../avails/title-matching/titleMatchingSelectors';
import * as selectors from '../../metadataSelectors';
import {GRID_EVENTS} from '../../../ui-elements/nexus-grid/constants';
import {defineEpisodeAndSeasonNumberColumn} from '../../../ui-elements/nexus-grid/elements/columnDefinitions';

const LegacyTitleReconciliationReview = ({
    createColumnDefs,
    columnDefs,
}) => {
    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs]);

    const handleGridEvent = ({type, columnApi}) => {
        if (GRID_EVENTS.READY === type) {
            const contentTypeIndex = updatedColumnDefs.findIndex(({field}) => field === 'contentType');
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex);
        }
    };

    const episodeAndSeasonNumberColumnDef = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = [episodeAndSeasonNumberColumnDef, ...columnDefs];

    return (
        <div className="nexus-c-legacy-title-reconciliation-review">
            <NexusTitle>{TITLE}</NexusTitle>
            <div className="nexus-c-legacy-title-reconciliation-review__master">
                <NexusTitle isSubTitle>{MASTER_TABLE}</NexusTitle>
                <NexusGrid 
                    columnDefs={updatedColumnDefs}
                    rowData={[]}
                    onGridEvent={handleGridEvent}
                    domLayout="autoHeight"
                />
            </div>
            <div className="nexus-c-legacy-title-reconciliation-review__created-title">
                <NexusTitle isSubTitle>{CREATED_TITLE_TABLE}</NexusTitle>
                <NexusGrid 
                    columnDefs={updatedColumnDefs}
                    rowData={[]}
                    onGridEvent={handleGridEvent}
                    domLayout="autoHeight"
                />
            </div>
            <div className="nexus-c-legacy-title-reconciliation-review__duplicates">
                <NexusTitle isSubTitle>{DUPLICATES_TABLE}</NexusTitle>
                <NexusGrid 
                    columnDefs={updatedColumnDefs}
                    rowData={[]}
                    onGridEvent={handleGridEvent}
                    domLayout="autoHeight"
                />
            </div>
        </div>
    );
};

LegacyTitleReconciliationReview.propsTypes = {
    titleMetadata: PropTypes.object,
    createColumnDefs: PropTypes.func.isRequired,
    fetchTitle: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
};

LegacyTitleReconciliationReview.defaultProps = {
    titleMetadata: null,
};

const createMapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    return (state, props) => ({
        titleMetadata: titleSelector(state, props),
        columnDefs: getColumnDefs(state),
    });
};

const mapDispatchToProps = dispatch => ({
    fetchTitle: payload => dispatch(fetchTitle(payload)),
    createColumnDefs: () => dispatch(createColumnDefs()),
});

export default connect(createMapStateToProps, mapDispatchToProps)(LegacyTitleReconciliationReview); // eslint-disable-line
