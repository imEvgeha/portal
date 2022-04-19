import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {getLinkableColumnDefs} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import createValueFormatter from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import NexusTooltip from '@vubiquity-nexus/portal-ui/lib/elements/nexus-tooltip/NexusTooltip';
import classNames from 'classnames';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import {titleServiceManager} from '../../legacy/containers/metadata/service/TitleServiceManager';
import {getRepositoryCell} from '../utils';
import mappings from './RightsMatchingTitlesTableMappings.json';
import './RightsMatchingTitlesTable.scss';

const TitlesTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch})
)(NexusGrid);

const RightsMatchingTitlesTable = ({
    setTotalCount,
    setGridApi,
    contentType,
    setTitlesTableIsReady,
    isDisabled,
    matchButton,
    duplicateButton,
    onCellValueChanged,
}) => {
    const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);

    const updateColumnDefs = columnDefs => {
        return columnDefs.map(columnDef => {
            const updatedColumnDef = {
                ...columnDef,
                valueFormatter: createValueFormatter(columnDef),
                sortable: ['releaseYear'].includes(columnDef.field),
            };
            if (columnDef.colId.startsWith('castCrew')) {
                updatedColumnDef.cellRendererFramework = params => {
                    const {valueFormatted} = params || {};
                    const value = valueFormatted ? ' '.concat(valueFormatted.split(';').join('\n')) : '';
                    return (
                        <div className="nexus-c-rights-matching-titles-table__cast-crew">
                            <NexusTooltip content={value}>
                                <div>{valueFormatted || ''}</div>
                            </NexusTooltip>
                        </div>
                    );
                };
            }
            return updatedColumnDef;
        });
    };

    const onGridReady = ({type, api}) => {
        if (type === GRID_EVENTS.READY) {
            setGridApi(api);
            setTitlesTableIsReady(true);
        }
    };

    useEffect(() => {
        const tmp = updateColumnDefs(mappings);
        const updatedColumnDefs = getLinkableColumnDefs(tmp);
        setTableColumnDefinitions([matchButton, duplicateButton, getRepositoryCell(), ...updatedColumnDefs]);
    }, []);

    return (
        <div
            className={classNames(
                'nexus-c-rights-matching-titles-table-wrapper',
                isDisabled && 'nexus-c-rights-matching-titles-table-wrapper--is-disabled'
            )}
        >
            <TitlesTable
                className="nexus-c-rights-matching-titles-table"
                columnDefs={tableColumnDefinitions}
                mapping={mappings}
                onGridEvent={onGridReady}
                initialFilter={{contentType}}
                setTotalCount={setTotalCount}
                onCellValueChanged={onCellValueChanged}
            />
        </div>
    );
};

RightsMatchingTitlesTable.propTypes = {
    setTotalCount: PropTypes.func,
    setGridApi: PropTypes.func,
    contentType: PropTypes.string,
    setTitlesTableIsReady: PropTypes.func,
    onCellValueChanged: PropTypes.func,
    isDisabled: PropTypes.bool,
    matchButton: PropTypes.object,
    duplicateButton: PropTypes.object,
};

RightsMatchingTitlesTable.defaultProps = {
    setTotalCount: () => null,
    setGridApi: () => null,
    contentType: null,
    setTitlesTableIsReady: () => null,
    onCellValueChanged: () => null,
    isDisabled: false,
    matchButton: {},
    duplicateButton: {},
};

export default RightsMatchingTitlesTable;
