import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {Radio} from '@atlaskit/radio';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import classNames from 'classnames';
import {compose} from 'redux';
import {NexusGrid} from '../../../ui/elements';
import CustomActionsCellRenderer from '../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {
    defineEpisodeAndSeasonNumberColumn,
    getLinkableColumnDefs,
} from '../../../ui/elements/nexus-grid/elements/columnDefinitions';
import createValueFormatter from '../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../ui/elements/nexus-grid/hoc/withSorting';
import TitleSystems from '../../legacy/constants/metadata/systems';
import {titleServiceManager} from '../../legacy/containers/metadata/service/TitleServiceManager';
import Constants from '../title-matching/titleMatchingConstants';
import {getRepositoryName, getRepositoryCell} from '../utils';
import mappings from './RightsMatchingTitlesTableMappings.json';
import './RightsMatchingTitlesTable.scss';

const TitlesTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch}),
    withSorting()
)(NexusGrid);

const RightsMatchingTitlesTable = ({
    restrictedCoreTitleIds,
    setTotalCount,
    contentType,
    matchList,
    handleMatchClick,
    handleDuplicateClick,
    duplicateList,
    setTitlesTableIsReady,
    isDisabled,
}) => {
    const updateColumnDefs = columnDefs => {
        return columnDefs.map(columnDef => ({
            ...columnDef,
            valueFormatter: createValueFormatter(columnDef),
            cellRenderer: 'loadingCellRenderer',
        }));
    };
    const updatedColumns = updateColumnDefs(mappings);

    const matchButtonCell = ({data}) => {
        const {id} = data || {};
        const repoName = getRepositoryName(id);
        let isRestricted = false;
        restrictedCoreTitleIds.forEach(title => {
            if (title.includes(id)) {
                isRestricted = true;
            }
        });
        return (
            <CustomActionsCellRenderer id={id}>
                {!isRestricted ? (
                    <Radio
                        name={repoName}
                        isChecked={matchList[repoName] && matchList[repoName].id === id}
                        onChange={event => handleMatchClick(data, repoName, event.target.checked)}
                    />
                ) : null}
            </CustomActionsCellRenderer>
        );
    };
    matchButtonCell.propTypes = {data: PropTypes.object.isRequired};

    const duplicateButtonCell = ({data}) => {
        const {id} = data || {};
        const repo = getRepositoryName(id);
        return (
            repo !== TitleSystems.NEXUS && (
                <CustomActionsCellRenderer id={id}>
                    <Checkbox
                        isChecked={duplicateList[id]}
                        onChange={event => handleDuplicateClick(data, repo, event.currentTarget.checked)}
                    />
                </CustomActionsCellRenderer>
            )
        );
    };
    duplicateButtonCell.propTypes = {data: PropTypes.object.isRequired};

    const onGridReady = ({type, columnApi}) => {
        if (type === GRID_EVENTS.READY) {
            setTitlesTableIsReady(true);
            const contentTypeIndex = updatedColumnDefs.findIndex(e => e.field === 'contentType');
            const PINNED_COLUMNS_NUMBER = 3;
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + PINNED_COLUMNS_NUMBER);
        }
    };

    const matchButton = {
        ...Constants.ADDITIONAL_COLUMN_DEF,
        colId: 'matchButton',
        field: 'matchButton',
        headerName: 'Match',
        cellRendererParams: matchList,
        cellRendererFramework: matchButtonCell,
    };
    const duplicateButton = {
        ...Constants.ADDITIONAL_COLUMN_DEF,
        colId: 'duplicateButton',
        field: 'duplicateButton',
        headerName: 'Duplicate',
        cellRendererParams: duplicateList,
        cellRendererFramework: duplicateButtonCell,
    };

    const numOfEpisodeAndSeasonField = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = getLinkableColumnDefs([numOfEpisodeAndSeasonField, ...updatedColumns]);
    const repository = getRepositoryCell();

    return (
        <div
            className={classNames(
                'nexus-c-rights-matching-titles-table-wrapper',
                isDisabled && 'nexus-c-rights-matching-titles-table-wrapper--is-disabled'
            )}
        >
            <TitlesTable
                className="nexus-c-rights-matching-titles-table"
                columnDefs={[matchButton, duplicateButton, repository, ...updatedColumnDefs]}
                mapping={mappings}
                onGridEvent={onGridReady}
                initialFilter={{contentType}}
                setTotalCount={setTotalCount}
            />
        </div>
    );
};

RightsMatchingTitlesTable.propTypes = {
    restrictedCoreTitleIds: PropTypes.array,
    handleMatchClick: PropTypes.func,
    handleDuplicateClick: PropTypes.func,
    matchList: PropTypes.object,
    duplicateList: PropTypes.object,
    setTotalCount: PropTypes.func,
    contentType: PropTypes.string,
    setTitlesTableIsReady: PropTypes.func,
    isDisabled: PropTypes.bool,
};

RightsMatchingTitlesTable.defaultProps = {
    restrictedCoreTitleIds: [],
    handleMatchClick: () => null,
    handleDuplicateClick: () => null,
    duplicateList: {},
    matchList: {},
    setTotalCount: () => null,
    contentType: null,
    setTitlesTableIsReady: () => null,
    isDisabled: false,
};

export default RightsMatchingTitlesTable;
