import React from 'react';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Link} from 'react-router-dom';
import './SyncLogView.scss';
import {NexusTitle} from '../../ui/elements';
import SyncLogTable from './components/sync-log-table/SyncLogTable';
import {TITLE} from './syncLogConstants';

const SyncLogView = () => {
    return (
        <div className="nexus-c-sync-log-view">
            <NexusTitle>
                <Link to={URL.keepEmbedded('/metadata')}>
                    <ArrowLeftIcon size="large" />
                </Link>
                <span className="nexus-c-sync-log-view__title">{TITLE}</span>
            </NexusTitle>
            <div className="nexus-c-sync-log-view__table">
                <SyncLogTable />
            </div>
        </div>
    );
};

export default SyncLogView;
