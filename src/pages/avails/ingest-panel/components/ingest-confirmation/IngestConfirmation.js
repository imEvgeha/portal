import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './IngestConfirmation.scss';
import {
    INGEST_ASSIGN_MESSAGE,
    INGEST_UPLOAD_CONTINUE_MSG,
    INGEST_UPLOAD_CANCEL_BTN,
    INGEST_UPLOAD_CONTINUE_BTN,
} from './constants';

const IngestConfirmation = ({
    licensor,
    serviceRegion,
    licensee,
    catalog,
    isLicenced,
    onActionCancel,
    onActionConfirm,
}) => {
    return (
        <div className="nexus-c-ingest-confirmation">
            <p className="nexus-c-ingest-confirmation__message">{INGEST_ASSIGN_MESSAGE}</p>
            <div className="nexus-c-ingest-confirmation__content">
                <p>Licensor: {`${licensor}`}</p>
                <p>Service Region: {`${serviceRegion}`}</p>
                <p>Licensee: {`${licensee}`}</p>
                <p>Catalog: {`${catalog}`}</p>
                <p>Licensed: {`${isLicenced ? 'Yes' : 'No'}`}</p>
            </div>
            <div className="nexus-c-ingest-confirmation__actions">
                <p>{INGEST_UPLOAD_CONTINUE_MSG}</p>
                <div className="nexus-c-ingest-confirmation__btn-wrapper">
                    <Button
                        appearance="subtle"
                        onClick={onActionCancel}
                        className="nexus-c-ingest-confirmation__cancel-btn"
                    >
                        {INGEST_UPLOAD_CANCEL_BTN}
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={onActionConfirm}
                        className="nexus-c-ingest-confirmation__continue-btn"
                    >
                        {INGEST_UPLOAD_CONTINUE_BTN}
                    </Button>
                </div>
            </div>
        </div>
    );
};

IngestConfirmation.propTypes = {
    licensor: PropTypes.string,
    serviceRegion: PropTypes.string,
    licensee: PropTypes.string,
    catalog: PropTypes.string,
    isLicenced: PropTypes.bool,
    onActionCancel: PropTypes.func,
    onActionConfirm: PropTypes.func,
};

IngestConfirmation.defaultProps = {
    licensor: '',
    serviceRegion: '',
    licensee: '',
    catalog: '',
    isLicenced: false,
    onActionCancel: () => null,
    onActionConfirm: () => null,
};

export default IngestConfirmation;
