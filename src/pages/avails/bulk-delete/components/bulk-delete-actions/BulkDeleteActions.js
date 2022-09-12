import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
import {BULK_DELETE_BTN_CANCEL} from '../../constants';
import './BulkDeleteActions.scss';

const BulkDeleteActions = ({onClose, onSubmit, rightsDeletionCount, isLoading, isDisabled}) => {
    return (
        <div className="nexus-c-bulk-delete-actions__wrapper">
            <div className="nexus-c-bulk-delete-actions__btn-wrapper d-flex justify-content-end">
                <Button
                    label={`Delete ${rightsDeletionCount} Rights`}
                    onClick={onSubmit}
                    className="p-button-outlined nexus-c-bulk-delete-actions__delete-btn"
                    loading={isLoading}
                    disabled={isDisabled}
                />
                <Button
                    label={BULK_DELETE_BTN_CANCEL}
                    appearance="subtle"
                    onClick={onClose}
                    className="p-button-outlined p-button-secondary nexus-c-bulk-delete-actions__cancel-btn"
                    disabled={false}
                />
            </div>
        </div>
    );
};

BulkDeleteActions.propTypes = {
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    rightsDeletionCount: PropTypes.number,
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.bool,
};

BulkDeleteActions.defaultProps = {
    onClose: () => null,
    onSubmit: () => null,
    rightsDeletionCount: 0,
    isLoading: false,
    isDisabled: false,
};

export default BulkDeleteActions;
