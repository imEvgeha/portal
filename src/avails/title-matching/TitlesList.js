import React from 'react';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import NexusTitle from '../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {titleServiceManager} from '../../containers/metadata/service/TitleServiceManager';
import CustomActionsCellRenderer from '../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import ActionsBar from './titleMatchingActionsBar.js';
import Constants from './titleMatchingConstants';

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

class TitlesList extends React.PureComponent {

    constructor () {
        super();
        this.state = {
            totalCount: 0,
            matchList: {},
            duplicateList: {},
        };
    }

    setTotalCount = (totalCount) => {
        this.setState({totalCount});
    };

    matchClickHandler = (id, repo, checked) => {
        if(checked) {
            const {NEXUS, VZ, MOVIDA} = Constants.repository;
            const { duplicateList, matchList} = this.state;
            const newMatchList = {...matchList};
            if(duplicateList[id]){
                let list = {...duplicateList};
                delete list[id];
                this.setState({duplicateList: list});
            }

            if(repo === NEXUS){
                delete newMatchList[VZ];
                delete newMatchList[MOVIDA];
            }
            else{
                delete newMatchList[NEXUS];
            }
            newMatchList[repo] = id;
            this.setState({ matchList: newMatchList });
        }
    };
    matchButtonCell = ({data}) => {
        const {id, legacyIds} = data || {};
        const repoName = getRepositoryName(legacyIds);
        return (
            <CustomActionsCellRenderer id={id} >
                <input type={'radio'} name={repoName}
                       checked={this.state.matchList[repoName] === id}
                       onChange={event => this.matchClickHandler(id, repoName, event.target.checked)}/>
            </CustomActionsCellRenderer>
        );
    };

    duplicateClickHandler = (id, name, checked) => {
        const { duplicateList, matchList } = this.state;
        if(checked) {
            if(matchList[name] === id) {
                let list = {...matchList};
                delete list[name];
                this.setState({matchList: list});
            }
            this.setState({
                duplicateList: {
                    ...duplicateList,
                    [id]: name
                }
            });
        }
        else {
            let list = {...duplicateList};
            delete list[id];
            this.setState({ duplicateList: list });
        }
    };
    duplicateButtonCell = ({data}) => {
        const {id, legacyIds} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <Checkbox
                    isChecked={this.state.duplicateList[id]}
                    onChange={event => this.duplicateClickHandler(id,
                        getRepositoryName(legacyIds), event.currentTarget.checked)}/>
            </CustomActionsCellRenderer>
        );
    };

    repositoryCell = ({data}) => {
        const {id, legacyIds} = data || {};
        return (
            <CustomActionsCellRenderer id={id}>
                <div className="nexus-c-custom-actions-cell-renderer">{getRepositoryName(legacyIds).toUpperCase()}</div>
            </CustomActionsCellRenderer>
        );
    };

    render(){
        const {totalCount, duplicateList, matchList} = this.state;
        const matchButton = {
            ...Constants.ADDITIONAL_COLUMN_DEF,
            colId: 'matchButton',
            field: 'matchButton',
            headerName: 'Match',
            cellRendererParams: matchList,
            cellRendererFramework: this.matchButtonCell,
        };
        const duplicateButton = {
            ...Constants.ADDITIONAL_COLUMN_DEF,
            colId: 'duplicateButton',
            field: 'duplicateButton',
            headerName: 'Duplicate',
            cellRendererParams: duplicateList,
            cellRendererFramework: this.duplicateButtonCell,
        };
        const repository = {
            ...Constants.ADDITIONAL_COLUMN_DEF,
            colId: 'repository',
            field: 'repository',
            headerName: 'Repository',
            cellRendererFramework: this.repositoryCell,
        };

        return (
            <React.Fragment>
                <NexusTitle>Title Repositories ({totalCount})</NexusTitle>
                <NexusGridWithInfiniteScrolling
                    columnDefs={[matchButton, duplicateButton, repository, ...this.props.columnDefs]}
                    setTotalCount={this.setTotalCount} />
                    <ActionsBar matchList={matchList} duplicateList={duplicateList} />
            </React.Fragment>
        );
    }
}

TitlesList.propTypes = {
    columnDefs: PropTypes.array,
};

TitlesList.defaultProps = {
    columnDefs: [],
};

export default TitlesList;