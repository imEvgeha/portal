import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Field} from '@atlaskit/form';
import {default as AKForm} from '@atlaskit/form/Form';
import Textfield from '@atlaskit/textfield';
import {Dropdown, Button} from '@portal/portal-components';
import NexusUpload from '@vubiquity-nexus/portal-ui/lib/elements/nexus-upload/NexusUpload';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {UPLOAD_ARTWORK, uploadArtwork} from '../assetManagementReducer';
import {assetDetailsSelector} from '../assetManagementSelectors';

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 20px 0;

    > * {
        margin-left: 5px;
    }
`;

const UploadArtworkForm = ({asset, closeModal, uploadArtwork, isUploading, tenantId, details}) => {
    const [file, setFile] = useState(null);

    const handleSubmit = values => {
        // Todo when requested.
    };

    const handleUploadChange = file => {
        setFile(file);
    };

    const handleUploadClick = () => {
        uploadArtwork({file, closeModal, tenantId, details});
    };

    const {providerAssetId, tenantId: assetTenantId, metadataGroups, type, renditions} = asset;
    const {value: titleName} = metadataGroups[0].metadata.find(met => met.name === 'title');
    const {type: renditionType, name: renditionName} = renditions[0];

    const assetTypes = () => [
        {label: 'Source', value: 'source'},
        {label: 'Master', value: 'master'},
        {label: 'Egress', value: 'egress'},
    ];

    return (
        <>
            <AKForm onSubmit={values => handleSubmit(values)}>
                {({formProps, reset, setFieldValue}) => (
                    <form {...formProps}>
                        <div>
                            <NexusUpload name="upload" onChange={handleUploadChange} setFieldValue={setFieldValue} />
                        </div>

                        <h5>Asset information</h5>

                        <Field label="Provider asset ID" name="provider" defaultValue={providerAssetId} isDisabled>
                            {({fieldProps}) => <Textfield placeholder="Enter provider asset ID..." {...fieldProps} />}
                        </Field>
                        <Field label="Tenant" name="tenant" defaultValue={assetTenantId} isDisabled>
                            {({fieldProps}) => <Textfield placeholder="Enter Tenant ID..." {...fieldProps} />}
                        </Field>
                        <Field label="Title" name="title" defaultValue={titleName} isDisabled>
                            {({fieldProps}) => <Textfield placeholder="Enter title name..." {...fieldProps} />}
                        </Field>
                        <Field label="Type" name="type" defaultValue={type} isDisabled>
                            {({fieldProps}) => <Textfield placeholder="Enter asset type..." {...fieldProps} />}
                        </Field>

                        <h5>Rendition information</h5>

                        <Field
                            label="Type"
                            name="ren_type"
                            defaultValue={{
                                label: renditionType.replace(/^./, renditionType[0].toUpperCase()),
                                value: renditionType,
                            }}
                            isDisabled
                        >
                            {({fieldProps}) => (
                                <Dropdown
                                    {...fieldProps}
                                    id="ddlArtworkType"
                                    value={fieldProps.value?.value}
                                    placeholder="Choose type..."
                                    options={assetTypes()}
                                    columnClass="col-12"
                                    onChange={e => {
                                        const value = assetTypes().find(x => x.value === e.value);
                                        fieldProps.onChange(value);
                                    }}
                                />
                            )}
                        </Field>

                        <Field label="Name" name="name" defaultValue={renditionName} isDisabled>
                            {({fieldProps}) => <Textfield placeholder="Enter name..." {...fieldProps} />}
                        </Field>
                    </form>
                )}
            </AKForm>
            <ButtonContainer>
                <Button
                    label="Cancel"
                    className="p-button-outlined p-button-secondary"
                    disabled={isUploading}
                    onClick={closeModal}
                />
                <Button
                    label="Upload"
                    className="p-button-outlined"
                    onClick={handleUploadClick}
                    disabled={!file}
                    loading={isUploading}
                />
            </ButtonContainer>
        </>
    );
};

UploadArtworkForm.propTypes = {
    closeModal: PropTypes.func.isRequired,
    uploadArtwork: PropTypes.func.isRequired,
    tenantId: PropTypes.string.isRequired,
    asset: PropTypes.object,
    isUploading: PropTypes.bool,
    details: PropTypes.object,
};

UploadArtworkForm.defaultProps = {
    isUploading: false,
    details: null,
    asset: null,
};

const mapStateToProps = state => {
    const loadingSelector = createLoadingSelector([UPLOAD_ARTWORK]);

    return {
        isUploading: loadingSelector(state),
        details: assetDetailsSelector(state),
    };
};

const mapDispatchToProps = dispatch => ({
    uploadArtwork: payload => dispatch(uploadArtwork(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadArtworkForm);
