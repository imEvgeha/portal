import React from 'react';
import {Link} from 'react-router-dom';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import './SyncLogView.scss';
import {TITLE} from './syncLogConstants';
import {URL} from '../../util/Common';
import {NexusTitle} from '../../ui/elements/';
import SyncLogTable from './components/sync-log-table/SyncLogTable';

const SyncLogView = () => {
    return (
        <div className='nexus-c-sync-log-view'>
            <NexusTitle>
                <Link to={URL.keepEmbedded('/metadata')}>
                    <ArrowLeftIcon size='large' />
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
