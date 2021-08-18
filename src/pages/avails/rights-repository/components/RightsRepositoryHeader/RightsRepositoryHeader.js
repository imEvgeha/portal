import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import RightsIcon from '@vubiquity-nexus/portal-assets/rights.svg';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {withRouter} from 'react-router';
import Loading from '../../../../static/Loading';
import SavedTableDropdown from '../../../saved-table-dropdown/SavedTableDropdown';
import {CREATE_NEW_RIGHT, RIGHTS_TAB} from '../../constants';
import './RightsRepositoryHeader.scss';

export const RightsRepositoryHeader = ({title, history, gridApi, columnApi, username, activeTab}) => {
    return (
        <div className="nexus-c-rights-repository-header">
            <div className="nexus-c-rights-repository-header__title">
                <RightsIcon fill="#42526E" />
                <h1 className="nexus-c-rights-repository-header__title-text">{title}</h1>
            </div>
            {gridApi && columnApi && activeTab === RIGHTS_TAB ? (
                <SavedTableDropdown gridApi={gridApi} columnApi={columnApi} username={username} />
            ) : (
                <Loading />
            )}
            <Button appearance="primary" onClick={() => history.push(URL.keepEmbedded('/avails/rights/create'))}>
                {CREATE_NEW_RIGHT}
            </Button>
        </div>
    );
};

RightsRepositoryHeader.propTypes = {
    title: PropTypes.string,
    history: PropTypes.object,
    gridApi: PropTypes.object,
    columnApi: PropTypes.object,
    username: PropTypes.string,
    activeTab: PropTypes.string,
};

RightsRepositoryHeader.defaultProps = {
    title: 'Rights',
    history: {},
    gridApi: {},
    columnApi: {},
    username: '',
    activeTab: '',
};

export default withRouter(RightsRepositoryHeader);
