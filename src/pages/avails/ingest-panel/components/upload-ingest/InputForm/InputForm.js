import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import {Checkbox} from '@atlaskit/checkbox';
import {RadioGroup} from '@atlaskit/radio';
import Select from '@atlaskit/select';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {get, isEmpty} from 'lodash';
import {connect} from 'react-redux';
import constants from '../../../constants';
import {uploadIngest} from '../../../ingestActions';
import {getLicensees, getLicensors} from '../../../ingestSelectors';
import IngestConfirmation from '../../ingest-confirmation/IngestConfirmation';
import './InputForm.scss';

const {
    ingestTypes: {EMAIL},
    SERVICE_REGIONS,
    CATALOG_TYPES,
    TEMPLATES: {USMASTER, STUDIO, INTERNATIONAL, LICENSEE},
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
    openModalCallback,
    closeModalCallback,
    attachment,
}) => {
    const {serviceRegion: ingestServiceRegion, licensor: ingestLicensor, ingestType} = ingestData || {};
    const {link} = attachment;
    const fileName = link && link.split('/').pop();
    const isStudio = !isEmpty(ingestData) && (ingestType === EMAIL || ingestLicensor);

    const templates = [
        {
            label: 'International',
            value: INTERNATIONAL,
            testId: isStudio && 'disabled',
        },
        {
            label: 'US',
            value: USMASTER,
            testId: !isEmpty(ingestData) && (isStudio || ingestServiceRegion !== US) && 'disabled',
        },
        {
            label: 'Studio',
            value: STUDIO,
            testId: !isEmpty(ingestData) && !isStudio && 'disabled',
        },
        {
            label: 'Licensee',
            value: LICENSEE,
            testId: isStudio && 'disabled',
        },
    ];

    const initialTemplate = templates.find(t => t.testId !== 'disabled');
    const [template, setTemplate] = useState(initialTemplate.value);

    const getLicensor = template === STUDIO &&
        ingestLicensor && {label: ingestLicensor, value: {value: ingestLicensor}};
    const [licensor, setLicensor] = useState(getLicensor);

    const [licenseesOptions, setLicenseesOptions] = useState([]);
    const [selectedLicensees, setSelectedLicensees] = useState([]);

    const [serviceRegion, setServiceRegion] = useState(
        ingestServiceRegion ? {label: ingestServiceRegion, value: ingestServiceRegion} : ''
    );
    const [catalogType, setCatalogType] = useState('');
    const [isLicensed, setIsLicensed] = useState(false);

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

    const openIngestConfirmationModal = () => {
        openModalCallback(
            <IngestConfirmation
                licensor={licensor.label}
                serviceRegion={serviceRegion.value}
                licensee={selectedLicensees.map(licensee => licensee.value).join(', ')}
                isCatalog={!!catalogType.value}
                catalogType={catalogType.value}
                isLicenced={isLicensed}
                onActionCancel={closeModalCallback}
                onActionConfirm={uploadHandler}
            />,
            {title: 'Attention', width: 'medium', shouldCloseOnOverlayClick: false}
        );
    };

    const uploadHandler = () => {
        closeModalCallback();
        const fileParam = attachment && attachment.link ? attachment.link : file;
        const params = {
            serviceRegion: serviceRegion.value,
            file: fileParam,
            closeModal: closeModalCallback,
        };

        const isShowingCatalogType = catalogType.value;
        if (isShowingCatalogType) {
            params.catalogUpdate = isShowingCatalogType;
            params.catalogType = catalogType.value;
            params.licensed = isLicensed;
        }

        if (get(ingestData, 'externalId', '')) {
            params.externalId = ingestData.externalId;
        }

        if (template === STUDIO || isShowingCatalogType) {
            params.licensor = get(licensor, 'value.value', '');
            params.licensee = selectedLicensees.map(licensee => licensee.value).join(',');
        }

        if (template !== STUDIO) {
            params.internal = true;
            params.internalTemplateType = template;
        } else {
            params.internal = false;
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
        setSelectedLicensees([]);
        setCatalogType('');
        setIsLicensed(false);
    };

    const onCatalogueChange = value => {
        setCatalogType(value);
        template === USMASTER && setIsLicensed(true);
    };

    const isUploadEnabled = () => {
        const isShowingCatalogType = catalogType.value;
        if (isShowingCatalogType) {
            return serviceRegion && licensor && catalogType && selectedLicensees.length;
        }
        if (template === INTERNATIONAL || template === USMASTER) {
            return !isEmpty(serviceRegion);
        }
        return !isEmpty(serviceRegion) && licensor && selectedLicensees.length;
    };

    return (
        <div className="manual-ingest-config">
            <div className="manual-ingest-config__grid">
                <div className="manual-ingest-config--file-name">
                    <span>{fileName || file.name}</span>
                </div>
                <Button isDisabled={!!fileName} onClick={browseClick} className="manual-ingest-config__grid--browse">
                    Browse
                </Button>
            </div>
            <div className="manual-ingest-config__body">
                <div className="manual-ingest-config__templates">
                    <label className="manual-ingest-config__label">TEMPLATE</label>
                    <RadioGroup
                        label="Template"
                        options={templates}
                        onChange={onTemplateChange}
                        defaultValue={initialTemplate.value}
                    />
                </div>
                <div className="manual-ingest-config__fields">
                    {template === STUDIO && (
                        <div className="manual-ingest-config--licensor">
                            <label className="manual-ingest-config__label">LICENSOR</label>
                            <Select
                                id="manual-upload-licensor"
                                onChange={val => setLicensor(val)}
                                value={licensor}
                                options={licensors.map(lic => ({value: lic, label: lic.name}))}
                                placeholder="Select"
                                {...selectProps}
                            />
                        </div>
                    )}
                    {template !== USMASTER && (
                        <div className="manual-ingest-config--service-region">
                            <label className="manual-ingest-config__label">REGION</label>
                            <Select
                                id="manual-upload-service-region"
                                onChange={val => setServiceRegion(val)}
                                value={serviceRegion}
                                options={serviceRegionOptions}
                                placeholder="Select"
                                {...selectProps}
                            />
                        </div>
                    )}

                    {[STUDIO, LICENSEE].includes(template) && (
                        <div className="manual-ingest-config__licensee">
                            <label className="manual-ingest-config__label">LICENSEE</label>
                            <Select
                                id="manual-upload-licensee"
                                onChange={val => setSelectedLicensees(val || [])}
                                value={selectedLicensees}
                                options={licenseesOptions}
                                isDisabled={!serviceRegion}
                                placeholder="Select"
                                isMulti={template === STUDIO}
                                {...selectProps}
                            />
                            <div className="manual-ingest-config__sub-text">{LICENSEE_WARNING}</div>
                        </div>
                    )}
                    <div className="manual-ingest-config__catalog">
                        <div className="manual-ingest-config__catalog-options">
                            <div className="manual-ingest-config__catalog-select">
                                <label className="manual-ingest-config__label">CATALOGUE</label>
                                <Select
                                    id="manual-upload-catalog-type"
                                    onChange={val => onCatalogueChange(val)}
                                    value={catalogType}
                                    options={CATALOG_TYPES}
                                    isDisabled={false}
                                    placeholder="Select"
                                    {...selectProps}
                                />
                            </div>
                            <div className="manual-ingest-config__catalog-checkbox">
                                <Checkbox
                                    id="licensed-checkbox"
                                    label="Licensed"
                                    onChange={() => setIsLicensed(!isLicensed)}
                                    isChecked={isLicensed}
                                    isDisabled={template === USMASTER}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="manual-ingest-config__buttons">
                <Button shouldFitContainer isDisabled={isUploading} onClick={closeModal}>
                    Cancel
                </Button>
                <Button
                    shouldFitContainer
                    onClick={openIngestConfirmationModal}
                    className={!isUploadEnabled() ? '' : 'btn-primary'}
                    isLoading={isUploading}
                    isDisabled={!isUploadEnabled()}
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
    openModalCallback: PropTypes.func,
    closeModalCallback: PropTypes.func,
    file: PropTypes.object,
    isUploading: PropTypes.bool,
    ingestData: PropTypes.object,
    attachment: PropTypes.object,
};

InputForm.defaultProps = {
    licensors: [],
    licensees: [],
    uploadIngest: () => null,
    browseClick: () => null,
    openModalCallback: () => null,
    closeModalCallback: () => null,
    file: {},
    isUploading: false,
    ingestData: {},
    attachment: {},
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
