import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import moment from 'moment';
import './ServiceOrderFilter.scss';
import NexusDrawer from '../../../../../ui/elements/nexus-drawer/NexusDrawer';
import PartnerRequest from '../partner-request/PartnerRequest';
import { FILTER_LIST } from './constants';
import NexusDatePicker from '../../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import {getValidDate} from '../../../../../util/utils';

const ServiceOrderFilter = ({orderDetails, filter, setFilter}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return(
        <div className='so-panel-filter-detail'>
            <span className='so-panel-filter-detail__span nexus-c-table-toolbar__title--is-active'>Customer: {orderDetails.tenant}</span>
            <p className='so-panel-filter-detail__p nexus-c-table-toolbar__title--is-active'>Order ID: {orderDetails.external_id}</p>
            <Button onClick={() => setIsDrawerOpen(true)}>Partner Request</Button>
            <NexusDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                width="extended"
                title="Partner Request"
            >
                <PartnerRequest orderDetails={orderDetails} />
            </NexusDrawer>
            <NexusDatePicker
                id='dueDate'
                label='SO Due Date'
                value={getValidDate(orderDetails.sr_due_date)}
                isDisabled
                isReturningTime={false}
            />
            <p className='so-panel-filter-detail__p nexus-c-table-toolbar__title--is-active'>Filter</p>
            <div className='so-panel-filter-detail__section'>
                <Select
                    options={FILTER_LIST}
                    onChange={setFilter}
                    value={filter}
                    placeholder="Select Status"
                />
            </div>
        </div>
    );
};

ServiceOrderFilter.propTypes = {
    orderDetails: PropTypes.object.isRequired
};

export default ServiceOrderFilter;
