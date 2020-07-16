import React, {useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import './LegacyTitleReconciliationReview.scss';
import {NexusTitle, NexusGrid} from '../../../../ui/elements';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import {defineEpisodeAndSeasonNumberColumn} from '../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import {
    TITLE,
    MASTER_TABLE,
    DUPLICATES_TABLE,
    CREATED_TITLE_TABLE,
    DUPLICATE_IDS,
    MASTER_IDS,
    MERGED_ID,
    EMPTY_VIEW,
} from './constants';
import * as selectors from '../../metadataSelectors';
import {getReconciliationTitles} from '../../metadataActions';
import {URL} from '../../../../util/Common';
import {createColumnDefs} from '../../../avails/title-matching/titleMatchingActions';
import {getColumnDefs} from '../../../avails/title-matching/titleMatchingSelectors';
import {getRepositoryCell} from '../../../avails/utils';

const LegacyTitleReconciliationReview = ({
    createColumnDefs,
    columnDefs,
    titles,
    match,
    getReconciliationTitles,
}) => {
    useEffect(() => {
        if (!columnDefs.length) {
            createColumnDefs();
        }
    }, [columnDefs]);

    const duplicateIds = URL.getParamIfExists(DUPLICATE_IDS).split(',')
        .filter(Boolean);
    const masterIds = URL.getParamIfExists(MASTER_IDS).split(',')
        .filter(Boolean);
    const newTitleId = URL.getParamIfExists(MERGED_ID);

    useEffect(() => {
        const {params} = match;
        const {id} = params || {};
        const ids = [...duplicateIds, ...masterIds, newTitleId].filter(Boolean);
        getReconciliationTitles({ids});
    }, []);

    const handleGridEvent = ({type, columnApi}) => {
        if (GRID_EVENTS.READY === type) {
            const contentTypeIndex = updatedColumnDefs.findIndex(({field}) => field === 'contentType');
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex);
        }
    };

    const episodeAndSeasonNumberColumnDef = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = [
        getRepositoryCell({headerName: 'Repository'}),
        episodeAndSeasonNumberColumnDef,
        ...columnDefs,
    ];

    const duplicateRowData = titles.filter(({id}) => duplicateIds.includes(id));
    const masterRowData = titles.filter(({id}) => masterIds.includes(id));
    const mergedRowData = titles.filter(({id}) => newTitleId === id);

    return (
        <div className="nexus-c-legacy-title-reconciliation-review">
            <NexusTitle>{TITLE}</NexusTitle>
            {!masterIds.length && !newTitleId && !duplicateIds.length ? (
                <div className="nexus-legacy-title-reconciliation-review__empty">
                    {EMPTY_VIEW}
                </div>
            ) : (
                <>
                    {!!masterIds.length && (
                        <div className="nexus-c-legacy-title-reconciliation-review__master">
                            <NexusTitle isSubTitle>{MASTER_TABLE}</NexusTitle>
                            <NexusGrid
                                columnDefs={updatedColumnDefs}
                                rowData={masterRowData}
                                onGridEvent={handleGridEvent}
                                domLayout="autoHeight"
                            />
                        </div>
                    )}
                    {!!newTitleId && (
                        <div className="nexus-c-legacy-title-reconciliation-review__created-title">
                            <NexusTitle isSubTitle>{CREATED_TITLE_TABLE}</NexusTitle>
                            <NexusGrid
                                columnDefs={updatedColumnDefs}
                                rowData={mergedRowData}
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
                                rowData={duplicateRowData}
                                onGridEvent={handleGridEvent}
                                domLayout="autoHeight"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

LegacyTitleReconciliationReview.propsTypes = {
    createColumnDefs: PropTypes.func.isRequired,
    getReconciliationTitles: PropTypes.func,
    columnDefs: PropTypes.array,
    titles: PropTypes.array,
};

LegacyTitleReconciliationReview.defaultProps = {
    getReconciliationTitles: null,
    columnDefs: [],
    titles: [],
};

const createMapStateToProps = () => {
    const titlesSelector = selectors.createTitlesSelector();
    return (state, props) => ({
        columnDefs: getColumnDefs(state),
        titles: titlesSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    createColumnDefs: () => dispatch(createColumnDefs()),
    getReconciliationTitles: payload => dispatch(getReconciliationTitles(payload)),
});

export default connect(createMapStateToProps, mapDispatchToProps)(LegacyTitleReconciliationReview); // eslint-disable-line
