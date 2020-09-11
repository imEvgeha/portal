import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {withRouter} from 'react-router';
import RightsIcon from '../../../../../assets/rights.svg';
import {URL} from '../../../../../util/Common';
import {CREATE_NEW_RIGHT} from '../../constants';
import './RightsRepositoryHeader.scss';

export const RightsRepositoryHeader = ({title, history, isTableDataLoading}) => {
    return (
        <div className="nexus-c-rights-repository-header">
            <div className="nexus-c-rights-repository-header__title">
                <RightsIcon fill="#42526E" />
                <h1 className="nexus-c-rights-repository-header__title-text">{title}</h1>
            </div>
            <Button
                appearance="primary"
                isLoading={isTableDataLoading}
                onClick={() => history.push(URL.keepEmbedded('/avails/rights/create'))}
            >
                {CREATE_NEW_RIGHT}
            </Button>
        </div>
    );
};

RightsRepositoryHeader.propTypes = {
    title: PropTypes.string,
    history: PropTypes.object,
    isTableDataLoading: PropTypes.bool,
};

RightsRepositoryHeader.defaultProps = {
    title: 'Rights',
    history: {},
    isTableDataLoading: false,
};

export default withRouter(RightsRepositoryHeader);
