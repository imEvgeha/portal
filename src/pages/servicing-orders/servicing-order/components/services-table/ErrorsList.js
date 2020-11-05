import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {OPERATIONAL_ERRORS} from './Constants';
import './ServicesTable.scss';

const ErrorsList = ({errors = [], closeModal}) => {
    return (
        <div className="error-list">
            <div className="error-list__header">
                <h1>{OPERATIONAL_ERRORS}</h1>
            </div>
            <hr className="solid" />
            <div className="error-list__item">
                {errors.map(item => (
                    <p key={item}> number: {item}</p>
                ))}
            </div>
            <hr className="solid" />
            <div className="error-list__footer">
                <Button appearance="primary" onClick={closeModal}>
                    OK
                </Button>
            </div>
        </div>
    );
};

ErrorsList.propTypes = {
    errors: PropTypes.array,
    closeModal: PropTypes.func,
};

ErrorsList.defaultProps = {
    errors: [],
    closeModal: () => null,
};

export default ErrorsList;
