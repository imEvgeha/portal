import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import NexusDrawer from '../../../../../ui/elements/nexus-drawer/NexusDrawer';
import {getValidDate} from '../../../../../util/utils';
import PartnerRequest from '../partner-request/PartnerRequest';
import {SORT_DIRECTION} from './constants';
import Constants from '../fulfillment-order/constants';
import './ServiceOrderFilter.scss';

const ServiceOrderFilter = ({
    orderDetails,
    filter,
    setFilter,
    dueDateSortDirection,
    setDueDateSortDirection
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { tenant, external_id, description, configured_pr_id, sr_due_date } = orderDetails || {};
    let FilterList = [{ value: 'All', label: 'All' }];
    FilterList = FilterList.concat(Object.keys(Constants.STATUS).map(key => ({
        label: Constants.STATUS[key],
        value: key
    })));
    return (
        <div className="so-panel-filter-detail">
            <div className="so-panel-filter-detail__info-section">
                <p className="so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                    Customer: {tenant}
                </p>

                <p className="so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                    Order ID: {external_id}
                </p>
            </div>

            {description !== null && (
                <div className="so-panel-filter-detail__info-section">
                    <p className="so-panel-filter-detail__info so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                        Description: {description}
                    </p>
                </div>
            )}

            <Button onClick={() => setIsDrawerOpen(true)}>Partner Request</Button>
            <NexusDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                width="extended"
                title="Partner Request"
            >
                <PartnerRequest
                    externalId={external_id}
                    configuredPrId={configured_pr_id}
                />
            </NexusDrawer>
            <NexusDatePicker
                id="dueDate"
                label="SO Due Date"
                value={getValidDate(sr_due_date)}
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
                            options={FilterList}
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
