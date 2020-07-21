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
    }]

};

const rows = [
    {
        key: 'morning-row',
        cells: ['9:00', 'Math'].map(
            (content, index) => ({
                key: index,
                content,
            }),
        ),
    },
    {
        key: 'midday-row',
        cells: [
            {
                key: 0,
                content: '12:00',
            },
            {
                key: 1,
                content: 'LUNCH',
            },
        ],
    },
    {
        key: 'afternoon-row',
        cells: [
            '13:00',
            'Science',
        ].map((content, index) => ({
            key: index,
            content,
        })),
    },
];

const StatusCheck = ({message}) => {
    return (
        <div className="nexus-c-status-check">
            <div className="nexus-c-status-check__message">
                {message}
            </div>
            <DynamicTable
                head={head2}
                rows={rows}
                rowsPerPage={10}
                defaultPage={1}
                loadingSpinnerSize="large"
                isLoading={false}
                //isFixedSize
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
