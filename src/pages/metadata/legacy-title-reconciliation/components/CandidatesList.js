import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {getLinkableColumnDefs} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import classNames from 'classnames';
import {compose} from 'redux';
import './CandidatesList.scss';
import mappings from '../../../../../profile/titleMatchingMappings.json';
import {NexusTitle, NexusGrid} from '../../../../ui/elements';
import SelectedButton from '../../../avails/avails-table-toolbar/components/SelectedButton';
import MatchedCombinedTitlesTable from '../../../avails/matched-combined-titles-table/MatchedCombinedTitlesTable';
import {RIGHTS_TAB, RIGHTS_SELECTED_TAB} from '../../../avails/rights-repository/constants';
import {titleServiceManager} from '../../../legacy/containers/metadata/service/TitleServiceManager';
import {CANDIDATES_LIST_TITLE, CLEAR_FILTER} from '../constants';

const NexusGridWithInfiniteScrolling = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch}),
    withSorting()
)(NexusGrid);

const CandidatesList = ({
    columnDefs,
    titleId,
    queryParams,
    matchButton,
    duplicateButton,
    onCellValueChanged,
    selectedItems,
}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [gridApi, setGridApi] = useState();
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);

    const updatedColumnDefs = getLinkableColumnDefs(columnDefs);

    const handleGridEvent = ({type, api, columnApi}) => {
        if (type === GRID_EVENTS.READY) {
            setGridApi(api);
            const directorIndex = columnApi.columnController.columnDefs.findIndex(
                ({field}) => field === 'castCrew.director'
            );
            columnApi.moveColumn('episodeAndSeasonNumber', directorIndex);
        }
    };

    const handleClearFilterClick = () => {
        if (gridApi) {
            gridApi.setFilterModel();
        }
    };

    return (
        <div className="nexus-c-candidates-list">
            <div className="nexus-c-candidates-list__header">
                <NexusTitle isSubTitle={true}>{`${CANDIDATES_LIST_TITLE} (${totalCount})`}</NexusTitle>
                <div className="nexus-c-candidates-toolbar">
                    <Button className="nexus-c-button" onClick={handleClearFilterClick} isDisabled={!gridApi}>
                        {CLEAR_FILTER}
                    </Button>
                    <SelectedButton
                        selectedRightsCount={selectedItems.length}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>
            </div>
            <div
                className={classNames(
                    'nexus-c-candidates-titles-table',
                    activeTab === RIGHTS_TAB && 'nexus-c-candidates-titles-table--active'
                )}
            >
                {queryParams.title && (
                    <NexusGridWithInfiniteScrolling
                        onGridEvent={handleGridEvent}
                        columnDefs={[matchButton, duplicateButton, ...updatedColumnDefs]}
                        rowClassRules={{'nexus-c-candidates-list__row': params => params.node.id === titleId}}
                        setTotalCount={setTotalCount}
                        initialFilter={queryParams}
                        mapping={mappings}
                        onCellValueChanged={onCellValueChanged}
                    />
                )}
            </div>
            <div
                className={classNames(
                    'nexus-c-candidates-selected-table',
                    activeTab === RIGHTS_SELECTED_TAB && 'nexus-c-candidates-selected-table--active'
                )}
            >
                <MatchedCombinedTitlesTable data={selectedItems} isFullHeight />
            </div>
        </div>
    );
};

CandidatesList.propTypes = {
    queryParams: PropTypes.object,
    columnDefs: PropTypes.array,
    titleId: PropTypes.string.isRequired,
    onCellValueChanged: PropTypes.func,
    matchButton: PropTypes.object,
    duplicateButton: PropTypes.object,
    selectedItems: PropTypes.array,
};

CandidatesList.defaultProps = {
    queryParams: {},
    columnDefs: [],
    onCellValueChanged: () => null,
    matchButton: {},
    duplicateButton: {},
    selectedItems: [],
};

export default CandidatesList;
