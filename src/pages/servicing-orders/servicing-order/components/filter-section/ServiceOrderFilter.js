import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import {getValidDate} from '@vubiquity-nexus/portal-utils/lib/utils';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import Constants from '../fulfillment-order/constants';
import PartnerRequest from '../partner-request/PartnerRequest';
import {SORT_DIRECTION} from './constants';
import './ServiceOrderFilter.scss';

const ServiceOrderFilter = ({orderDetails, filter, setFilter, dueDateSortDirection, setDueDateSortDirection}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const {tenant, external_id: externalId, description, configured_pr_id: configuredPrId, sr_due_date: srDueDate} =
        orderDetails || {};
    const filterList = [{value: 'All', label: 'All'}];
    const mappedFilterList = filterList.concat(
        Object.keys(Constants.STATUS).map(key => ({
            label: Constants.STATUS[key],
            value: key,
        }))
    );

    return (
        <div className="so-panel-filter-detail">
            <div className="so-panel-filter-detail__row">
                <div className="so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                    Customer: {tenant}
                </div>

                <div className="so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                    Order ID: {externalId}
                </div>
            </div>

            {description !== null && (
                <div className="so-panel-filter-detail__row">
                    <div className="so-panel-filter-detail__info nexus-c-table-toolbar__title--is-active">
                        Description: {description}
                    </div>
                </div>
            )}

            <div className="so-panel-filter-detail__row">
                <Button onClick={() => setIsDrawerOpen(true)}>Partner Request</Button>
                <NexusDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    width="extended"
                    title="Partner Request"
                >
                    <PartnerRequest externalId={externalId} configuredPrId={configuredPrId} />
                </NexusDrawer>
            </div>

            <div className="so-panel-filter-detail__row">
                <NexusDatePicker
                    id="dueDate"
                    label="SO Due Date"
                    value={getValidDate(srDueDate)}
                    isDisabled
                    isReturningTime={false}
                    onChange={() => null}
                />
            </div>
            <div className="so-panel-filter-detail__row so-panel-filter-detail__row--inline">
                <div className="so-panel-filter-detail__dropdown">
                    <label>Status Filter</label>
                    <Select
                        options={mappedFilterList}
                        onChange={setFilter}
                        value={filter}
                        placeholder="Select Status"
                    />
                </div>
                <div className="so-panel-filter-detail__dropdown">
                    <label>Sort by Due Date</label>
                    <Select
                        options={SORT_DIRECTION}
                        onChange={setDueDateSortDirection}
                        value={dueDateSortDirection}
                        placeholder="Select Date"
                    />
                </div>
            </div>
        </div>
    );
};

ServiceOrderFilter.propTypes = {
    orderDetails: PropTypes.object.isRequired,
    filter: PropTypes.object,
    setFilter: PropTypes.func,
    dueDateSortDirection: PropTypes.object,
    setDueDateSortDirection: PropTypes.func,
};

ServiceOrderFilter.defaultProps = {
    filter: {},
    setFilter: null,
    dueDateSortDirection: {},
    setDueDateSortDirection: null,
};

export default ServiceOrderFilter;
