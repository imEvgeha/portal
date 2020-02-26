import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import {getLicensors, getIsUploading} from '../../../ingestSelectors';
import {uploadIngest} from '../../../ingestActions';
import constants from '../../../constants';
import './InputForm.scss';
import { RadioGroup } from '@atlaskit/radio';

const {SERVICE_REGIONS, TEMPLATES, USMASTER, STUDIO} = constants;

const InputForm = ({closeModal, file, browseClick, licensors, uploadIngest, isUploading}) => {
    const [template, setTemplate] = useState(TEMPLATES[0].value);
    const [licensor, setLicensor] = useState('');
    const [serviceRegion, setServiceRegion] = useState('');


    useEffect(() => {
        if(template === STUDIO) {
            const serviceRegions = get(licensor, 'value.servicingRegions', []);
            if (serviceRegions.length === 1) {
                const name = serviceRegions[0].servicingRegionName;
                setServiceRegion({label: name, value: name});
            } else {
                setServiceRegion('');
            }
        }
    }, [licensor]);


    const updateUploadStatus = () => {
        if(licensor && serviceRegion) {
            setUploadDisabled(false);
        } else {
            setUploadDisabled(true);
        }
    };

    const uploadHandler = () => {
        const params = {
            serviceRegion: serviceRegion.value,
            file,
            closeModal
        };
        if(template !== STUDIO) {
            params.internal = true;
            params.internalTemplateType = template;
        } else{
            params.internal = false;
            params.licensor = get(licensor, 'value.value', '');
        }
        uploadIngest(params);
    };

    const serviceRegionOptions = get(licensor, 'value') ? get(licensor, 'value.servicingRegions', [])
        .map(({servicingRegionName}) => ({label: servicingRegionName, value: servicingRegionName})) : SERVICE_REGIONS;
    const selectProps = {
        styles: {
            menuPortal: base => ({
                ...base,
                zIndex: 9999,
            }),
        },
        menuPortalTarget: document.body
    };
    const onTemplateChange = (event) => {
        setTemplate(event.target.value);
        setLicensor('');
        const serviceRegionValue = event.target.value === USMASTER && {label: 'US', value: 'US'};
        setServiceRegion(serviceRegionValue);
    };

    const uploadDisabled = !(serviceRegion && (template === STUDIO? licensor : true));
    return (
        <div className='manual-ingest-config'>
            <div className='manual-ingest-config__grid'>
                <div className='manual-ingest-config--file-name'>
                    <label>File</label>
                    <span>{file.name}</span>
                </div>
                <Button onClick={browseClick} className='manual-ingest-config__grid--browse'>Browse</Button>
            </div>
            <div className='manual-ingest-config__templates'>
                <RadioGroup
                    options={TEMPLATES}
                    onChange={onTemplateChange}
                    defaultValue={TEMPLATES[0].value}
                />
            </div>
            <div className='manual-ingest-config__grid'>
                <div className='manual-ingest-config--licensor'>
                    <label>Licensor</label>
                    <Select
                        id='manual-upload-licensor'
                        onChange={setLicensor}
                        value={licensor}
                        options={licensors.map(lic => ({value: lic, label: lic.name}))}
                        isDisabled={template !== STUDIO}
                        placeholder={template !== STUDIO ? 'N/A' : 'Select'}
                        {...selectProps}
                    />
                </div>
                <div className='manual-ingest-config--service-region'>
                    <label>Service Region</label>
                    <Select
                        id='manual-upload-service-region'
                        onChange={setServiceRegion}
                        value={serviceRegion}
                        options={serviceRegionOptions}
                        isDisabled={template === USMASTER || (template === STUDIO && !licensor)}
                        placeholder='Select'
                        {...selectProps}
                    />
                </div>
            </div>
            <div className='manual-ingest-config__grid'>
                <Button isDisabled={isUploading} onClick={closeModal}>Cancel</Button>
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