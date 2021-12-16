import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { downloadFile } from '@vubiquity-nexus/portal-utils/lib/Common';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { connect } from 'react-redux';
import { exportService } from '../../../../../legacy/containers/avail/service/ExportService';
import {createInitialValues} from '../utils';
import {createLanguagesSelector, createCountrySelector} from './downloadEmetModalSelectors'
import {downloadFormSubtitle, downloadFormFields, cancelButton, downloadButton} from '../constants';
import './DownloadEmetModal.scss';

const DownloadEmetModal = ({closeModal, languages, locale, showSuccess, showError}) => {
    const initialValues = createInitialValues(downloadFormFields);
    const [values, setValues] = useState(initialValues);

    const isDisabled = values ? !Object.values(values).every(value => Boolean(value) === true) : true;
    const buildField = field => {
        const {name, placeholder} = field;
        const updatedPlaceholder = `Select ${placeholder}...`;
        const isItStatus = name === 'status';
        const isItLanguage = name === 'language';
        const isItLocale = name === 'locale';

        const getOptions = () => {
            if(isItStatus) {
                return [
                    {label: 'Pending', value: 'pending'},
                    {label: 'Complete', value: 'complete'},
                ];
            }
            if(isItLanguage) {
                return languages.map((elem) => ({label: elem.value, value: elem.languageCode}))
            }
            if(isItLocale) {
                return locale.map((elem) => ({label: elem.countryName, value: elem.countryCode}))
            }
        };

        const selectCompare = (a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0;

        const handleChange = (event) => {
            values[name] = event.value;
            setValues({...values});
        };

        return (
            <div key={name} className="nexus-c-download-emet-modal__field">
                <label className="nexus-c-download-emet-modal__label">{name}</label>
                <div className="nexus-c-download-emet-modal__select-wrapper">
                    <Dropdown 
                        className="nexus-c-download-emet-modal__select" 
                        value={values?.[name]}
                        options={getOptions().sort(selectCompare)}
                        onChange={handleChange}
                        optionLabel="label"
                        filterBy="label"
                        placeholder={updatedPlaceholder}
                        filter={!isItStatus}
                    />
                </div>
            </div>
        );
    };

    const handleDownload = () => {
        exportService.bulkExportMetadata(values)
            .then(response => {
                const buffer = new Uint8Array(response.value).buffer;
                const buftype = 'application/vnd.ms-excel;charset=utf-8';
                const blob = new Blob([buffer], {type: buftype});
                showSuccess();
                closeModal()
                downloadFile(blob, 'Editorial_Metadata');
            }).catch(err => showError(err))
    };

    return (
        <div className="nexus-c-download-emet-modal">
            <h5 className="nexus-c-download-emet-modal__subtitle">{downloadFormSubtitle}</h5>
            <div className="nexus-c-download-emet-modal__fields">{downloadFormFields.map(field => buildField(field))}</div>
            <div className="nexus-c-download-emet-modal__buttons">
                <Button
                    onClick={() => {closeModal()}}
                    className="p-button-outlined p-button-secondary nexus-c-cancel-button"
                    label={cancelButton}
                />
                <Button
                    label={downloadButton}
                    onClick={handleDownload}
                    className="nexus-c-download-emet-modal__button"
                    disabled={isDisabled}
                    className="p-button-outlined p-button-secondary"
                />
            </div>
        </div>
    );
};

const createMapStateToProps = () => {
    const metadataLanguagesSelector = createLanguagesSelector();
    const metadataCountrySelector = createCountrySelector();
    return (state, props) => ({
        languages: metadataLanguagesSelector(state, props),
        locale: metadataCountrySelector(state, props),
    });
};

DownloadEmetModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    languages: PropTypes.array.isRequired,
    locale: PropTypes.array.isRequired,
    showSuccess: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
};

export default connect(createMapStateToProps, null)(DownloadEmetModal);
