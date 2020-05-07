import React, {useState} from 'react';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';
import './servicingOrders.scss';

const ServicingOrders = () => {
    const [hideReady, setHideReady] = useState(false);
    const [hideCompleted, setHideCompleted] = useState(false);
    const NO_CUSTOMER_FILTER = { label: 'Select...', value: '' };
    const [customerFilter, setCustomerFilter] = useState(NO_CUSTOMER_FILTER);
    return (
        <div className='servicing-orders'>
            <div className='servicing-orders--title'>
                Servicing Orders
            </div>
            <div className='servicing-orders--external-filters'>
                <div className='nexus-c--customer-filter'>
                    Customer
                    <Select
                        options={[
                            NO_CUSTOMER_FILTER,
                            { label: 'MGM', value: 'mgm' },
                            { label: 'MGM2', value: 'mgm2' },
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
        </div>
    );
};

export default ServicingOrders;