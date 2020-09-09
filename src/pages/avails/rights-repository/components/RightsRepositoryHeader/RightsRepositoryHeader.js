import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './RightsRepositoryHeader.scss';
import RightsIcon from '../../../../../assets/rights.svg';
import {CREATE_NEW_RIGHT} from '../../constants';

const RightsRepositoryHeader = ({title}) => {
    return (
        <div className="nexus-c-rights-repository-header">
            <div className="nexus-c-rights-repository-header__title">
                <RightsIcon fill="#42526E" />
                <h1 className="nexus-c-rights-repository-header__title-text">{title}</h1>
            </div>
            <Button appearance="primary" onClick={() => null}>
                {CREATE_NEW_RIGHT}
            </Button>
        </div>
    );
};

RightsRepositoryHeader.propTypes = {
    title: PropTypes.string,
};

RightsRepositoryHeader.defaultProps = {
    title: 'Rights',
};

export default RightsRepositoryHeader;
