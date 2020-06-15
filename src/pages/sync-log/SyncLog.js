import React from 'react';
import {Link} from 'react-router-dom';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import './SyncLog.scss';
import {TITLE} from './syncLogConstants';
import {NexusTitle} from '../../ui/elements/';
import {URL} from '../../util/Common';

const SyncLog = () => {
    const previousPageRoute = '/';

    return (
        <div className='nexus-c-sync-log'>
            <NexusTitle>
                <Link to={URL.keepEmbedded(previousPageRoute)}>
                    <ArrowLeftIcon size='large' />
                </Link>
                <span>{TITLE}</span>
            </NexusTitle>
            <div className="nexus-c-sync-log__table">
                {/* Sync Log Table */}
            </div>
        </div>
    );
};

export default SyncLog;
