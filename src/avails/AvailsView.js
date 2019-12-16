import React from 'react';
import PageHeader from '@atlaskit/page-header';
import IngestPanel from './IngestPanel/IngestPanel';
import './AvailsView.scss';

const AvailsView = () => (
    <div className="nexus-c-avails-view">
        <IngestPanel/>
        <PageHeader>
            AVAILS
        </PageHeader>
    </div>
);

export default AvailsView;
