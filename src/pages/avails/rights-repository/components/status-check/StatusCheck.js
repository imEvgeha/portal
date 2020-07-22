import React from 'react';
import PropTypes from 'prop-types';
import DynamicTable from '@atlaskit/dynamic-table';
import Button from '@atlaskit/button';
import {header} from './constants';
import './StatusCheck.scss';

const StatusCheck = ({message, nonEligibleTitles, onClose}) => {
    const dataRows = nonEligibleTitles && nonEligibleTitles.map((content, index) => (
        {
            key: index,
            cells: [
                {
                    key: content.title,
                    content: content.title,
                },
                {
                    key: content.status,
                    content: content.status,
                },
            ],
        }
    ));
    return (
        <div className="nexus-c-status-check">
            <div className="nexus-c-status-check__message">
                {message}
            </div>
            {!!dataRows.length && (
                <DynamicTable
                    head={header}
                    rows={dataRows}
                    rowsPerPage={5}
                    defaultPage={1}
                    loadingSpinnerSize="large"
                    isLoading={false}
                // isFixedSize
                />
            )}

            <div className="nexus-c-status-check__btn-wrapper">
                <Button
                    appearance="primary"
                    onClick={onClose}
                    className="nexus-c-status-check__button"
                    isDisabled={false}
                >
                    OK
                </Button>
            </div>
        </div>
    );
};

StatusCheck.propTypes = {
    message: PropTypes.string,
    nonEligibleTitles: PropTypes.array,
    onClose: PropTypes.func,
};

StatusCheck.defaultProps = {
    message: '',
    nonEligibleTitles: [],
    onClose: () => null,
};

export default StatusCheck;
