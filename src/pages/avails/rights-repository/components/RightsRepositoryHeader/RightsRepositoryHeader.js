import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import IconActionAdd from '@vubiquity-nexus/portal-assets/icon-action-add.svg';
import RightsIcon from '@vubiquity-nexus/portal-assets/rights.svg';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
// import {setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty, get} from 'lodash';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Loading from '../../../../static/Loading';
import {
    SAVED_TABLE_DROPDOWN_LABEL,
    MY_SAVED_VIEWS_LABEL,
    MY_PREDEFINED_VIEWS_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
} from '../../../saved-table-dropdown/constants';
import {CREATE_NEW_RIGHT, RIGHTS_REPOSITORY_TABS, RIGHTS_TAB} from '../../constants';
import './RightsRepositoryHeader.scss';
import {storeAvailsUserDefinedGrid} from '../../rightsActions';
import {createUserGridSelector} from '../../rightsSelectors';
import {applyPredefinedTableView} from '../../util/utils';

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
    const [activeIndex, setActiveIndex] = useState(0);
    const [userDefinedGridStates, setUserDefinedGridStates] = useState([]);

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

    return (
        <div className="nexus-c-rights-repository-header row">
            <div className="nexus-c-rights-repository-header__title col-2 d-flex align-items-center">
                <RightsIcon fill="#42526E" />
                <h1 className="nexus-c-rights-repository-header__title-text" style={{margin: 'auto'}}>{title}</h1> 
            </div>
            <div className="col-7 d-flex justify-content-center">
                <TabMenu
                    className="nexus-c-title-metadata__tab-menu"
                    model={RIGHTS_REPOSITORY_TABS}
                    activeIndex={activeIndex}
                    onTabChange={e => setActiveIndex(e.index)}
                /> 
            </div>
            <div className="col-2">
                {activeTab === RIGHTS_TAB && gridApi && columnApi ? (
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
                    />
                ) : activeTab === RIGHTS_TAB ? (
                    <Loading />
                ) : null}
            </div>
            <div className="col-1">
                <Button
                    tooltip={CREATE_NEW_RIGHT}
                    tooltipOptions={{position: 'left'}}
                    icon={IconActionAdd}
                    onClick={() => history.push(URL.keepEmbedded('/avails/rights/create'))}
                    className="p-button-text"
                />
            </div>
        </div>
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
