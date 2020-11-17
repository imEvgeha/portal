import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import SyncPublish from './SyncPublish';
import TitleInfo from './TitleInfo';
import './TitleDetailsHeader.scss';

const ARROW_COLOR = '#42526e';

const TitleDetailsHeader = ({goBack}) => {
    return (
        <div className="nexus-c-title-details-header">
            <span onClick={goBack}>
                <ArrowLeftIcon size="large" primaryColor={ARROW_COLOR} />
            </span>
            <div className="nexus-c-title-details-header__content">
                <div className="nexus-c-title-details-header__title-info-container">
                    <TitleInfo
                        title="Avengers: Endgame"
                        releaseYear="2018"
                        contentType="Movie"
                        titleImageSrc="https://www.bbsocal.com/wp-content/uploads/2018/05/image-placeholder.png"
                    />
                    <div className="nexus-c-title-details-header__edit-button">
                        <Button appearance="primary">Edit</Button>
                    </div>
                </div>
                <div className="nexus-c-title-details-header__publish-info-container">
                    <SyncPublish message="Updated...">Publish to VZ</SyncPublish>
                    <SyncPublish message="Updated...">Publish to Movida</SyncPublish>
                </div>
            </div>
        </div>
    );
};

TitleDetailsHeader.propTypes = {
    goBack: PropTypes.func,
};

TitleDetailsHeader.defaultProps = {
    goBack: () => null,
};

export default TitleDetailsHeader;
