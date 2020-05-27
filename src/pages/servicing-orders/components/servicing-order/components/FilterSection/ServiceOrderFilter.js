import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import NexusDrawer from '../../../../../../ui/elements/nexus-drawer/NexusDrawer';
import PartnerRequest from '../partner-request/PartnerRequest';
import { FILTER_LIST } from './constants';
import './ServiceOrderFilter.scss';

const ServiceOrderFilter = ({orderDetails, filter, setFilter}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return(
        <div className='so-panel-filter-detail'>
            <span className='so-panel-filter-detail__span nexus-c-table-toolbar__title--is-active'>Customer: {orderDetails.customer}</span>
            <p className='so-panel-filter-detail__p nexus-c-table-toolbar__title--is-active'>Order ID: {orderDetails.soID}</p>
            <Button onClick={() => setIsDrawerOpen(true)}>Partner Request</Button>
            <NexusDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                width="extended"
                title="Partner Request"
            >
                <PartnerRequest orderDetails={orderDetails} />
            </NexusDrawer>
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
