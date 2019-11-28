import React, {useState} from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
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
import {deepClone} from '../../../util/Common';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling(titleServiceManager.doSearch)(NexusGrid));

const TitlesList = ({columnDefs, mergeTitles, rightId}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [matchList, setMatchList] = useState({});
    const [duplicateList, setDuplicateList] = useState({});

    const matchClickHandler = (data, repo, checked) => {
        const {id} = data || {};
        if(checked) {
            const {NEXUS, VZ, MOVIDA} = Constants.repository;
            const newMatchList = {...matchList};
            if(duplicateList[id]){
                let list = {...duplicateList};
                delete list[id];
                setDuplicateList(list);
            }

            if(repo === NEXUS){
                delete newMatchList[VZ];
                delete newMatchList[MOVIDA];
            }
            else{
                delete newMatchList[NEXUS];
            }
            newMatchList[repo] = data;
            setMatchList(newMatchList);
        }
    };
    const matchButtonCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const repoName = getRepositoryName(id);
        return (
            <CustomActionsCellRenderer id={id} >
                <Radio
                    name={repoName}
                    isChecked={matchList[repoName] && matchList[repoName].id === id}
                    onChange={event => matchClickHandler(data, repoName, event.target.checked)}
                />
            </CustomActionsCellRenderer>
        );
    };

    const duplicateClickHandler = (id, name, checked) => {
        if(checked) {
            if(matchList[name] && matchList[name].id === id) {
                let list = {...matchList};
                delete list[name];
                setMatchList(list);
            }
            setDuplicateList({
                ...duplicateList,
                [id]: name
            });
        }
        else {
            let list = {...duplicateList};
            delete list[id];
            setDuplicateList(list);
        }
    };
    const duplicateButtonCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};
        const repo = getRepositoryName(id);
        return (
            repo !== Constants.repository.NEXUS && (
                <CustomActionsCellRenderer id={id}>
                    <Checkbox
                        isChecked={duplicateList[id]}
                        onChange={event => duplicateClickHandler(id, repo, event.currentTarget.checked)}/>
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
    
    
    let deepCloneColumnDefs = deepClone(columnDefs);
    const handleTitleMatchingRedirect = params => {
        return createLinkableCellRenderer(params);
    };
    let updatedColumnDefs = deepCloneColumnDefs.map(e => {
        if(e.cellRenderer) e.cellRenderer = handleTitleMatchingRedirect;
        return e;
    });

    const renderEpisodeAndSeasonNumber = params => {
        const {data: {contentType, episodic: {episodeNumber, seasonNumber}}} = params;
        if(contentType === 'EPISODE') return episodeNumber;
        else if(contentType === 'SEASON') return seasonNumber;
        else return null;
    };

    const numOfEpisodeAndSeasonField = {
        colId: 'episodeAndSeasonNumber',
        field: 'episodeAndSeasonNumber',
        headerName: '-',
        valueFormatter: renderEpisodeAndSeasonNumber,
        cellRenderer: handleTitleMatchingRedirect,
        width: 100
        
    };

    const onGridReady = (params) => {
        const {columnApi} = params;
        const contentTypeIndex = updatedColumnDefs.findIndex(e => e.field === 'contentType');
        columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + 4); // +3 indicates pinned columns on the left side
    };

    
    const repository = getRepositoryCell();
    return (
        <React.Fragment>
            <NexusTitle isSubTitle={true}>Title Repositories ({totalCount})</NexusTitle>
            <NexusGridWithInfiniteScrolling
                onGridEvent={onGridReady}
                columnDefs={[matchButton, duplicateButton, numOfEpisodeAndSeasonField, repository, ...updatedColumnDefs]}
                setTotalCount={setTotalCount}/>
            <ActionsBar
                rightId={rightId}
                matchList={matchList}
                mergeTitles={() => mergeTitles(matchList, duplicateList)}/>
        </React.Fragment>
    );
};

TitlesList.propTypes = {
    columnDefs: PropTypes.array,
    mergeTitles: PropTypes.func,
    rightId: PropTypes.string.isRequired,
};

TitlesList.defaultProps = {
    columnDefs: [],
    mergeTitles: () => null,
};

export default TitlesList;