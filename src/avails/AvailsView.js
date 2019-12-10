import React from 'react';
import PageHeader from '@atlaskit/page-header';
import AvailsHistory from './history/AvailsHistory';
import './AvailsView.scss';


//NOTE: This is just a skeleton component, feel free to edit as you wish. None of this has to stay
const AvailsView = () => (
    <div className="nexus-c-avails-view">
        <AvailsHistory/>
        <PageHeader>
            AVAILS
        </PageHeader>
    </div>
);

export default AvailsView;
