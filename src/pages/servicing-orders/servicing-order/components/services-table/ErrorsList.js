/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {OPERATIONAL_ERRORS} from './Constants';
import './ServicesTable.scss';

const ErrorItem = ({error}) => {
    return (
        <div className="error-list__item">
            <div className="error-list__item-err">Error</div>
            <div className="error-list__item-err-desc">{error.error || ''}</div>
        </div>
    );
};

const ErrorsList = ({errors = [], closeModal}) => {
    return (
        <div className="error-list">
            <div className="error-list__header">
                <h1>{OPERATIONAL_ERRORS}</h1>
            </div>
            <hr className="solid" />
            <div>
                {errors.map((item, index) => (
                    <ErrorItem key={index} error={item} />
                ))}
            </div>
            <hr className="solid" />
            <div className="error-list__footer">
                <p>{`${errors.length} errors found`}</p>
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
