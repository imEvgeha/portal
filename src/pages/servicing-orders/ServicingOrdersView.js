import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import React, {useEffect, useState} from 'react';
import ServicingOrdersTable from './components/servicing-orders-table/ServicingOrdersTable';
import {CUSTOMER_LBL, HIDE_COMPLETED_BTN, HIDE_READY_BTN, SERVICING_ORDERS_TTL} from './constants';
import './ServicingOrdersView.scss';

const ServicingOrdersView = () => {
    const [selectedServicingOrders, setSelectedServicingOrders] = useState([]);
    const [isHideReady, setIsHideReady] = useState(false);
    const [isHideCompleted, setIsHideCompleted] = useState(false);
    const NO_CUSTOMER_FILTER = {label: 'Select...', value: ''};
    const [customerFilter, setCustomerFilter] = useState(NO_CUSTOMER_FILTER);
    const [fixedFilter, setFixedFilter] = useState({});
    const [externalFilter, setExternalFilter] = useState({});

    useEffect(
        () => {
            setFixedFilter({
                status: isHideCompleted ? ['NOT_STARTED', 'IN_PROGRESS', 'CANCELLED', 'FAILED'] : undefined,
                readiness: isHideReady ? ['NEW', 'ON_HOLD'] : undefined
            });
        },
        [isHideReady, isHideCompleted]
    );

    useEffect(
        () => {
            setExternalFilter({
                ...(customerFilter && customerFilter.value && {tenant: customerFilter.value})
            });
        },
        [customerFilter]
    );

    return (
        <div className="nexus-c-servicing-orders">
            <span className="nexus-c-servicing-orders__title">{SERVICING_ORDERS_TTL}</span>

            <div className="nexus-c-servicing-orders__external-filters">
                <div className="nexus-c-servicing-orders__customer-filter">
                    <label htmlFor="customer">{CUSTOMER_LBL}</label>
                    <Select
                        name="customer"
                        options={[NO_CUSTOMER_FILTER, {label: 'MGM', value: 'MGM'}, {label: 'WB', value: 'WB'}]}
                        className="nexus-c-servicing-orders__customer-filter--select"
                        placeholder={NO_CUSTOMER_FILTER.label}
                        value={customerFilter}
                        onChange={setCustomerFilter}
                    />
                </div>
                <Button isSelected={isHideReady} onClick={() => setIsHideReady(!isHideReady)}>
                    {HIDE_READY_BTN}
                </Button>
                <Button isSelected={isHideCompleted} onClick={() => setIsHideCompleted(!isHideCompleted)}>
                    {HIDE_COMPLETED_BTN}
                </Button>
            </div>
            <ServicingOrdersTable
                fixedFilter={fixedFilter}
                externalFilter={externalFilter}
                setSelectedServicingOrders={setSelectedServicingOrders}
            />
        </div>
    );
};

export default ServicingOrdersView;
