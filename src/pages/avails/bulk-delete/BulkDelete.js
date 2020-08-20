import React, {memo} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import {
    HEADER,
    BULK_DELETE_WARNING_MSG,
    BULK_DELETE_LINKED_RIGHT_MSG,
    BULK_DELETE_CONTINUE_MSG,
    BULK_DELETE_BTN_DELETE,
    BULK_DELETE_BTN_CANCEL,
} from './constants';
import './BulkDelete.scss';

export const BulkDelete = ({rights, onClose}) => {
    console.log(rights);
    const dataRows =
        rights &&
        rights.map(content => {
            const {id, title, status, rightStatus, licensed, territory} = content;
            return {
                key: id,
                cells: [
                    {
                        key: `${id}-title`,
                        content: title,
                    },
                    {
                        key: `${id}-status`,
                        content: '',
                    },
                    {
                        key: `${id}-rightStatus`,
                        content: '',
                    },
                    {
                        key: `${id}-licensed`,
                        content: '',
                    },
                    {
                        key: `${id}-territory`,
                        content: '',
                    },
                ],
            };
        });
    return (
        <div className="nexus-c-bulk-delete">
            <div className="nexus-c-bulk-delete__message">{BULK_DELETE_WARNING_MSG}</div>
            {!!dataRows.length && (
                <div className="nexus-c-bulk-delete__table">
                    <div className="nexus-c-bulk-delete__table-header">{BULK_DELETE_LINKED_RIGHT_MSG}</div>
                    <DynamicTable
                        head={HEADER}
                        rows={dataRows}
                        // rowsPerPage={1}
                        defaultPage={1}
                        loadingSpinnerSize="large"
                        isLoading={false}
                    />
                </div>
            )}
            <div className="nexus-c-bulk-delete__continue">{BULK_DELETE_CONTINUE_MSG}</div>
            <div className="nexus-c-bulk-delete__btn-wrapper">
                <Button
                    appearance="subtle"
                    onClick={onClose}
                    className="nexus-c-bulk-delete__cancel-btn"
                    isDisabled={false}
                >
                    {BULK_DELETE_BTN_CANCEL}
                </Button>
                <Button
                    appearance="primary"
                    onClick={() => null}
                    className="nexus-c-bulk-delete__delete-btn"
                    isDisabled={false}
                >
                    {BULK_DELETE_BTN_DELETE}
                </Button>
            </div>
        </div>
    );
};

BulkDelete.propTypes = {
    rights: PropTypes.array,
    onClose: PropTypes.func,
};

BulkDelete.defaultProps = {
    rights: [],
    onClose: () => null,
};

export default memo(BulkDelete);
