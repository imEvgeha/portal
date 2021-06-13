import React from 'react';
import PropTypes from 'prop-types';
import {
    getLinkableColumnDefs,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import classNames from 'classnames';
import {NexusGrid} from '../../../ui/elements';
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

    const updatedColumnDefs = getLinkableColumnDefs(updatedColumns);
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
