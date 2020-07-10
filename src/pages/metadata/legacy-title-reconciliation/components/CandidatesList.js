import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import {Radio} from '@atlaskit/radio';
import Button from '@atlaskit/button';
import './CandidatesList.scss';
import {NexusTitle, NexusGrid} from '../../../../ui/elements/';
import {getLinkableColumnDefs} from '../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {titleServiceManager} from '../../../legacy/containers/metadata/service/TitleServiceManager';
import {CANDIDATES_LIST_TITLE, CLEAR_FILTER} from '../constants';
import TitleSystems from '../../../legacy/constants/metadata/systems';
import useMatchAndDuplicateList from '../hooks/useMatchAndDuplicateList';
import mappings from '../../../../../profile/titleMatchingMappings';
import {getRepositoryName} from '../../../avails/utils';
import constants from '../../../avails/title-matching/titleMatchingConstants';
import {RIGHTS_TAB, RIGHTS_SELECTED_TAB} from '../../../avails/rights-repository/RightsRepository';
import SelectedButton from '../../../../ui/elements/nexus-table-toolbar/components/SelectedButton';
import classNames from 'classnames';
import MatchedCombinedTitlesTable from '../../../avails/matched-combined-titles-table/MatchedCombinedTitlesTable';

const NexusGridWithInfiniteScrolling = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch}),
    withSorting(),
)(NexusGrid);

const CandidatesList = ({columnDefs, titleId, queryParams, onCandidatesChange}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [gridApi, setGridApi] = useState();
    const [activeTab, setActiveTab] = useState(RIGHTS_TAB);
    const {
        matchList,
        handleMatchClick,
        duplicateList,
        handleDuplicateClick,
    } = useMatchAndDuplicateList();

    // inform parent component about match, duplicate list change
    useEffect(() => {
        onCandidatesChange({matchList, duplicateList});
    }, [matchList, duplicateList]);

    const matchButtonCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const repo = getRepositoryName(id);

        return (
            repo !== TitleSystems.NEXUS && (
                <CustomActionsCellRenderer id={id}>
                    <Radio
                        name={repo}
                        isChecked={matchList[repo] && matchList[repo].id === id}
                        onChange={({target}) => handleMatchClick(data, repo, target.checked)}
                    />
                </CustomActionsCellRenderer>
            )
        );
    };

    const matchButton = {
        ...constants.ADDITIONAL_COLUMN_DEF,
        colId: 'matchButton',
        field: 'matchButton',
        headerName: 'Master',
        cellRendererParams: matchList,
        cellRendererFramework: matchButtonCell,
    };

    const duplicateButtonCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const repo = getRepositoryName(id);
        return (
            repo !== TitleSystems.NEXUS && (
                <CustomActionsCellRenderer id={id}>
                    <Checkbox
                        isChecked={duplicateList[id]}
                        onChange={({currentTarget}) => handleDuplicateClick(data, repo, currentTarget.checked)}
                    />
                </CustomActionsCellRenderer>
            )
        );
    };

    const duplicateButton = {
        ...constants.ADDITIONAL_COLUMN_DEF,
        colId: 'duplicateButton',
        field: 'duplicateButton',
        headerName: 'Duplicate',
        cellRendererParams: duplicateList,
        cellRendererFramework: duplicateButtonCell,
    };

    const updatedColumnDefs = getLinkableColumnDefs(columnDefs);

    const handleGridEvent = ({type, api, columnApi}) => {
        if (type === GRID_EVENTS.READY) {
            setGridApi(api);
            const directorIndex = columnApi.columnController.columnDefs.findIndex(({field}) => field === 'castCrew.director');
            columnApi.moveColumn('episodeAndSeasonNumber', directorIndex);
        }
    };

    const handleClearFilterClick = () => {
        if (gridApi) {
            gridApi.setFilterModel();
        }
    };

    const getMatchAndDuplicateItems = () => {
        return [...Object.values(matchList), ...Object.values(duplicateList)];
    };

    const selectedLength = getMatchAndDuplicateItems().length;

    return (
        <div className="nexus-c-candidates-list">
            <div className="nexus-c-candidates-list__header">
                <NexusTitle isSubTitle={true}>{`${CANDIDATES_LIST_TITLE} (${totalCount})`}</NexusTitle>
                <div className="nexus-c-candidates-toolbar">
                    <Button
                        className="nexus-c-button"
                        onClick={handleClearFilterClick}
                        isDisabled={!gridApi}
                    >
                        {CLEAR_FILTER}
                    </Button>
                    <SelectedButton
                        selectedRightsCount={selectedLength}
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
                        columnDefs={[
                            matchButton,
                            duplicateButton,
                            ...updatedColumnDefs,
                        ]}
                        rowClassRules={{'nexus-c-candidates-list__row' : params => params.node.id === titleId}}
                        setTotalCount={setTotalCount}
                        initialFilter={queryParams}
                        mapping={mappings}
                    />
                )}
            </div>
            <div
                className={classNames(
                    'nexus-c-candidates-selected-table',
                    activeTab === RIGHTS_SELECTED_TAB && 'nexus-c-candidates-selected-table--active'
                )}
            >
                <MatchedCombinedTitlesTable data={getMatchAndDuplicateItems()} isFullHeight />
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
