import React from 'react';
import PropTypes from 'prop-types';
import Button, {LoadingButton} from '@atlaskit/button';
import {BULK_DELETE_BTN_CANCEL} from '../../constants';
import './BulkDeleteActions.scss';

const BulkDeleteActions = ({onClose, onSubmit, rightsDeletionCount, isLoading, isDisabled}) => {
    return (
        <div className="nexus-c-bulk-delete-actions__wrapper">
            <div className="nexus-c-bulk-delete-actions__btn-wrapper">
                <LoadingButton
                    appearance="danger"
                    onClick={onSubmit}
                    className="nexus-c-bulk-delete-actions__delete-btn"
                    isLoading={isLoading}
                    isDisabled={isDisabled}
                >
                    {`Delete ${rightsDeletionCount} Rights`}
                </LoadingButton>
                <Button
                    appearance="subtle"
                    onClick={onClose}
                    className="nexus-c-bulk-delete-actions__cancel-btn"
                    isDisabled={false}
                >
                    {BULK_DELETE_BTN_CANCEL}
                </Button>
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
