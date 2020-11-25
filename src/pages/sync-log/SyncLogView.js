import React from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import './SyncLogView.scss';
import {NexusTitle} from '../../ui/elements';
import SyncLogTable from './components/sync-log-table/SyncLogTable';
import {TITLE} from './syncLogConstants';

const SyncLogView = ({history}) => {
    return (
        <div className="nexus-c-sync-log-view">
            <NexusTitle>
                <button className="nexus-c-sync-log-view__back-btn" onClick={() => history.goBack()}>
                    <ArrowLeftIcon size="large" />
                </button>
                <span className="nexus-c-sync-log-view__title">{TITLE}</span>
            </NexusTitle>
            <div className="nexus-c-sync-log-view__table">
                <SyncLogTable />
            </div>
        </div>
    );
};

SyncLogView.propTypes = {
    history: PropTypes.object,
};

SyncLogView.defaultProps = {
    history: {},
};

export default SyncLogView;
