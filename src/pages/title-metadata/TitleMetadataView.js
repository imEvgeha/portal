import React from 'react';
import Button from '@atlaskit/button';
import TitleMetadataHeader from './components/title-metadata-header/TitleMetadataHeader';
import {CREATE_NEW_TITLE, SYNC_LOG} from './constants';
import './TitleMetadataView.scss';

const TitleMetadataView = () => {
    return (
        <div className="nexus-c-title-metadata">
            <TitleMetadataHeader>
                <Button className="nexus-c-title-metadata__create-btn" appearance="primary" onClick={() => null}>
                    {CREATE_NEW_TITLE}
                </Button>
                <Button className="nexus-c-title-metadata__sync-btn" appearance="subtle" onClick={() => null}>
                    {SYNC_LOG}
                </Button>
            </TitleMetadataHeader>
        </div>
    );
};

export default TitleMetadataView;
