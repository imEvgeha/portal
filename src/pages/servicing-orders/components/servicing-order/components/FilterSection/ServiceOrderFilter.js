import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import moment from 'moment';
import Select from '@atlaskit/select/dist/cjs/Select';
import './ServiceOrderFilter.scss';
import NexusDrawer from '../../../../../../ui/elements/nexus-drawer/NexusDrawer';
import { FILTER_LIST } from './constants';

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
                position="right"
                title='Partner Request'
            >
                <div className='so-panel-filter-detail__drawer'>
                    <p className='so-panel-filter-detail__p nexus-c-table-toolbar__title--is-active'>Studio: {orderDetails.customer}</p>
                    <p className='so-panel-filter-detail__p nexus-c-table-toolbar__title--is-active'>MSS Order Details: {orderDetails.soID}</p>
                    <p className='so-panel-filter-detail__p nexus-c-table-toolbar__title--is-active'>Created Date: {orderDetails.creationDate? moment(orderDetails.creationDate).format('MMM Do YYYY, h:mm:ss a') : null}</p>
                    <p className='so-panel-filter-detail__p nexus-c-table-toolbar__title--is-active'>Created by: {orderDetails.createdBy}</p>
                </div>
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
