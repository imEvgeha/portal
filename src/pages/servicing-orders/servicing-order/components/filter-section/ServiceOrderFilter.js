import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Button} from '@portal/portal-components';
import NexusDatePicker from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import NexusDrawer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-drawer/NexusDrawer';
import {getValidDate} from '@vubiquity-nexus/portal-utils/lib/utils';
import Constants from '../fulfillment-order/constants';
import PartnerRequest from '../partner-request/PartnerRequest';
import {SORT_DIRECTION} from './constants';
import './ServiceOrderFilter.scss';

const ServiceOrderFilter = ({orderDetails, filter, setFilter, sortDirection, setSortDirection}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const {
        tenant,
        external_id: externalId,
        description,
        configured_pr_id: configuredPrId,
        so_number: soNumber,
        title_manager: titleManager,
        completed_date: completedDate,
    } = orderDetails || {};
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
                <div>Customer: {tenant}</div>

                <div>Servicing Request ID: {externalId}</div>

                <div>Servicing Order ID: {soNumber}</div>

                {titleManager && <div>Title Manager: {titleManager}</div>}

                {description !== null && <div>Description: {description}</div>}
            </div>

            <div className="so-panel-filter-detail__row">
                <Button
                    label="Partner Request"
                    className="p-button-outlined p-button-secondary"
                    onClick={() => setIsDrawerOpen(true)}
                />
                <NexusDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    width="extended"
                    title="Partner Request"
                >
                    <PartnerRequest externalId={externalId} configuredPrId={configuredPrId} />
                </NexusDrawer>
            </div>

            <div className="so-panel-filter-detail__row so-panel-filter-detail__row--inline">
                {completedDate && (
                    <NexusDatePicker
                        id="completedDate"
                        label="Completed Date"
                        value={getValidDate(completedDate)}
                        isDisabled
                        isReturningTime={false}
                        onChange={() => null}
                    />
                )}
            </div>
            <div className="so-panel-filter-detail__row so-panel-filter-detail__row--inline">
                <div className="so-panel-filter-detail__dropdown">
                    <Dropdown
                        labelProps={{
                            label: 'Status Filter',
                            shouldUpper: false,
                            stacked: true,
                        }}
                        id="ddlStatusFilter"
                        options={mappedFilterList}
                        value={filter}
                        onChange={e => setFilter(e.value)}
                    />
                </div>
                <div className="so-panel-filter-detail__dropdown">
                    <Dropdown
                        labelProps={{
                            label: 'Sort by',
                            shouldUpper: false,
                            stacked: true,
                        }}
                        id="ddlSortBy"
                        options={SORT_DIRECTION}
                        optionLabel="label"
                        value={sortDirection}
                        onChange={e => {
                            setSortDirection(e.value);
                        }}
                        placeholder="Select type"
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
    sortDirection: PropTypes.object,
    setSortDirection: PropTypes.func,
};

ServiceOrderFilter.defaultProps = {
    filter: {},
    setFilter: null,
    sortDirection: PropTypes.object,
    setSortDirection: PropTypes.func,
};

export default ServiceOrderFilter;
