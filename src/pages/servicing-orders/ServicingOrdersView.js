import React, {useEffect, useState} from 'react';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';
import ServicingOrdersTable from './components/servicing-orders-table/ServicingOrdersTable';
import './ServicingOrdersView.scss';
import {SERVICING_ORDERS_TTL, CUSTOMER_LBL, HIDE_COMPLETED_BTN, HIDE_READY_BTN} from './constants';

const ServicingOrdersView = () => {

    const [isHideReady, setIsHideReady] = useState(false);
    const [isHideCompleted, setIsHideCompleted] = useState(false);
    const NO_CUSTOMER_FILTER = { label: 'Select...', value: '' };
    const [customerFilter, setCustomerFilter] = useState(NO_CUSTOMER_FILTER);
    const [fixedFilter, setFixedFilter] = useState({});
    const [externalFilter, setExternalFilter] = useState({});

    useEffect(() => {
        setFixedFilter({
            status: isHideCompleted ? ['NOT_STARTED', 'IN_PROGRESS', 'CANCELLED', 'FAILED'] : undefined,
            readiness: isHideReady ? ['NEW', 'ON_HOLD'] : undefined,
        });
    }, [isHideReady, isHideCompleted]);

    useEffect(() => {
        setExternalFilter({
            ...customerFilter && customerFilter.value && {tenant : customerFilter.value}
        });
    }, [customerFilter]);

    return (
        <div className='nexus-c-servicing-orders'>
            <div className='nexus-c-servicing-orders__title'>
                {SERVICING_ORDERS_TTL}
            </div>
            <div className='nexus-c-servicing-orders__external-filters'>
                <div className='nexus-c-servicing-orders__customer-filter'>
                    <div className='nexus-c-servicing-orders__customer-filter--label'>
                        {CUSTOMER_LBL}
                    </div>
                    <Select
                        options={[
                            NO_CUSTOMER_FILTER,
                            { label: 'MGM', value: 'MGM' },
                            { label: 'WB', value: 'WB' },
                        ]}
                        className='nexus-c-servicing-orders__customer-filter--select'
                        placeholder={NO_CUSTOMER_FILTER.label}
                        value={customerFilter}
                        onChange={setCustomerFilter}
                    />
                </div>
                <Button
                    isSelected={isHideReady}
                    onClick={() => setIsHideReady(!isHideReady)}
                >
                    {HIDE_READY_BTN}
                </Button>
                <Button
                    isSelected={isHideCompleted}
                    onClick={() => setIsHideCompleted(!isHideCompleted)}
                >
                    {HIDE_COMPLETED_BTN}
                </Button>
            </div>
            <ServicingOrdersTable
                fixedFilter={fixedFilter}
                externalFilter={externalFilter}
            />
        </div>
    );
};

export default ServicingOrdersView;
