import React, {useState} from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import {Checkbox} from '@atlaskit/checkbox';
import { Radio } from '@atlaskit/radio';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {titleServiceManager} from '../../../containers/metadata/service/TitleServiceManager';
import CustomActionsCellRenderer from '../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import ActionsBar from './ActionsBar.js';
import {getRepositoryName, getRepositoryCell, createLinkableCellRenderer} from '../../utils';
import Constants from '../titleMatchingConstants';
import TitleSystems from '../../../constants/metadata/systems';
import useMatchAndDuplicateList from '../../../metadata/legacy-title-reconciliation/hooks/useMatchAndDuplicateList';
import {defineEpisodeAndSeasonNumberColumn, getLinkableColumnDefs} from '../../../ui-elements/nexus-grid/elements/columnDefinitions';
import {GRID_EVENTS} from '../../../ui-elements/nexus-grid/constants';
import withFilterableColumns from '../../../ui-elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../../ui-elements/nexus-grid/hoc/withSideBar';
import mappings from '../../../../profile/titleMatchingMappings';

const TitleRepositoriesTable = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch})
)(NexusGrid);

const TitlesList = ({columnDefs, mergeTitles, rightId, queryParams}) => {
    const [totalCount, setTotalCount] = useState(0);
    const {matchList, handleMatchClick, duplicateList, handleDuplicateClick} = useMatchAndDuplicateList();

    const matchButtonCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const repoName = getRepositoryName(id);
        return (
            <CustomActionsCellRenderer id={id}>
                <Radio
                    name={repoName}
                    isChecked={matchList[repoName] && matchList[repoName].id === id}
                    onChange={event => handleMatchClick(data, repoName, event.target.checked)}
                />
            </CustomActionsCellRenderer>
        );
    };

    const duplicateButtonCell = ({data}) => { // eslint-disable-line
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

    const onGridReady = ({type, columnApi}) => {
        if (GRID_EVENTS.READY === type) {
            const contentTypeIndex = updatedColumnDefs.findIndex(e => e.field === 'contentType');
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + 3); // +3 indicates pinned columns on the left side
        }
    };

    const numOfEpisodeAndSeasonField = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = getLinkableColumnDefs([numOfEpisodeAndSeasonField, ...columnDefs]);
    const repository = getRepositoryCell();

    return (
        <React.Fragment>
            <NexusTitle isSubTitle={true}>Title Repositories ({totalCount})</NexusTitle>
            <TitleRepositoriesTable
                onGridEvent={onGridReady}
                columnDefs={[matchButton, duplicateButton, repository, ...updatedColumnDefs]}
                setTotalCount={setTotalCount}
                initialFilter={queryParams}
                mapping={mappings}
            />
            <ActionsBar
                rightId={rightId}
                matchList={matchList}
                mergeTitles={() => mergeTitles(matchList, duplicateList, rightId)}
            />
        </React.Fragment>
    );
};

TitlesList.propTypes = {
    columnDefs: PropTypes.array,
    mergeTitles: PropTypes.func,
    queryParams: PropTypes.object,
    rightId: PropTypes.string.isRequired,
};

TitlesList.defaultProps = {
    columnDefs: [],
    mergeTitles: () => null,
    queryParams: {},
};

export default TitlesList;
