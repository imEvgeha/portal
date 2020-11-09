import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {BULK_DELETE_WARNING_MSG} from '../../constants';
import BulkDeleteActions from '../bulk-delete-actions/BulkDeleteActions';
import './BulkDeleteConfirmation.scss';

export const BulkDeleteConfirmation = ({onClose, onSubmit, rightsCount}) => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoadingAndSubmit = () => {
        setIsLoading(true);
        onSubmit();
    };

    return (
        <div className="nexus-c-bulk-delete-confirmation">
            <div className="nexus-c-bulk-delete-confirmation__container">
                <div className="nexus-c-bulk-delete-confirmation__message">{BULK_DELETE_WARNING_MSG(rightsCount)}</div>
            </div>
            <BulkDeleteActions
                onClose={onClose}
                onSubmit={setLoadingAndSubmit}
                rightsDeletionCount={rightsCount}
                isLoading={isLoading}
            />
        </div>
    );
};

BulkDeleteConfirmation.propTypes = {
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    rightsCount: PropTypes.number,
};

BulkDeleteConfirmation.defaultProps = {
    onClose: () => null,
    onSubmit: () => null,
    rightsCount: 0,
};

export default BulkDeleteConfirmation;
