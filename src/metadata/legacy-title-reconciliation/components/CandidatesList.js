import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import {Checkbox} from '@atlaskit/checkbox';
import {Radio} from '@atlaskit/radio';
import './CandidatesList.scss';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {titleService} from '../../../containers/metadata/service/TitleService';
import CustomActionsCellRenderer from '../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {getRepositoryName, getRepositoryCell, createLinkableCellRenderer} from '../../../avails/utils';
import constants from '../../../avails/title-matching/titleMatchingConstants';
import {CANDIDATES_LIST_TITLE} from '../constants';
import {GRID_EVENTS} from '../../../ui-elements/nexus-grid/constants';
import {getLinkableColumnDefs} from '../../../ui-elements/nexus-grid/elements/columnDefinitions';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling({fetchData: titleService.freeTextSearchWithGenres}))(NexusGrid);

const CandidatesList = ({columnDefs, mergeTitles, titleId, queryParams, onDataChange}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [matchList, setMatchList] = useState({});
    const [duplicateList, setDuplicateList] = useState({});

    // inform parent about match and duplicate list change
    useEffect(() => {
        onDataChange({matchList, duplicateList});
    }, [matchList, duplicateList]);

    const handleMatchClick = (data, repo, checked) => {
        const {id} = data || {};
        if (checked) {
            const {VZ, MOVIDA} = constants.repository;
            let newMatchList = {...matchList};
            
            if (duplicateList[id]){
                let list = {...duplicateList};
                delete list[id];
                setDuplicateList(list);
            }

            newMatchList[repo] = data;
            setMatchList(newMatchList);
        }
    };
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
                    />
                </CustomActionsCellRenderer>
            )
        );
    };

    const handleDuplicateClick = (id, name, checked) => {
        if (checked) {
            if (matchList[name] && matchList[name].id === id) {
                let list = {...matchList};
                delete list[name];
                setMatchList(list);
            }

            setDuplicateList({
                ...duplicateList,
                [id]: name
            });
            return;
        }

        let list = {...duplicateList};
        delete list[id];
        setDuplicateList(list);

    };

    const duplicateButtonCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const repo = getRepositoryName(id);
        return (
            repo !== constants.repository.NEXUS && (
                <CustomActionsCellRenderer id={id}>
                    <Checkbox
                        isChecked={duplicateList[id]}
                        onChange={({currentTarget}) => handleDuplicateClick(id, repo, currentTarget.checked)}
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
    const duplicateButton = {
        ...constants.ADDITIONAL_COLUMN_DEF,
        colId: 'duplicateButton',
        field: 'duplicateButton',
        headerName: 'Duplicate',
        cellRendererParams: duplicateList,
        cellRendererFramework: duplicateButtonCell,
    }; 

    const handleTitleMatchingRedirect = params => createLinkableCellRenderer(params);

    const renderEpisodeAndSeasonNumber = params => {
        const {data = {}} = params || {};
        const {contentType, episodic = {}} = data || {};
        if (contentType === 'EPISODE') {
            return episodic.episodeNumber;
        } else if (contentType === 'SEASON') {
            return episodic.seasonNumber;
        }
    };

    const numOfEpisodeAndSeasonField = {
        colId: 'episodeAndSeasonNumber',
        field: 'episodeAndSeasonNumber',
        headerName: '-',
        valueFormatter: renderEpisodeAndSeasonNumber,
        cellRenderer: handleTitleMatchingRedirect,
        width: 100
    };

    const updatedColumnDefs = getLinkableColumnDefs(columnDefs);

    const onGridEvent = ({type, columnApi}) => {
        if (type === GRID_EVENTS.READY) {
            const contentTypeIndex = updatedColumnDefs.findIndex(({field}) => field === 'contentType');
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + 4); // +3 indicates pinned columns on the left side
        }
    };


    return (
        <div className="nexus-c-candidates-list">
            <NexusTitle isSubTitle={true}>{`${CANDIDATES_LIST_TITLE} (${totalCount})`}</NexusTitle>
            {queryParams.title && (
                <NexusGridWithInfiniteScrolling
                    onGridEvent={onGridEvent}
                    columnDefs={[
                        matchButton,
                        duplicateButton,
                        numOfEpisodeAndSeasonField,
                        getRepositoryCell({headerName: 'System'}),
                        ...updatedColumnDefs,
                    ]}
                    rowClassRules={{'nexus-c-candidates-list__row' : params => params.node.id === titleId}}
                    setTotalCount={setTotalCount}
                    params={queryParams}
                />
            )}
        </div>
    );
};

CandidatesList.propTypes = {
    queryParams: PropTypes.object,
    columnDefs: PropTypes.array,
    mergeTitles: PropTypes.func,
    onDataChange: PropTypes.func,
    titleId: PropTypes.string.isRequired,
};

CandidatesList.defaultProps = {
    queryParams: {},
    columnDefs: [],
    mergeTitles: () => null,
    onDataChange: () => null,
};

export default CandidatesList;
