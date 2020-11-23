import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {URL} from '../../util/Common';
import TitleCreate from '../legacy/containers/metadata/dashboard/components/TitleCreateModal'; // replace with new component
import TitleMetadataHeader from './components/title-metadata-header/TitleMetadataHeader';
import TitleMetadataTable from './components/title-metadata-table/TitleMetadataTable';
import {CREATE_NEW_TITLE, SYNC_LOG} from './constants';
import './TitleMetadataView.scss';

const TitleMetadataView = ({history}) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="nexus-c-title-metadata">
            <TitleMetadataHeader>
                <Button
                    className="nexus-c-title-metadata__create-btn"
                    appearance="primary"
                    onClick={() => setShowModal(true)}
                >
                    {CREATE_NEW_TITLE}
                </Button>
                <Button
                    className="nexus-c-title-metadata__sync-btn"
                    appearance="subtle"
                    onClick={() => history.push(URL.keepEmbedded('/metadata/sync-log'))}
                >
                    {SYNC_LOG}
                </Button>
            </TitleMetadataHeader>
            <TitleMetadataTable history={history} />
            <TitleCreate display={showModal} toggle={() => setShowModal(false)} />
        </div>
    );
};

TitleMetadataView.propTypes = {
    history: PropTypes.object,
};

TitleMetadataView.defaultProps = {
    history: {},
};

export default TitleMetadataView;
