import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {RadioGroup} from '@atlaskit/radio';
import {Dropdown, MultiSelect, Button} from '@portal/portal-components';
import {createLoadingSelector} from '@vubiquity-nexus/portal-ui/lib/loading/loadingSelectors';
import {get, isEmpty} from 'lodash';
import {connect} from 'react-redux';
import constants from '../../../constants';
import {uploadIngest} from '../../../ingestActions';
import {getLicensees, getLicenseTypes, getLicensors, getTerritories} from '../../../ingestSelectors';
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
    licenseTypes,
    countries,
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

    const getLicensor = template === STUDIO && ingestLicensor;

    const [licensor, setLicensor] = useState(getLicensor);
    const [selectedLicenseTypes, setSelectedLicenseTypes] = useState([]);
    const [selectedTerritories, setSelectedTerritories] = useState([]);

    const [licenseesOptions, setLicenseesOptions] = useState([]);
    const [selectedLicensees, setSelectedLicensees] = useState([]);

    const [serviceRegion, setServiceRegion] = useState(
        ingestServiceRegion ? {label: ingestServiceRegion, value: ingestServiceRegion} : ''
    );
    const [catalogType, setCatalogType] = useState('');
    const [isLicensed, setIsLicensed] = useState(false);

    useEffect(() => {
        if (template === STUDIO && !ingestData) {
            const serviceRegions = get(licensor, 'servicingRegions', []);
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
                licensor={licensor.name}
                serviceRegion={serviceRegion.value}
                licensee={
                    template === STUDIO
                        ? selectedLicensees.map(licensee => licensee.value).join(', ')
                        : get(selectedLicensees, 'value')
                }
                isCatalog={!!catalogType.value}
                catalogType={catalogType.value}
                isLicenced={isLicensed}
                onActionCancel={closeModalCallback}
                onActionConfirm={uploadHandler}
                territories={selectedTerritories.map(territory => territory.value).join(',')}
                licenseTypes={selectedLicenseTypes.map(licenseType => licenseType.value).join(',')}
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

        const isShowingCatalogType = !!catalogType.value;
        if (isShowingCatalogType) {
            params.catalogUpdate = isShowingCatalogType;
            params.catalogType = catalogType.value;
            if (catalogType.value === 'Title Catalog') {
                if (!isEmpty(selectedLicenseTypes)) {
                    params.licenseTypes = selectedLicenseTypes.map(licenseType => licenseType.value).join(',');
                }
                if (!isEmpty(selectedTerritories)) {
                    params.territories = selectedTerritories.map(territory => territory.value).join(',');
                }
            }
        }

        if (get(ingestData, 'externalId', '')) {
            params.externalId = ingestData.externalId;
        }

        if (template === LICENSEE) {
            params.isLicenseeTemplate = true;
            params.licensee = get(selectedLicensees, 'value', '');
        }

        if (template === STUDIO) {
            params.licensor = get(licensor, 'value', '');
            params.licensee = selectedLicensees.map(licensee => licensee.value).join(',');
        }

        if ([INTERNATIONAL, USMASTER].includes(template)) {
            params.internal = true;
            params.internalTemplateType = template;
        } else {
            params.internal = false;
        }

        uploadIngest(params);
    };

    const serviceRegionOptions = get(licensor, 'value')
        ? get(licensor, 'servicingRegions', []).map(({servicingRegionName}) => ({
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
        if (template === INTERNATIONAL || template === USMASTER) {
            return !isEmpty(serviceRegion);
        }
        if (template === LICENSEE) {
            return !isEmpty(serviceRegion) && !isEmpty(selectedLicensees);
        }
        return !isEmpty(serviceRegion) && licensor && selectedLicensees.length;
    };

    return (
        <div className="manual-ingest-config">
            <div className="manual-ingest-config__grid d-flex justify-content-between">
                <div className="manual-ingest-config--file-name">
                    <span>{fileName || file.name}</span>
                </div>
                <Button
                    label="Browse"
                    disabled={!!fileName}
                    onClick={browseClick}
                    className="p-button-outlined p-button-secondary manual-ingest-config__grid--browse"
                />
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
                            <Dropdown
                                {...selectProps}
                                id="manual-upload-licensor"
                                labelProps={{
                                    label: 'Licensor',
                                    stacked: true,
                                    shouldUpper: true,
                                }}
                                value={licensor.value}
                                columnClass="col-12"
                                filter={true}
                                placeholder="Select"
                                options={licensors}
                                optionLabel="name"
                                onChange={e => {
                                    const value = licensors.find(x => x.value === e.value);
                                    setLicensor(value);
                                }}
                            />
                        </div>
                    )}
                    {template !== USMASTER && (
                        <div className="manual-ingest-config--service-region">
                            <Dropdown
                                {...selectProps}
                                id="manual-upload-service-region"
                                labelProps={{
                                    label: 'Region',
                                    stacked: true,
                                    shouldUpper: true,
                                }}
                                value={serviceRegion.value}
                                columnClass="col-12"
                                placeholder="Select"
                                options={serviceRegionOptions}
                                onChange={e => {
                                    const value = serviceRegionOptions.find(x => x.value === e.value);
                                    setServiceRegion(value);
                                }}
                            />
                        </div>
                    )}

                    {[STUDIO, LICENSEE].includes(template) && (
                        <div className="manual-ingest-config__licensee">
                            {LICENSEE === template && (
                                <Dropdown
                                    {...selectProps}
                                    id="manual-upload-licensee"
                                    labelProps={{
                                        label: 'Licensee',
                                        stacked: true,
                                        shouldUpper: true,
                                    }}
                                    filter={true}
                                    value={selectedLicensees.value}
                                    options={licenseesOptions}
                                    disabled={!serviceRegion}
                                    columnClass="col-12"
                                    placeholder="Select"
                                    onChange={e => {
                                        const value = licenseesOptions.find(x => x.value === e.value);
                                        setSelectedLicensees(value || []);
                                    }}
                                />
                            )}

                            {STUDIO === template && (
                                <MultiSelect
                                    {...selectProps}
                                    id="manual-upload-licensee"
                                    labelProps={{
                                        label: 'Licensee',
                                        stacked: true,
                                        shouldUpper: true,
                                    }}
                                    filter={true}
                                    value={selectedLicensees.map(l => l.value)}
                                    options={licenseesOptions}
                                    disabled={!serviceRegion}
                                    columnClass="col-12"
                                    placeholder="Select"
                                    onChange={e => {
                                        const values = licenseesOptions.filter(l => e.value.includes(l.value));
                                        setSelectedLicensees(values || []);
                                    }}
                                />
                            )}

                            <div className="manual-ingest-config__sub-text">{LICENSEE_WARNING}</div>
                        </div>
                    )}
                    <div className="manual-ingest-config__catalog">
                        <div className="manual-ingest-config__catalog-options">
                            <div className="manual-ingest-config__catalog-select">
                                <Dropdown
                                    {...selectProps}
                                    id="manual-upload-catalog-type"
                                    labelProps={{
                                        label: 'Catalogue',
                                        stacked: true,
                                        shouldUpper: true,
                                    }}
                                    value={catalogType.value}
                                    options={CATALOG_TYPES}
                                    columnClass="col-12"
                                    placeholder="Select"
                                    onChange={e => {
                                        const value = CATALOG_TYPES.find(x => x.value === e.value);
                                        onCatalogueChange(value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {get(catalogType, 'value', '') === 'Title Catalog' && (
                        <>
                            <div className="manual-ingest-config__license-types">
                                <MultiSelect
                                    {...selectProps}
                                    id="manual-upload-license-types"
                                    labelProps={{
                                        label: 'License Types',
                                        stacked: true,
                                        shouldUpper: true,
                                    }}
                                    filter={true}
                                    value={selectedLicenseTypes.map(l => l.value)}
                                    options={licenseTypes.map(lic => ({value: lic.value, label: lic.value}))}
                                    columnClass="col-12"
                                    placeholder="Select"
                                    onChange={e => {
                                        const values = licenseTypes
                                            .filter(l => e.value.includes(l.value))
                                            .map(lic => ({value: lic.value, label: lic.value}));
                                        setSelectedLicenseTypes(values || []);
                                    }}
                                />
                            </div>
                            <div className="manual-ingest-config__territory">
                                <MultiSelect
                                    {...selectProps}
                                    id="manual-upload-territory"
                                    labelProps={{
                                        label: 'Territory',
                                        stacked: true,
                                        shouldUpper: true,
                                    }}
                                    filter={true}
                                    value={selectedTerritories.map(l => l.value)}
                                    options={countries.map(lic => ({value: lic.countryCode, label: lic.countryName}))}
                                    columnClass="col-12"
                                    placeholder="Select"
                                    onChange={e => {
                                        const values = countries
                                            .filter(l => e.value.includes(l.countryCode))
                                            .map(lic => ({value: lic.countryCode, label: lic.countryName}));
                                        setSelectedTerritories(values || []);
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="manual-ingest-config__buttons">
                <Button
                    label="Cancel"
                    className="p-button-outlined p-button-secondary"
                    disabled={isUploading}
                    onClick={closeModal}
                />
                <Button
                    label="Upload"
                    onClick={openIngestConfirmationModal}
                    className={`${!isUploadEnabled() ? '' : 'btn-primary'} p-button-outlined`}
                    disabled={!isUploadEnabled() || isUploading}
                    loading={isUploading}
                />
            </div>
        </div>
    );
};

InputForm.propTypes = {
    licenseTypes: PropTypes.array,
    licensors: PropTypes.array,
    countries: PropTypes.array,
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
    licenseTypes: [],
    licensors: [],
    countries: [],
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
        licenseTypes: getLicenseTypes(state),
        licensors: getLicensors(state),
        licensees: getLicensees(state),
        isUploading: loadingSelector(state),
        countries: getTerritories(state),
    };
};

const mapDispatchToProps = dispatch => ({
    uploadIngest: payload => dispatch(uploadIngest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);
