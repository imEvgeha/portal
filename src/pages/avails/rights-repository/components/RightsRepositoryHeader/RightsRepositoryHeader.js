import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import RightsIcon from '@vubiquity-nexus/portal-assets/rights.svg';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {withRouter} from 'react-router';
import {CREATE_NEW_RIGHT} from '../../constants';
import './RightsRepositoryHeader.scss';

export const RightsRepositoryHeader = ({title, history}) => {
    return (
        <div className="nexus-c-rights-repository-header">
            <div className="nexus-c-rights-repository-header__title">
                <RightsIcon fill="#42526E" />
                <h1 className="nexus-c-rights-repository-header__title-text">{title}</h1>
            </div>
            <Button appearance="primary" onClick={() => history.push(URL.keepEmbedded('/avails/rights/create'))}>
                {CREATE_NEW_RIGHT}
            </Button>
        </div>
    );
};

RightsRepositoryHeader.propTypes = {
    title: PropTypes.string,
    history: PropTypes.object,
};

RightsRepositoryHeader.defaultProps = {
    title: 'Rights',
    history: {},
};

export default withRouter(RightsRepositoryHeader);
