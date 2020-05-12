import React, {useEffect, useState} from 'react';
import ServicingOrdersTable from './servicing-orders-table/ServicingOrdersTable';
import './ServicingOrdersView.scss';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';

const ServicingOrdersView = () => {

    const [hideReady, setHideReady] = useState(false);
    const [hideCompleted, setHideCompleted] = useState(false);
    const NO_CUSTOMER_FILTER = { label: 'Select...', value: '' };
    const [customerFilter, setCustomerFilter] = useState(NO_CUSTOMER_FILTER);
    const [fixedFilter, setFixedFilter] = useState({});
    const [externalFilter, setExternalFilter] = useState({});

    useEffect(() => {
        setFixedFilter({
            status: hideCompleted ? ['On Hold', 'Not Started', 'In Progress', 'Canceled'] : undefined,
            readiness: hideReady ? ['Not Configured'] : undefined,
        });
    }, [hideReady, hideCompleted]);

    useEffect(() => {
        setExternalFilter({
            customer: customerFilter && customerFilter.value ? customerFilter.value : undefined,
        });
    }, [customerFilter]);

    return (
        <div className='nexus-c-servicing-orders'>
            <div className='nexus-c-servicing-orders__title'>
                Servicing Orders
            </div>
            <div className='nexus-c-servicing-orders__external-filters'>
                <div className='nexus-c-servicing-orders__customer-filter'>
                    Customer
                    <Select
                        options={[
                            NO_CUSTOMER_FILTER,
                            { label: 'MGM', value: 'MGM' },
                            { label: 'WB', value: 'WB' },
                        ]}
                        placeholder={NO_CUSTOMER_FILTER.label}
                        value={customerFilter}
                        onChange={(val) => {
                            setCustomerFilter(val);
                        }}
                    />
                </div>
                <Button
                    isSelected={hideReady}
                    onClick={() => setHideReady(!hideReady)}
                >
                    Hide Ready
                </Button>
                <Button
                    isSelected={hideCompleted}
                    onClick={() => setHideCompleted(!hideCompleted)}
                >
                    Hide Completed
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