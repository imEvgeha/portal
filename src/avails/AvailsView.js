import React from 'react';
import PageHeader from '@atlaskit/page-header';
import Ingest from './Ingest/Ingest';
import './AvailsView.scss';

const AvailsView = () => (
    <div className="nexus-c-avails-view">
        <Ingest/>
        <PageHeader>
            AVAILS
        </PageHeader>
    </div>
);

export default AvailsView;
