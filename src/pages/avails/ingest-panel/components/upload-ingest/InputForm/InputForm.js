import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import {RadioGroup} from '@atlaskit/radio';
import Select from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';
import {get, isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {createLoadingSelector} from '../../../../../../ui/loading/loadingSelectors';
import constants from '../../../constants';
import {uploadIngest} from '../../../ingestActions';
import {getLicensees, getLicensors} from '../../../ingestSelectors';
import './InputForm.scss';

const {
    ingestTypes: {EMAIL},
    SERVICE_REGIONS,
    TEMPLATES: {USMASTER, STUDIO, INTERNATIONAL},
    LICENSEE_TOOLTIP,
    LICENSEE_WARNING,
} = constants;
const US = 'US';

const InputForm = ({
    ingestData = {},
    closeModal,
    file,
    browseClick,
    licensors,
    licensees,
    uploadIngest,
    isUploading,
}) => {
    const {serviceRegion: ingestServiceRegion, licensor: ingestLicensor, ingestType} = ingestData || {};

    const isStudio = !isEmpty(ingestData) && (ingestType === EMAIL || ingestLicensor);

    const templates = [
        {label: 'Use International Template', value: INTERNATIONAL, disabled: isStudio, testId: isStudio && 'disabled'},
        {
            label: 'Use US Template',
            value: USMASTER,
            disabled: !isEmpty(ingestData) && (isStudio || ingestServiceRegion !== US),
            testId: !isEmpty(ingestData) && (isStudio || ingestServiceRegion !== US) && 'disabled',
        },
        {
            label: 'Use Studio Template',
            value: STUDIO,
            disabled: !isEmpty(ingestData) && !isStudio,
            testId: !isEmpty(ingestData) && !isStudio && 'disabled',
        },
    ];

    const initialTemplate = templates.find(t => !t.disabled);
    const [template, setTemplate] = useState(initialTemplate.value);

    const getLicensor = template === STUDIO &&
        ingestLicensor && {label: ingestLicensor, value: {value: ingestLicensor}};
    const [licensor, setLicensor] = useState(getLicensor);

    const [licenseesOptions, setLicenseesOptions] = useState([]);
    const [selectedLicensees, setSelectedLicensees] = useState([]);

    const [serviceRegion, setServiceRegion] = useState(
        ingestServiceRegion && {label: ingestServiceRegion, value: ingestServiceRegion}
    );

    useEffect(() => {
        if (template === STUDIO && !ingestData) {
            const serviceRegions = get(licensor, 'value.servicingRegions', []);
            if (serviceRegions.length === 1) {
                const name = serviceRegions[0].servicingRegionName;
                setServiceRegion({label: name, value: name});
            } else {
                setServiceRegion('');
            }
        }
    }, [ingestData, licensor, template]);

    useEffect(() => {
        let parsedLicensees = licensees;
        const {value: licensorServiceRegion = ''} = serviceRegion || {};

        if (licensorServiceRegion) {
            parsedLicensees = parsedLicensees.filter(({servicingRegion}) => servicingRegion === licensorServiceRegion);
        }

        setLicenseesOptions(parsedLicensees.map(({licenseeName}) => ({value: licenseeName, label: licenseeName})));
    }, [licensees, serviceRegion]);

    const uploadHandler = () => {
        const params = {
            serviceRegion: serviceRegion.value,
            file,
            closeModal,
        };

        if (get(ingestData, 'externalId', '')) {
            params.externalId = ingestData.externalId;
        }

        if (template !== STUDIO) {
            params.internal = true;
            params.internalTemplateType = template;
        } else {
            params.internal = false;
            params.licensor = get(licensor, 'value.value', '');
            params.licensee = selectedLicensees.map(licensee => licensee.value).join(',');
        }
        uploadIngest(params);
    };

    const serviceRegionOptions = get(licensor, 'value')
        ? get(licensor, 'value.servicingRegions', []).map(({servicingRegionName}) => ({
              label: servicingRegionName,
              value: servicingRegionName,
          }))
        : SERVICE_REGIONS;
    const selectProps = {
        styles: {
            menuPortal: base => ({
                ...base,
                zIndex: 9999,
            }),
        },
        menuPortalTarget: document.body,
    };
    const onTemplateChange = event => {
        const selectedTemplate = event.target.value;
        setTemplate(selectedTemplate);
        const serviceRegionValue = selectedTemplate === USMASTER && {label: US, value: US};
        !get(ingestData, 'externalId', '') && setServiceRegion(serviceRegionValue);
        selectedTemplate !== STUDIO && setLicensor('');
    };

    const uploadDisabled = !(serviceRegion && (template === STUDIO ? licensor && !isEmpty(licensees) : true));
    return (
        <div className="manual-ingest-config">
            <div className="manual-ingest-config__grid">
                <div className="manual-ingest-config--file-name">
                    <label>File</label>
                    <span>{file.name}</span>
                </div>
                <Button onClick={browseClick} className="manual-ingest-config__grid--browse">
                    Browse
                </Button>
            </div>
            <div className="manual-ingest-config__templates">
                <RadioGroup options={templates} onChange={onTemplateChange} defaultValue={initialTemplate.value} />
            </div>
            <div className="manual-ingest-config__grid">
                <div className="manual-ingest-config--licensor">
                    <label>Licensor</label>
                    <Select
                        id="manual-upload-licensor"
                        onChange={setLicensor}
                        value={licensor}
                        options={licensors.map(lic => ({value: lic, label: lic.name}))}
                        isDisabled={template !== STUDIO || ingestLicensor}
                        placeholder={template !== STUDIO ? 'N/A' : 'Select'}
                        {...selectProps}
                    />
                </div>
                <div className="manual-ingest-config--service-region">
                    <label>Service Region</label>
                    <Select
                        id="manual-upload-service-region"
                        onChange={setServiceRegion}
                        value={serviceRegion}
                        options={serviceRegionOptions}
                        isDisabled={ingestServiceRegion || template === USMASTER || (template === STUDIO && !licensor)}
                        placeholder="Select"
                        {...selectProps}
                    />
                </div>
            </div>
            <div className="manual-ingest-config__licensee">
                <label>Licensee</label>
                <Tooltip content={LICENSEE_TOOLTIP}>
                    <Select
                        id="manual-upload-licensee"
                        onChange={setSelectedLicensees}
                        value={selectedLicensees}
                        options={licenseesOptions}
                        isDisabled={!serviceRegion || [USMASTER, INTERNATIONAL].includes(template)}
                        placeholder={template !== STUDIO ? 'N/A' : 'Select Licensee'}
                        isMulti
                        {...selectProps}
                    />
                </Tooltip>
                <div className="manual-ingest-config__sub-text">{LICENSEE_WARNING}</div>
            </div>
            <div className="manual-ingest-config__grid">
                <Button isDisabled={isUploading} onClick={closeModal}>
                    Cancel
                </Button>
                <Button
                    onClick={uploadHandler}
                    className={uploadDisabled ? '' : 'btn-primary'}
                    isLoading={isUploading}
                    isDisabled={uploadDisabled}
                >
                    Upload
                </Button>
            </div>
        </div>
    );
};

InputForm.propTypes = {
    licensors: PropTypes.array,
    licensees: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
    uploadIngest: PropTypes.func,
    browseClick: PropTypes.func,
    file: PropTypes.object,
    isUploading: PropTypes.bool,
    ingestData: PropTypes.object,
};

InputForm.defaultProps = {
    licensors: [],
    licensees: [],
    uploadIngest: () => null,
    browseClick: () => null,
    file: {},
    isUploading: false,
    ingestData: {},
};

const mapStateToProps = state => {
    const loadingSelector = createLoadingSelector(['UPLOAD_INGEST_FILES']);

    return {
        licensors: getLicensors(state),
        licensees: getLicensees(state),
        isUploading: loadingSelector(state),
    };
};

const mapDispatchToProps = dispatch => ({
    uploadIngest: payload => dispatch(uploadIngest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);
