import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './IngestConfirmation.scss';

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
            <p>You have assigned your upload with:</p>
            <div className="nexus-c-ingest-confirmation__content">
                <p>Licensor: {`${licensor}`}</p>
                <p>Service Region: {`${serviceRegion}`}</p>
                <p>Licensee: {`${licensee}`}</p>
                <p>Catalog: {`${catalog}`}</p>
                <p>Licensed: {`${isLicenced ? 'Yes' : 'No'}`}</p>
            </div>
            <div className="nexus-c-ingest-confirmation__actions">
                <p>Do you wish to continue?</p>
                <div className="nexus-c-ingest-confirmation__btn-wrapper">
                    <Button
                        appearance="subtle"
                        onClick={onActionCancel}
                        className="nexus-c-ingest-confirmation__cancel-btn"
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={onActionConfirm}
                        className="nexus-c-ingest-confirmation__continue-btn"
                    >
                        Continue
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
