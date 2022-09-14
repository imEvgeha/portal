import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@portal/portal-components';
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
    isCatalog,
    catalogType,
    territories,
    licenseTypes,
    isLicenced,
    onActionCancel,
    onActionConfirm,
}) => {
    return (
        <div className="nexus-c-ingest-confirmation">
            <p className="nexus-c-ingest-confirmation__message">{INGEST_ASSIGN_MESSAGE}</p>
            <div className="nexus-c-ingest-confirmation__content">
                <p>Licensor: {licensor || 'N/A'}</p>
                <p>Service Region: {serviceRegion}</p>
                <p>Licensee: {licensee || 'N/A'}</p>
                <p>Catalog: {isCatalog ? 'Yes' : 'No'}</p>
                {territories && <p>Territories: {territories}</p>}
                {licenseTypes && <p>License Types: {licenseTypes}</p>}
            </div>
            <div className="nexus-c-ingest-confirmation__actions">
                <p>{INGEST_UPLOAD_CONTINUE_MSG}</p>
                <div className="nexus-c-ingest-confirmation__btn-wrapper d-flex justify-content-end">
                    <Button
                        label={INGEST_UPLOAD_CANCEL_BTN}
                        onClick={onActionCancel}
                        className="p-button-outlined p-button-secondary nexus-c-ingest-confirmation__cancel-btn"
                    />
                    <Button
                        label={INGEST_UPLOAD_CONTINUE_BTN}
                        onClick={onActionConfirm}
                        className="p-button-outlined nexus-c-ingest-confirmation__continue-btn"
                    />
                </div>
            </div>
        </div>
    );
};

IngestConfirmation.propTypes = {
    licensor: PropTypes.string,
    serviceRegion: PropTypes.string,
    licensee: PropTypes.string,
    isCatalog: PropTypes.bool,
    catalogType: PropTypes.string,
    isLicenced: PropTypes.bool,
    territories: PropTypes.string,
    licenseTypes: PropTypes.string,
    onActionCancel: PropTypes.func,
    onActionConfirm: PropTypes.func,
};

IngestConfirmation.defaultProps = {
    licensor: '',
    serviceRegion: '',
    licensee: '',
    isCatalog: false,
    catalogType: '',
    isLicenced: false,
    territories: '',
    licenseTypes: '',
    onActionCancel: () => null,
    onActionConfirm: () => null,
};

export default IngestConfirmation;
