import React, {useState} from 'react';
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

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling({fetchData: titleService.freeTextSearch}))(NexusGrid);

const CandidatesList = ({columnDefs, mergeTitles, rightId, queryParams}) => {
    const [totalCount, setTotalCount] = useState(0);
    const [matchList, setMatchList] = useState({});
    const [duplicateList, setDuplicateList] = useState({});

    const matchClickHandler = (data, repo, checked) => {
        const {id} = data || {};
        if(checked) {
            const {NEXUS, VZ, MOVIDA} = constants.repository;
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
            repo !== constants.repository.NEXUS && (
                <CustomActionsCellRenderer id={id}>
                    <Checkbox
                        isChecked={duplicateList[id]}
                        onChange={event => duplicateClickHandler(id, repo, event.currentTarget.checked)}
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
    let deepCloneColumnDefs = cloneDeep(columnDefs);
    const handleTitleMatchingRedirect = params => {
        return createLinkableCellRenderer(params);
    };
    let updatedColumnDefs = deepCloneColumnDefs.map(e => {
        if(e.cellRenderer) e.cellRenderer = handleTitleMatchingRedirect;
        return e;
    });

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

    const onGridEvent = ({type, columnApi}) => {
        if (type === GRID_EVENTS.READY) {
            const contentTypeIndex = updatedColumnDefs.findIndex(({field}) => field === 'contentType');
            columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + 4); // +3 indicates pinned columns on the left side
        }
    };

    // TODO: REFACTOR THIS
    const addGenresToTitle = (titles, successCallback) => {
        titles.forEach(title => {
            titleService.getEditorialMetadataByTitleId(title.id).then(({data}) => {
                const founded = data.find(el => el.locale==='US' && (el.language ==='English' || el.language ==='en'));
                if(founded) {
                    title['editorialGenres'] = founded.genres;
                }
                successCallback(titles);
            });
        });
    };

    return (
        <div className="nexus-c-candidates-list">
            <NexusTitle isSubTitle={true}>{`${CANDIDATES_LIST_TITLE} (${totalCount})`}</NexusTitle>
            {queryParams.title && (
                <NexusGridWithInfiniteScrolling
                    onGridEvent={onGridEvent}
                    onAddAdditionalField={addGenresToTitle}
                    columnDefs={[
                        matchButton,
                        duplicateButton,
                        numOfEpisodeAndSeasonField,
                        getRepositoryCell({headerName: 'System'}),
                        ...updatedColumnDefs
                    ]}
                    setTotalCount={setTotalCount}
                    params={queryParams}
                />
            )}
        </div>
    );
};

CandidatesList.propTypes = {
    columnDefs: PropTypes.array,
    mergeTitles: PropTypes.func,
    queryParams: PropTypes.object,
    rightId: PropTypes.string.isRequired,
};

CandidatesList.defaultProps = {
    columnDefs: [],
    mergeTitles: () => null,
    queryParams: {},
};

export default CandidatesList;
