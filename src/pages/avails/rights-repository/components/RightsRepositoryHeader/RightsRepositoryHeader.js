import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import RightsIcon from '@vubiquity-nexus/portal-assets/rights.svg';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty, get} from 'lodash';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Loading from '../../../../static/Loading';
import SavedTableDropdown from '../../../saved-table-dropdown/SavedTableDropdown';
import {
    // GROUPED_OPTIONS,
    // SAVED_TABLE_DROPDOWN_LABEL,
    // SAVED_TABLE_SELECT_OPTIONS,
    READY_PENDING_VIEW,
    ERROR_VIEW,
    WITHDRAWN_VIEW,
    REMOVED_FROM_CATALOG_VIEW,
} from '../../../saved-table-dropdown/constants';
import {CREATE_NEW_RIGHT, RIGHTS_TAB} from '../../constants';
import './RightsRepositoryHeader.scss';
import {storeAvailsUserDefinedGrid} from '../../rightsActions';
import {createUserGridSelector} from '../../rightsSelectors';

export const RightsRepositoryHeader = ({
    title,
    history,
    gridApi,
    columnApi,
    username,
    activeTab,
    gridState,
    storeAvailsUserDefinedGrid,
}) => {
    const [userDefinedGridStates, setUserDefinedGridStates] = useState([]);

    useEffect(() => {
        if (!isEmpty(gridState) && username) {
            const userDefinedGridStates = get(gridState, username, []);
            setUserDefinedGridStates(userDefinedGridStates);
        }
    }, [gridState, username, get]);

    const applyPredefinedTableView = filter => {
        gridApi.setFilterModel(null);
        gridApi.destroyFilter('icon');
        gridApi.destroyFilter('icon_1');

        switch (filter) {
            case ERROR_VIEW: {
                const filterInstance = gridApi.getFilterInstance('status');
                filterInstance.setModel({
                    filterType: 'set',
                    values: ['Error'],
                });
                break;
            }
            case READY_PENDING_VIEW: {
                const filterInstance = gridApi.getFilterInstance('status');
                filterInstance.setModel({
                    filterType: 'set',
                    values: ['Pending', 'ReadyNew', 'Ready'],
                });
                break;
            }
            case WITHDRAWN_VIEW: {
                const filterInstance = gridApi.getFilterInstance('rightStatus');
                filterInstance.setModel({
                    filterType: 'set',
                    values: ['Withdrawn'],
                });
                break;
            }
            case REMOVED_FROM_CATALOG_VIEW: {
                gridApi.setFilterModel({
                    updatedCatalogReceived: {
                        filterType: 'set',
                        values: ['true'],
                    },
                });
                break;
            }
            default:
                break;
        }
        gridApi.onFilterChanged();
        setSorting({colId: 'updatedAt', sort: 'desc'}, columnApi);
        columnApi.resetColumnState();
    };

    return (
        <>
            <div className="nexus-c-rights-repository-header">
                <div className="nexus-c-rights-repository-header__title">
                    <RightsIcon fill="#42526E" />
                    <h1 className="nexus-c-rights-repository-header__title-text">{title}</h1>
                </div>
                {activeTab === RIGHTS_TAB && gridApi && columnApi ? (
                    <SavedTableDropdown gridApi={gridApi} columnApi={columnApi} username={username} />
                ) : activeTab === RIGHTS_TAB ? (
                    <Loading />
                ) : null}
                <Button appearance="primary" onClick={() => history.push(URL.keepEmbedded('/avails/rights/create'))}>
                    {CREATE_NEW_RIGHT}
                </Button>
            </div>
            <div>
                <hr />
                <br />

                <NexusSavedTableDropdown
                    gridApi={gridApi}
                    columnApi={columnApi}
                    username={username}
                    gridState={gridState}
                    setUserDefinedGridState={storeAvailsUserDefinedGrid}
                    userDefinedGridStates={userDefinedGridStates}
                    applyPredefinedTableView={applyPredefinedTableView}
                />

                <br />
                <hr />
            </div>
        </>
    );
};

RightsRepositoryHeader.propTypes = {
    title: PropTypes.string,
    history: PropTypes.object,
    activeTab: PropTypes.string,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    username: PropTypes.string,
    gridState: PropTypes.object,
    storeAvailsUserDefinedGrid: PropTypes.func,
};

RightsRepositoryHeader.defaultProps = {
    title: 'Rights',
    history: {},
    gridApi: {},
    activeTab: '',
    columnApi: {},
    username: '',
    gridState: {},
    storeAvailsUserDefinedGrid: () => null,
};

const mapStateToProps = () => {
    const gridSelector = createUserGridSelector();
    return state => ({
        gridState: gridSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    storeAvailsUserDefinedGrid: payload => dispatch(storeAvailsUserDefinedGrid(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RightsRepositoryHeader));
