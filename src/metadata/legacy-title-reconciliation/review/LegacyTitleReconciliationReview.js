import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEqual from 'lodash.isequal';
import './LegacyTitleReconciliationReview.scss';
import {NexusTitle, NexusGrid} from '../../../ui-elements/';
import {
    TITLE,
    MASTER_TABLE,
    DUPLICATES_TABLE,
    CREATED_TITLE_TABLE,
    DUPLICATE_IDS,
    MASTER_IDS,
    MERGED_ID,
} from './constants';
import {createColumnDefs} from '../../../avails/title-matching/titleMatchingActions';
import {getColumnDefs} from '../../../avails/title-matching/titleMatchingSelectors';
import * as selectors from '../../metadataSelectors';
import {getTitleReconciliation} from '../../metadataActions';
import {GRID_EVENTS} from '../../../ui-elements/nexus-grid/constants';
import {defineEpisodeAndSeasonNumberColumn} from '../../../ui-elements/nexus-grid/elements/columnDefinitions';
import {URL} from '../../../util/Common';

const LegacyTitleReconciliationReview = ({
    createColumnDefs,
    columnDefs,
    titles,
    match,
    titleMetadata,
    getTitleReconciliation,
}) => {
    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs]);

    useEffect(() => {
        const {params} = match;
        const {id} = params || {};
        if (!titleMetadata) {
            getTitleReconciliation({id});
        }
    },[titleMetadata]);

    const duplicateIds = URL.getParamIfExists(DUPLICATE_IDS).split(',').filter(Boolean);
    const masterIds = URL.getParamIfExists(MASTER_IDS).split(',').filter(Boolean);
    const newTitleId = URL.getParamIfExists(MERGED_ID);

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
            {!!masterIds.length && (
                <div className="nexus-c-legacy-title-reconciliation-review__master">
                    <NexusTitle isSubTitle>{MASTER_TABLE}</NexusTitle>
                    <NexusGrid 
                        columnDefs={updatedColumnDefs}
                        rowData={titles.filter(({id}) => masterIds.includes(id))}
                        onGridEvent={handleGridEvent}
                        domLayout="autoHeight"
                    />
                </div>
            )}
            {newTitleId && (
                <div className="nexus-c-legacy-title-reconciliation-review__created-title">
                    <NexusTitle isSubTitle>{CREATED_TITLE_TABLE}</NexusTitle>
                    <NexusGrid 
                        columnDefs={updatedColumnDefs}
                        rowData={titles.filter(({id}) => id === newTitleId)}
                        onGridEvent={handleGridEvent}
                        domLayout="autoHeight"
                    />
                </div>
            )}
            {!!duplicateIds.length && (
                <div className="nexus-c-legacy-title-reconciliation-review__duplicates">
                    <NexusTitle isSubTitle>{DUPLICATES_TABLE}</NexusTitle>
                    <NexusGrid 
                        columnDefs={updatedColumnDefs}
                        rowData={titles.filter(({id}) => duplicateIds.includes(id))}
                        onGridEvent={handleGridEvent}
                        domLayout="autoHeight"
                    />
                </div>
            )}
        </div>
    );
};

LegacyTitleReconciliationReview.propsTypes = {
    titleMetadata: PropTypes.object,
    createColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    titles: PropTypes.array,
};

LegacyTitleReconciliationReview.defaultProps = {
    titleMetadata: null,
    fetchTitles: null,
    titles: [],
};

const createMapStateToProps = () => {
    const titleSelector = selectors.createTitleSelector();
    const titlesSelector = selectors.createTitlesSelector();
    return (state, props) => ({
        titleMetadata: titleSelector(state, props),
        columnDefs: getColumnDefs(state),
        titles: titlesSelector(state, props), 
    });
};

const mapDispatchToProps = dispatch => ({
    createColumnDefs: () => dispatch(createColumnDefs()),
    getTitleReconciliation: payload => dispatch(getTitleReconciliation(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(LegacyTitleReconciliationReview); // eslint-disable-line
