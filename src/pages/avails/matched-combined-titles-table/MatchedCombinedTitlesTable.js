import React from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import classNames from 'classnames';
import {NexusGrid} from '../../../ui/elements';
import {
    defineEpisodeAndSeasonNumberColumn,
    getLinkableColumnDefs,
} from '../../../ui/elements/nexus-grid/elements/columnDefinitions';
import createValueFormatter from '../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import {getRepositoryCell} from '../utils';
import mappings from './MatchedCombinedTitlesTableMappings.json';
import './MatchedCombinedTitlesTable.scss';

const MatchedCombinedTitlesTable = ({data, isFullHeight}) => {
    const updateColumnDefs = columnDefs => {
        return columnDefs.map(columnDef => ({
            ...columnDef,
            valueFormatter: createValueFormatter(columnDef),
            cellRenderer: 'loadingCellRenderer',
        }));
    };

    const updatedColumns = updateColumnDefs(mappings);

    const onGridReady = ({type, columnApi}) => {
        if (type === GRID_EVENTS.READY) {
            const contentTypeIndex = updatedColumnDefs.findIndex(e => e.field === 'contentType');
            const PINNED_COLUMNS_NUMBER = 3;
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + PINNED_COLUMNS_NUMBER);
        }
    };

    const numOfEpisodeAndSeasonField = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = getLinkableColumnDefs([numOfEpisodeAndSeasonField, ...updatedColumns]);
    const repository = getRepositoryCell();

    return (
        <div
            className={classNames(
                'nexus-c-matched-combined-titles-table-wrapper',
                isFullHeight && 'nexus-c-matched-full-view'
            )}
        >
            <NexusGrid
                className="nexus-c-matched-combined-titles-table"
                columnDefs={[repository, ...updatedColumnDefs]}
                rowData={data}
                mapping={mappings}
                rowSelection="single"
                domLayout={isFullHeight ? 'normal' : 'autoHeight'}
                onGridEvent={onGridReady}
            />
        </div>
    );
};

MatchedCombinedTitlesTable.propTypes = {
    data: PropTypes.array,
    isFullHeight: PropTypes.bool,
};

MatchedCombinedTitlesTable.defaultProps = {
    data: null,
    isFullHeight: false,
};

export default MatchedCombinedTitlesTable;
