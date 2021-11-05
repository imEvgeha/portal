import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import RightsIcon from '@vubiquity-nexus/portal-assets/rights.svg';
import NexusSavedTableDropdown from '@vubiquity-nexus/portal-ui/lib/elements/nexus-saved-table-dropdown/NexusSavedTableDropdown';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
// import {setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {isEmpty, get} from 'lodash';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Loading from '../../../../static/Loading';
import {
    SAVED_TABLE_DROPDOWN_LABEL,
    MY_SAVED_VIEWS_LABEL,
    MY_PREDEFINED_VIEWS_LABEL,
    SAVED_TABLE_SELECT_OPTIONS,
} from '../../../saved-table-dropdown/constants';
import {CREATE_NEW_RIGHT, RIGHTS_TAB} from '../../constants';
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
        <div className="nexus-c-rights-repository-header">
            <div className="nexus-c-rights-repository-header__title">
                <RightsIcon fill="#42526E" />
                <h1 className="nexus-c-rights-repository-header__title-text">{title}</h1>
            </div>
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
                    hasPredefined={true}
                />
            ) : activeTab === RIGHTS_TAB ? (
                <Loading />
            ) : null}
            <Button appearance="primary" onClick={() => history.push(URL.keepEmbedded('/avails/rights/create'))}>
                {CREATE_NEW_RIGHT}
            </Button>
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
