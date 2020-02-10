import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import {Checkbox} from '@atlaskit/checkbox';
import {Radio} from '@atlaskit/radio';
import Button from '@atlaskit/button';
import './CandidatesList.scss';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {titleService} from '../../../containers/metadata/service/TitleService';
import CustomActionsCellRenderer from '../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {getRepositoryName, getRepositoryCell, createLinkableCellRenderer} from '../../../avails/utils';
import constants from '../../../avails/title-matching/titleMatchingConstants';
import {CANDIDATES_LIST_TITLE, CLEAR_FILTER} from '../constants';
import {GRID_EVENTS} from '../../../ui-elements/nexus-grid/constants';
import {getLinkableColumnDefs} from '../../../ui-elements/nexus-grid/elements/columnDefinitions';
import useMatchAndDuplicateList from '../hooks/useMatchAndDuplicateList';
import withFilterableColumns from '../../../ui-elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../../ui-elements/nexus-grid/hoc/withSideBar';
import mappings from '../../../../profile/titleMatchingMappings';

const NexusGridWithInfiniteScrolling = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: titleService.freeTextSearchWithGenres})
)(NexusGrid);

const CandidatesList = ({columnDefs, titleId, queryParams, onCandidatesChange}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [gridApi, setGridApi] = useState();
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
            repo !== constants.repository.NEXUS && (
                <CustomActionsCellRenderer id={id} >
                    <Radio
                        name={repo}
                        isChecked={matchList[repo] && matchList[repo].id === id}
                        onChange={({target}) => handleMatchClick(data, repo, target.checked)}
                        isDisabled={!gridApi}
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
            repo !== constants.repository.NEXUS && (
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
            const contentTypeIndex = updatedColumnDefs.findIndex(({field}) => field === 'contentType');
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + 3); // +3 indicates pinned columns on the left side
        }
    };

    const handleClearFilterClick = () => {
        console.log('clear')
    };

    return (
        <div className="nexus-c-candidates-list">
            <div className="nexus-c-candidates-list__header">
                <NexusTitle isSubTitle={true}>{`${CANDIDATES_LIST_TITLE} (${totalCount})`}</NexusTitle>
                <Button
                    className="nexus-c-button"
                    appearance="primary"
                    onClick={handleClearFilterClick}
                >
                    {CLEAR_FILTER}
                </Button>
            </div>
            {queryParams.title && (
                <NexusGridWithInfiniteScrolling
                    onGridEvent={handleGridEvent}
                    columnDefs={[
                        matchButton,
                        duplicateButton,
                        getRepositoryCell({headerName: 'System'}),
                        ...updatedColumnDefs,
                    ]}
                    rowClassRules={{'nexus-c-candidates-list__row' : params => params.node.id === titleId}}
                    setTotalCount={setTotalCount}
                    params={queryParams}
                    mapping={mappings}
                />
            )}
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
