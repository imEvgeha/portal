import React, {useState} from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {titleServiceManager} from '../../../containers/metadata/service/TitleServiceManager';
import CustomActionsCellRenderer from '../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import ActionsBar from './titleMatchingActionsBar.js';
import Constants from '../titleMatchingConstants';

const NexusGridWithInfiniteScrolling = compose(withInfiniteScrolling(titleServiceManager.doSearch)(NexusGrid));
const getRepositoryName = legacy => {
  const {NEXUS, MOVIDA, VZ} = Constants.repository;
  if(legacy) {
      return legacy[MOVIDA] ? MOVIDA : VZ;
  }
  if(legacy === null) {
      return NEXUS;
  }
  return '';
};

const TitlesList = ({columnDefs, selectTitles}) => {
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
        const {id, legacyIds} = data || {};
        const repoName = getRepositoryName(legacyIds);
        return (
            <CustomActionsCellRenderer id={id} >
                <input type={'radio'} name={repoName}
                       checked={matchList[repoName] && matchList[repoName].id === id}
                       onChange={event => matchClickHandler(data, repoName, event.target.checked)}/>
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
        const {id, legacyIds} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Checkbox
                    isChecked={duplicateList[id]}
                    onChange={event => duplicateClickHandler(id,
                        getRepositoryName(legacyIds), event.currentTarget.checked)}/>
            </CustomActionsCellRenderer>
        );
    };

    const repositoryCell = ({data}) => {// eslint-disable-line
        const {id, legacyIds} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <div className="nexus-c-custom-actions-cell-renderer">{getRepositoryName(legacyIds).toUpperCase()}</div>
            </CustomActionsCellRenderer>
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
    const repository = {
        ...Constants.ADDITIONAL_COLUMN_DEF,
        colId: 'repository',
        field: 'repository',
        headerName: 'Repository',
        cellRendererFramework: repositoryCell,
    };
    return (
        <React.Fragment>
            <NexusTitle>Title Repositories ({totalCount})</NexusTitle>
            <NexusGridWithInfiniteScrolling
                columnDefs={[matchButton, duplicateButton, repository, ...columnDefs]}
                setTotalCount={setTotalCount}/>
            <ActionsBar matchList={matchList}
                        selectTitles={() => selectTitles(matchList, duplicateList)}/>
        </React.Fragment>
    );
};

TitlesList.propTypes = {
    columnDefs: PropTypes.array,
    selectTitles: PropTypes.func,
};

TitlesList.defaultProps = {
    columnDefs: [],
    selectTitles: () => null,
};

export default TitlesList;