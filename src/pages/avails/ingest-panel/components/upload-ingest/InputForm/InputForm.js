import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {get, isEmpty} from 'lodash';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import {getLicensors} from '../../../ingestSelectors';
import {uploadIngest} from '../../../ingestActions';
import constants from '../../../constants';
import './InputForm.scss';
import { RadioGroup } from '@atlaskit/radio';
import {createLoadingSelector} from '../../../../../../ui/loading/loadingSelectors';

const  {ingestTypes: {EMAIL, UPLOAD}, SERVICE_REGIONS, TEMPLATES: { USMASTER, STUDIO, INTERNATIONAL} } = constants;
const US = 'US';

const InputForm = ({ingestData = {}, closeModal, file, browseClick, licensors, uploadIngest, isUploading}) => {
    const isStudio = !isEmpty(ingestData) && (ingestData.ingestType === EMAIL || ingestData.licensor);

    const templates = [
        {label: 'Use International Template', value: INTERNATIONAL,
            disabled: isStudio, testId: isStudio && 'disabled'},
        {label: 'Use US Template', value: USMASTER,
            disabled: !isEmpty(ingestData) && (isStudio || ingestData.serviceRegion !== US),
            testId: !isEmpty(ingestData) && (isStudio|| ingestData.serviceRegion !== US) && 'disabled'},
        {label: 'Use Studio Template', value: STUDIO,
            disabled: !isEmpty(ingestData) && !isStudio, testId: !isEmpty(ingestData) && !isStudio && 'disabled'}
    ];


    const initialTemplate = templates.find(t => !t.disabled);
    const [template, setTemplate] = useState(initialTemplate.value);
    const getLicensor = template === STUDIO && ingestData.licensor && {label: ingestData.licensor , value:  {value: ingestData.licensor} };
    const [licensor, setLicensor] = useState(getLicensor);
    const [serviceRegion, setServiceRegion] = useState( ingestData.serviceRegion && {label: ingestData.serviceRegion, value: ingestData.serviceRegion} );


    useEffect(() => {
        if(template === STUDIO && !ingestData) {
            const serviceRegions = get(licensor, 'value.servicingRegions', []);
            if (serviceRegions.length === 1) {
                const name = serviceRegions[0].servicingRegionName;
                setServiceRegion({label: name, value: name});
            } else {
                setServiceRegion('');
            }
        }
    }, [licensor]);



    const uploadHandler = () => {
        const params = {
            serviceRegion: serviceRegion.value,
            file,
            closeModal
        };
        if(ingestData.externalId) {
            params.externalId = ingestData.externalId;
        }
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
        const selectedTemplate = event.target.value;
        setTemplate(selectedTemplate);
        const serviceRegionValue = selectedTemplate === USMASTER && {label: US, value: US};
        !ingestData.externalId && setServiceRegion(serviceRegionValue);
        selectedTemplate !== STUDIO && setLicensor('');
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
                    options={templates}
                    onChange={onTemplateChange}
                    defaultValue={initialTemplate.value}
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
                        isDisabled={template !== STUDIO || ingestData.licensor}
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
                        isDisabled={ingestData.serviceRegion || template === USMASTER || (template === STUDIO && !licensor)}
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
                >Upload
                </Button>
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

const mapStateToProps = state => {
    const loadingSelector = createLoadingSelector(['UPLOAD_INGEST_FILES']);

    return {
        licensors: getLicensors(state),
        isUploading: loadingSelector(state),
    };
};

const mapDispatchToProps = dispatch => ({
    uploadIngest: payload => dispatch(uploadIngest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);
