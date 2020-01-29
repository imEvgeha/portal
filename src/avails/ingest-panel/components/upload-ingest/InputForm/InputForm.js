import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import {Checkbox} from '@atlaskit/checkbox';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import {getLicensors, getIsUploading} from '../../../ingestSelectors';
import {uploadIngest} from '../../../ingestActions';
import constants from '../../../constants';
import './InputForm.scss';

const {SERVICE_REGIONS} = constants;

const InputForm = ({closeModal, file, browseClick, licensors, uploadIngest, isUploading}) => {
    const [uploadDisabled, setUploadDisabled] = useState(true);
    const [internal, setInternal] = useState(false);
    const [licensor, setLicensor] = useState('');
    const [serviceRegion, setServiceRegion] = useState('');

    useEffect(() => {
        setLicensor(internal);
    }, [internal]);

    useEffect(() => {
        updateUploadStatus();
    }, [licensor]);

    useEffect(() => {
        updateUploadStatus();
    }, [serviceRegion]);

    const updateUploadStatus = () => {
        if(licensor && serviceRegion) {
            setUploadDisabled(false);
        } else {
            setUploadDisabled(true);
        }
    };

    const uploadHandler = () => {
        const params = {
            serviceRegion: serviceRegion.label,
            file,
            closeModal
        };
        if(internal) {
            params.internal = true;
        } else{
            params.licensor = get(licensor, 'value.value', '');
        }
        uploadIngest(params);
    };

    const serviceRegionOptions = get(licensor, 'value') ? get(licensor, 'value.servicingRegions',
        []).map(({servicingRegionName}) => ({label: servicingRegionName})) : SERVICE_REGIONS;
    const selectProps = {
        styles: {
            menuPortal: base => ({
                ...base,
                zIndex: 9999,
            }),
        },
        menuPortalTarget: document.body
    };
    return (
        <div className='manual-ingest-config'>
            <div className='manual-ingest-config__grid'>
                <div className='manual-ingest-config--file-name'>
                    <label>File</label>
                    <span>{file.name}</span>
                </div>
                <Button onClick={browseClick} className='manual-ingest-config__grid--browse'>Browse</Button>
            </div>
            <div className='manual-ingest-config__internal'>
                <Checkbox onChange={e => setInternal(get(e, 'currentTarget.checked', false))}/>
                <span>Use Internal Template</span>
            </div>
            <div className='manual-ingest-config__grid'>
                <div className='manual-ingest-config--licensor'>
                    <label>Licensor</label>
                    <Select
                        id='manual-upload-licensor'
                        onChange={setLicensor}
                        value={licensor}
                        options={licensors.map(lic => ({value: lic, label: lic.name}))}
                        isDisabled={internal}
                        placeholder={internal ? 'N/A' : 'Select'}
                        {...selectProps}
                    />
                </div>
                <div className='manual-ingest-config--service-region'>
                    <label>Service Region</label>
                    <Select
                        id='manual-upload-service-region'
                        onChange={setServiceRegion}
                        options={serviceRegionOptions}
                        isDisabled={!licensor}
                        placeholder='Select'
                        {...selectProps}
                    />
                </div>
            </div>
            <div className='manual-ingest-config__grid'>
                <Button onClick={closeModal}>Cancel</Button>
                <Button
                    onClick={uploadHandler}
                    className={uploadDisabled ? '' : 'btn-primary'}
                    isLoading={isUploading}
                    isDisabled={uploadDisabled}
                >Upload</Button>
            </div>
        </div>
    );
};

InputForm.propTypes = {
    licensors: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
    uploadIngest: PropTypes.func,
    browseClick: PropTypes.func,
    file: PropTypes.object,
    isUploading: PropTypes.bool,
};

InputForm.defaultProps = {
    licensors: [],
    uploadIngest: () => null,
    browseClick: () => null,
    file: {},
    isUploading: false
};

const mapStateToProps = state => ({
    licensors: getLicensors(state),
    isUploading: getIsUploading(state)
});

const mapDispatchToProps = dispatch => ({
    uploadIngest: payload => dispatch(uploadIngest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);