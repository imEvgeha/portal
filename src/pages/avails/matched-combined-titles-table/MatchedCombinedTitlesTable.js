import React from 'react';
import PropTypes from 'prop-types';
import {NexusGrid} from '../../../ui/elements';
import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';
import {defineEpisodeAndSeasonNumberColumn, getLinkableColumnDefs} from '../../../ui/elements/nexus-grid/elements/columnDefinitions';
import {getRepositoryCell} from '../utils';
import createValueFormatter from '../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import mappings from './MatchedCombinedTitlesTableMappings.json';

const MatchedCombinedTitlesTable = ({data, fullHeight}) => {
    const updateColumnDefs = columnDefs => {
        return columnDefs.map(columnDef => (
            {
                ...columnDef,
                valueFormatter: createValueFormatter(columnDef),
                cellRenderer: 'loadingCellRenderer',
            }
        ));
    };

    const updatedColumns = updateColumnDefs(mappings);

    const onGridReady = ({type, columnApi}) => {
        if (type === GRID_EVENTS.READY) {
            const contentTypeIndex = updatedColumnDefs.findIndex(e => e.field === 'contentType');
            // +3 indicates pinned columns on the left side
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + 3);
        }
    };

    const numOfEpisodeAndSeasonField = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = getLinkableColumnDefs([numOfEpisodeAndSeasonField, ...updatedColumns]);
    const repository = getRepositoryCell();

    return (
        <div
            className="nexus-c-matched-combined-titles-table-wrapper"
            style={{display: fullHeight ? 'contents' : 'block'}}
        >
            <NexusGrid
                className="nexus-c-matched-combined-titles-table"
                columnDefs={[repository, ...updatedColumnDefs]}
                rowData={data}
                mapping={mappings}
                rowSelection="single"
                domLayout={fullHeight ? 'normal' : 'autoHeight'}
                onGridEvent={onGridReady}
            />
        </div>
    );
};

MatchedCombinedTitlesTable.propTypes = {
    data: PropTypes.array,
    fullHeight: PropTypes.bool,
};

MatchedCombinedTitlesTable.defaultProps = {
    data: null,
    fullHeight:false,
};

export default MatchedCombinedTitlesTable;
