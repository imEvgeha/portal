import React from 'react';
import PropTypes from 'prop-types';
import DynamicTable from '@atlaskit/dynamic-table';
import Button from '@atlaskit/button';
import './StatusCheck.scss';

const head2 = {
    cells: [{
        key: 1,
        content: 'Title',
        width: 80,
    },
    {
        key: 2,
        content: 'Status',
        width: 20,
    }],

};

const StatusCheck = ({message, nonEligibleTitles}) => {
    const dataRows = nonEligibleTitles.map((content, index) => (
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
            <DynamicTable
                head={head2}
                rows={dataRows}
                rowsPerPage={10}
                defaultPage={1}
                loadingSpinnerSize="large"
                isLoading={false}
                // isFixedSize
            />
            <Button
                appearance="primary"
                onClick={() => null}
                className="nexus-c-status-check__button"
                isDisabled={false}
            >
                OK
            </Button>
        </div>
    );
};

export default StatusCheck;
