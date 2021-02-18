import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {getLinkableColumnDefs} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withFilterableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSideBar';
import withSorting from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withSorting';
import classNames from 'classnames';
import {get} from 'lodash';
import {compose} from 'redux';
import './CandidatesList.scss';
import mappings from '../../../../../profile/titleMatchingMappings.json';
import {NexusTitle, NexusGrid} from '../../../../ui/elements';
import SelectedButton from '../../../avails/avails-table-toolbar/components/SelectedButton';
import MatchedCombinedTitlesTable from '../../../avails/matched-combined-titles-table/MatchedCombinedTitlesTable';
import {RIGHTS_TAB, RIGHTS_SELECTED_TAB} from '../../../avails/rights-repository/constants';
import constants from '../../../avails/title-matching/titleMatchingConstants';
import {getRepositoryName} from '../../../avails/utils';
import TitleSystems from '../../../legacy/constants/metadata/systems';
import {titleServiceManager} from '../../../legacy/containers/metadata/service/TitleServiceManager';
import {CANDIDATES_LIST_TITLE, CLEAR_FILTER} from '../constants';

const NexusGridWithInfiniteScrolling = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch}),
    withSorting()
)(NexusGrid);

const CandidatesList = ({columnDefs, titleId, queryParams, onCandidatesChange}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [gridApi, setGridApi] = useState();
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);
    const [matchList, setMatchList] = useState({});
    const [duplicateList, setDuplicateList] = useState({});

    // inform parent component about match, duplicate list change
    useEffect(() => {
        onCandidatesChange({matchList, duplicateList});
    }, [matchList, duplicateList, onCandidatesChange]);

    const matchButton = {
        ...constants.ADDITIONAL_COLUMN_DEF,
        colId: 'matchButton',
        field: 'matchButton',
        headerName: 'Master',
        checkboxSelection: params => {
            return !(getRepositoryName(get(params, 'data.id', '')) === TitleSystems.NEXUS);
        },
    };
    const duplicateButton = {
        ...constants.ADDITIONAL_COLUMN_DEF,
        colId: 'duplicateButton',
        field: 'duplicateButton',
        headerName: 'Duplicate',
        cellRendererParams: {isNexusDisabled: true},
        cellRenderer: 'checkboxRenderer',
        editable: true,
    };

    const onCellValueChanged = (params = {}) => {
        const {
            newValue,
            data: {id},
            data = {},
            node,
        } = params;
        const newList = {...duplicateList};
        const repo = getRepositoryName(id);
        if (newValue) {
            if (matchList[repo] && matchList[repo].id === id) {
                node.setDataValue('duplicateButton', false);
            } else {
                newList[id] = data;
            }
        } else {
            delete newList[id];
        }
        setDuplicateList(newList);
    };

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

    const onSelectionChanged = (params = {}) => {
        const {api = {}, node: {id, selected} = {}} = params;
        const repo = getRepositoryName(id);
        const newMatchList = {};
        if (selected) {
            api.getSelectedNodes().forEach(n => {
                const nodeRepo = getRepositoryName(n.id);
                if (n.id !== id && nodeRepo === repo) {
                    n.setSelected(false);
                } else {
                    newMatchList[nodeRepo] = n.data;
                }
            });
        } else {
            api.getSelectedNodes().forEach(n => {
                newMatchList[getRepositoryName(n.id)] = n.data;
            });
        }
        setMatchList(newMatchList);
    };

    const selectedItems = [...Object.values(matchList), ...Object.values(duplicateList)];

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
                        rowSelection="multiple"
                        suppressRowClickSelection
                        onRowSelected={onSelectionChanged}
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
    onCandidatesChange: PropTypes.func,
    titleId: PropTypes.string.isRequired,
};

CandidatesList.defaultProps = {
    queryParams: {},
    columnDefs: [],
    onCandidatesChange: () => null,
};

export default CandidatesList;
