import React from 'react';
import PropTypes from 'prop-types';
import {Restricted} from '@portal/portal-auth/permissions';
import {Button} from '@portal/portal-components';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {connect} from 'react-redux';
import './TitleMetadataRepoSelectsAndButtons.scss';
import {TABLE_LABELS, TABLE_OPTIONS} from '../../constants';
import {setCurrentUserViewAction} from '../../titleMetadataActions';
import {createCurrentUserViewSelector} from '../../titleMetadataSelectors';

export const RepositorySelectsAndButtons = ({
    getNameOfCurrentTab,
    gridApi,
    columnApi,
    username,
    userDefinedGridStates,
    setUserDefinedGridState,
    applyPredefinedTableView,
    lastStoredFilter,
    setBlockLastFilter,
    setShowModal,
    currentUserView,
    setCurrentUserView,
}) => {
    if (getNameOfCurrentTab() === 'repository') {
        return (
            <div className="row nexus-c-title-metadata__select-container">
                <div className="d-flex justify-content-end col-xs-12 col-xl-10 col-xxl-11">
                    <NexusSavedTableDropdown
                        gridApi={gridApi}
                        columnApi={columnApi}
                        username={username}
                        userDefinedGridStates={userDefinedGridStates}
                        setUserDefinedGridState={setUserDefinedGridState}
                        applyPredefinedTableView={applyPredefinedTableView}
                        tableLabels={TABLE_LABELS}
                        tableOptions={TABLE_OPTIONS}
                        lastStoredFilter={lastStoredFilter}
                        setBlockLastFilter={setBlockLastFilter}
                        isTitleMetadata={true}
                        setCurrentUserView={payload => setCurrentUserView(payload)}
                        currentUserView={currentUserView}
                    />
                </div>
                <div className="d-flex align-items-center justify-content-end col-xs-12 col-xl-2 col-xxl-1">
                    <Restricted resource="createNewTitleButton">
                        <Button
                            tooltip="Create New Title"
                            tooltipOptions={{position: 'left'}}
                            icon="po po-add"
                            onClick={() => setShowModal(true)}
                            className="p-button-text nexus-c-title-metadata__create-btn"
                        />
                    </Restricted>
                </div>
            </div>
        );
    }

    return null;
};

const mapStateToProps = () => {
    const currentUserView = createCurrentUserViewSelector();

    return state => ({
        currentUserView: currentUserView(state),
    });
};

const mapDispatchToProps = dispatch => ({
    setCurrentUserView: payload => dispatch(setCurrentUserViewAction(payload)),
});

RepositorySelectsAndButtons.propTypes = {
    getNameOfCurrentTab: PropTypes.func,
    gridApi: PropTypes.any,
    columnApi: PropTypes.any,
    username: PropTypes.string,
    userDefinedGridStates: PropTypes.array,
    setUserDefinedGridState: PropTypes.func,
    applyPredefinedTableView: PropTypes.func,
    lastStoredFilter: PropTypes.object,
    setBlockLastFilter: PropTypes.func,
    setShowModal: PropTypes.func,
    setCurrentUserView: PropTypes.func.isRequired,
    currentUserView: PropTypes.object.isRequired,
};

RepositorySelectsAndButtons.defaultProps = {
    getNameOfCurrentTab: () => null,
    gridApi: null,
    columnApi: null,
    username: '',
    userDefinedGridStates: [],
    setUserDefinedGridState: () => null,
    applyPredefinedTableView: () => null,
    lastStoredFilter: {},
    setBlockLastFilter: () => null,
    setShowModal: () => null,
};

export default connect(mapStateToProps, mapDispatchToProps)(RepositorySelectsAndButtons);
