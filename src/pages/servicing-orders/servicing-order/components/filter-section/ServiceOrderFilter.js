import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import NexusDrawer from '../../../../../ui/elements/nexus-drawer/NexusDrawer';
import {getValidDate} from '../../../../../util/utils';
import PartnerRequest from '../partner-request/PartnerRequest';
import {FILTER_LIST, SORT_DIRECTION} from './constants';
import './ServiceOrderFilter.scss';

const ServiceOrderFilter = ({
    orderDetails,
    filter,
    setFilter,
    dueDateSortDirection,
    setDueDateSortDirection
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="so-panel-filter-detail">
            <div className="so-panel-filter-detail__info-section">
                <p className="so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                    Customer: {orderDetails.tenant}
                </p>

                <p className="so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                    Order ID: {orderDetails.external_id}
                </p>
            </div>

            {orderDetails.description != null ? (
                <div className="so-panel-filter-detail__info-section">
                    <p className="so-panel-filter-detail__info so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                        Description: {orderDetails.description}
                    </p>
                </div>
            ) : null}

            <Button onClick={() => setIsDrawerOpen(true)}>Partner Request</Button>
            <NexusDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                width="extended"
                title="Partner Request"
            >
                <PartnerRequest
                    externalId={orderDetails.external_id}
                    configuredPrId={orderDetails.configured_pr_id}
                />
            </NexusDrawer>
            <NexusDatePicker
                id="dueDate"
                label="SO Due Date"
                value={getValidDate(orderDetails.sr_due_date)}
                isDisabled
                isReturningTime={false}
                onChange={() => {}}
            />
            <div className="so-panel-filter-detail__dropdowns">
                <div className="so-panel-filter-detail__dropdown">
                    <p className="so-panel-filter-detail__dropdown-title nexus-c-table-toolbar__title--is-active">
                        Status Filter
                    </p>
                    <div className="so-panel-filter-detail__dropdown-element">
                        <Select
                            options={FILTER_LIST}
                            onChange={setFilter}
                            value={filter}
                            placeholder="Select Status"
                        />
                    </div>
                </div>
                <div className="so-panel-filter-detail__dropdown">
                    <p className="so-panel-filter-detail__dropdown-title nexus-c-table-toolbar__title--is-active">
                        Sort by Due Date
                    </p>
                    <div className="so-panel-filter-detail__dropdown-element">
                        <Select
                            options={SORT_DIRECTION}
                            onChange={setDueDateSortDirection}
                            value={dueDateSortDirection}
                            placeholder="Select Date"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

ServiceOrderFilter.propTypes = {
    orderDetails: PropTypes.object.isRequired
};

export default ServiceOrderFilter;
