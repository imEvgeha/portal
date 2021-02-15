import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {Radio} from '@atlaskit/radio';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {
    defineEpisodeAndSeasonNumberColumn,
    getLinkableColumnDefs,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import classNames from 'classnames';
import {compose} from 'redux';
import mappings from '../../../../../profile/titleMatchingMappings.json';
import {NexusTitle, NexusGrid} from '../../../../ui/elements';
import TitleSystems from '../../../legacy/constants/metadata/systems';
import {titleServiceManager} from '../../../legacy/containers/metadata/service/TitleServiceManager';
import useMatchAndDuplicateList from '../../../metadata/legacy-title-reconciliation/hooks/useMatchAndDuplicateList';
import SelectedButton from '../../avails-table-toolbar/components/SelectedButton';
import MatchedCombinedTitlesTable from '../../matched-combined-titles-table/MatchedCombinedTitlesTable';
import {RIGHTS_TAB, RIGHTS_SELECTED_TAB} from '../../rights-repository/constants';
import {getRepositoryName, getRepositoryCell} from '../../utils';
import Constants from '../titleMatchingConstants';
import ActionsBar from './ActionsBar';
import './TitlesList.scss';

const TitleRepositoriesTable = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch}),
    withSorting()
)(NexusGrid);

const TitlesList = ({columnDefs, mergeTitles, rightId, queryParams}) => {
    const [totalCount, setTotalCount] = useState(0);
    const {matchList, handleMatchClick, duplicateList, handleDuplicateClick} = useMatchAndDuplicateList();
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);

    // eslint-disable-next-line
    const matchButtonCell = ({data}) => {
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

    // eslint-disable-next-line
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
            const PINNED_COLUMNS_NUMBER = 3;
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + PINNED_COLUMNS_NUMBER);
        }
    };

    const selectedItems = [...Object.values(matchList), ...Object.values(duplicateList)];

    const numOfEpisodeAndSeasonField = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = getLinkableColumnDefs([numOfEpisodeAndSeasonField, ...columnDefs]);
    const repository = getRepositoryCell();

    const contentTypeIndex = updatedColumnDefs.findIndex(e => e.field === 'contentType');
    if (contentTypeIndex !== -1) {
        updatedColumnDefs[contentTypeIndex]['sortable'] = false;
    }

    return (
        <>
            <div className="nexus-c-single-title-match-toolbar">
                <NexusTitle isSubTitle={true}>Title Repositories ({totalCount})</NexusTitle>
                <SelectedButton
                    selectedRightsCount={selectedItems.length}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
            <div
                className={classNames(
                    'nexus-c-single-matching__titles-table',
                    activeTab === RIGHTS_TAB && 'nexus-c-single-matching__titles-table--active'
                )}
            >
                <TitleRepositoriesTable
                    id="titleMatchigRepo"
                    onGridEvent={onGridReady}
                    columnDefs={[matchButton, duplicateButton, repository, ...updatedColumnDefs]}
                    setTotalCount={setTotalCount}
                    initialFilter={queryParams}
                    mapping={mappings}
                />
            </div>
            <div
                className={classNames(
                    'nexus-c-single-matching__selected-table',
                    activeTab === RIGHTS_SELECTED_TAB && 'nexus-c-single-matching__selected-table--active'
                )}
            >
                <MatchedCombinedTitlesTable data={selectedItems} isFullHeight />
            </div>

            <ActionsBar
                rightId={rightId}
                matchList={matchList}
                mergeTitles={() => mergeTitles(matchList, duplicateList, rightId)}
            />
        </>
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
