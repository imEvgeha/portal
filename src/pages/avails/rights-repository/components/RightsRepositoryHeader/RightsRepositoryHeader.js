import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import IconActionAdd from '@vubiquity-nexus/portal-assets/icon-action-add.svg';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {get, isEmpty} from 'lodash';
import {Button} from 'primereact/button';
import {TabMenu} from 'primereact/tabmenu';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Loading from '../../../../static/Loading';
import {
    MY_PREDEFINED_VIEWS_LABEL,
    MY_SAVED_VIEWS_LABEL,
    SAVED_TABLE_DROPDOWN_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
} from '../../../saved-table-dropdown/constants';
import {
    CREATE_NEW_RIGHT,
    PRE_PLAN_SELECTED_TAB,
    PRE_PLAN_TAB,
    RIGHTS_REPOSITORY_TABS,
    RIGHTS_SELECTED_TAB,
    RIGHTS_TAB,
    SELECTED_FOR_PLANNING_TAB,
    STATUS_TAB,
} from '../../constants';
import './RightsRepositoryHeader.scss';
import {setCurrentUserViewActionAvails, storeAvailsUserDefinedGrid} from '../../rightsActions';
import {createAvailsCurrentUserViewSelector, createUserGridSelector} from '../../rightsSelectors';
import {applyPredefinedTableView} from '../../util/utils';

export const RightsRepositoryHeader = ({
    title,
    gridApi,
    columnApi,
    username,
    activeTab,
    setActiveTab,
    activeTabIndex,
    setActiveTabIndex,
    gridState,
    storeAvailsUserDefinedGrid,
    setCurrentUserView,
    currentUserView,
}) => {
    const [userDefinedGridStates, setUserDefinedGridStates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === RIGHTS_SELECTED_TAB) {
            setActiveTabIndex(-1);
        }
    }, [activeTab]);

    useEffect(() => {
        if (!isEmpty(gridState) && username) {
            const userDefinedGridStates = get(gridState, username, []);
            setUserDefinedGridStates(userDefinedGridStates);
        }
    }, [gridState, username, get]);

    const tableLabels = {
        savedDropdownLabel: SAVED_TABLE_DROPDOWN_LABEL,
        savedViewslabel: MY_SAVED_VIEWS_LABEL,
        predifinedViewsLabel: MY_PREDEFINED_VIEWS_LABEL,
    };
    const tableOptions = SAVED_TABLE_SELECT_OPTIONS;
    const isItDisabledForCurrentTab = [
        PRE_PLAN_TAB,
        PRE_PLAN_SELECTED_TAB,
        SELECTED_FOR_PLANNING_TAB,
        STATUS_TAB,
    ].includes(activeTab);

    return (
        <div className="nexus-c-rights-repository-header row d-flex align-items-center">
            <div className="nexus-c-rights-repository-header__title col-2 d-flex align-items-center">
                <span className="nexus-c-rights-repository-header__title-text">{title}</span>
            </div>
            <div className="col-md-10 col-xl-7 d-flex justify-content-center">
                <TabMenu
                    className="nexus-c-title-metadata__tab-menu"
                    model={RIGHTS_REPOSITORY_TABS}
                    activeIndex={activeTabIndex}
                    onTabChange={e => {
                        setActiveTab(e.value.tab);
                        setActiveTabIndex(e.index);
                    }}
                />
            </div>
            <div className="col-xs-12 col-xl-3 d-flex justify-content-end align-items-center">
                <div className="nexus-c-title-metadata__saved-table-wrapper">
                    {gridApi && columnApi ? (
                        <NexusSavedTableDropdown
                            gridApi={gridApi}
                            columnApi={columnApi}
                            username={username}
                            gridState={gridState}
                            setUserDefinedGridState={storeAvailsUserDefinedGrid}
                            userDefinedGridStates={userDefinedGridStates}
                            applyPredefinedTableView={applyPredefinedTableView}
                            tableLabels={tableLabels}
                            tableOptions={tableOptions}
                            isDisabled={isItDisabledForCurrentTab}
                            setCurrentUserView={payload => setCurrentUserView(payload)}
                            currentUserView={currentUserView}
                        />
                    ) : activeTab === RIGHTS_TAB || activeTab === PRE_PLAN_TAB ? (
                        <Loading />
                    ) : null}
                </div>
                <div>
                    <Button
                        tooltip={CREATE_NEW_RIGHT}
                        tooltipOptions={{position: 'left'}}
                        icon={IconActionAdd}
                        onClick={() => navigate(URL.keepEmbedded('/avails/rights/create'))}
                        className="p-button-text"
                    />
                </div>
            </div>
        </div>
    );
};

RightsRepositoryHeader.propTypes = {
    title: PropTypes.string,
    activeTab: PropTypes.string,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    username: PropTypes.string,
    gridState: PropTypes.object,
    storeAvailsUserDefinedGrid: PropTypes.func,
    setActiveTab: PropTypes.func,
    activeTabIndex: PropTypes.number.isRequired,
    setActiveTabIndex: PropTypes.func,
    setCurrentUserView: PropTypes.func.isRequired,
    currentUserView: PropTypes.object,
};

RightsRepositoryHeader.defaultProps = {
    title: 'Rights',
    gridApi: {},
    activeTab: '',
    columnApi: {},
    username: '',
    gridState: {},
    storeAvailsUserDefinedGrid: () => null,
    setActiveTab: () => null,
    setActiveTabIndex: () => null,
    currentUserView: {},
};

const mapStateToProps = () => {
    const gridSelector = createUserGridSelector();
    const currentUserViewSelector = createAvailsCurrentUserViewSelector();
    return state => ({
        gridState: gridSelector(state),
        currentUserView: currentUserViewSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    storeAvailsUserDefinedGrid: payload => dispatch(storeAvailsUserDefinedGrid(payload)),
    setCurrentUserView: payload => dispatch(setCurrentUserViewActionAvails(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepositoryHeader);
