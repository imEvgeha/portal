import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
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
import {titleServiceManager} from '../../../legacy/containers/metadata/service/TitleServiceManager';
import SelectedButton from '../../avails-table-toolbar/components/SelectedButton';
import MatchedCombinedTitlesTable from '../../matched-combined-titles-table/MatchedCombinedTitlesTable';
import {RIGHTS_TAB, RIGHTS_SELECTED_TAB} from '../../rights-repository/constants';
import {getRepositoryCell} from '../../utils';
import ActionsBar from './ActionsBar';
import './TitlesList.scss';

const TitleRepositoriesTable = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch}),
    withSorting()
)(NexusGrid);

const TitlesList = ({
    columnDefs,
    mergeTitles,
    rightId,
    queryParams,
    matchButton,
    duplicateButton,
    onCellValueChanged,
    selectedItems,
    matchList,
    duplicateList,
    isMerging,
}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);

    const onGridReady = ({type, columnApi}) => {
        if (GRID_EVENTS.READY === type) {
            const contentTypeIndex = updatedColumnDefs.findIndex(e => e.field === 'contentType');
            const PINNED_COLUMNS_NUMBER = 3;
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + PINNED_COLUMNS_NUMBER);
        }
    };

    const numOfEpisodeAndSeasonField = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = getLinkableColumnDefs([numOfEpisodeAndSeasonField, ...columnDefs]);
    const repository = getRepositoryCell();
    const columnDefsClone = updatedColumnDefs.map(columnDef => {
        if (!['releaseYear', 'contentType', 'title'].includes(columnDef.colId)) {
            columnDef.sortable = false;
        }
        return columnDef;
    });

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
                    columnDefs={[matchButton, duplicateButton, repository, ...columnDefsClone]}
                    setTotalCount={setTotalCount}
                    initialFilter={queryParams}
                    mapping={mappings}
                    onCellValueChanged={onCellValueChanged}
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
                isMerging={isMerging}
            />
        </>
    );
};

TitlesList.propTypes = {
    columnDefs: PropTypes.array,
    mergeTitles: PropTypes.func,
    queryParams: PropTypes.object,
    rightId: PropTypes.string.isRequired,
    onCellValueChanged: PropTypes.func,
    matchButton: PropTypes.object,
    duplicateButton: PropTypes.object,
    selectedItems: PropTypes.array,
    matchList: PropTypes.object,
    duplicateList: PropTypes.object,
    isMerging: PropTypes.bool,
};

TitlesList.defaultProps = {
    columnDefs: [],
    mergeTitles: () => null,
    queryParams: {},
    onCellValueChanged: () => null,
    matchButton: {},
    duplicateButton: {},
    selectedItems: [],
    matchList: {},
    duplicateList: {},
    isMerging: false,
};

export default TitlesList;
