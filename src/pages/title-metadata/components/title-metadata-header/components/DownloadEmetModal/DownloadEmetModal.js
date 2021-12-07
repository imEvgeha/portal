import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import { downloadFile } from '@vubiquity-nexus/portal-utils/lib/Common';
import { connect } from 'react-redux';
import { downloadService } from '../../../../service/downloadService';
import {createInitialValues} from '../utils';
import {createLanguagesSelector, createCountrySelector} from './downloadEmetModalSelectors'
import {downloadFormSubtitle, downloadFormFields, cancelButton, downloadButton} from '../constants';
import './DownloadEmetModal.scss';

const DownloadEmetModal = ({closeModal, languages, locale}) => {
    const initialValues = createInitialValues(downloadFormFields);
    const [values, setValues] = useState(initialValues);

    const isDisabled = values ? !Object.values(values).every(value => Boolean(value) === true) : true;

    const buildField = field => {
        const {name, placeholder} = field;
        const updatedPlaceholder = `Select ${placeholder}...`;

        const getOptions = () => {
            if(name === 'status') {
                return [
                    {label: 'Pending', value: 'pending'},
                    {label: 'Complete', value: 'complete'},
                ];
            }
            if(name === 'language') {
                return languages.map((elem) => ({label: elem.value, value: elem.languageCode}))
            }
            if(name === 'locale') {
                return locale.map((elem) => ({label: elem.countryCode, value: elem.countryCode}))
            }
        };

        const handleChange = value => {
            values[name] = value;
            setValues({...values});
        };

        return (
            <div key={name} className="download-emet-modal__field">
                <label className="download-emet-modal__label">{name}</label>
                <div className="download-emet-modal__select-wrapper">
                    <Select
                        className="download-emet-modal__select"
                        options={getOptions()}
                        placeholder={updatedPlaceholder}
                        classNamePrefix="nexus-c-nexus-select"
                        value={values[name]}
                        onChange={handleChange}
                    />
                </div>
            </div>
        );
    };

    const handleDownload = () => {
        downloadService.downloadMetadata().then(response => {
            downloadFile(response)
        });
    };

    return (
        <div className="download-emet-modal">
            <h5 className="download-emet-modal__subtitle">{downloadFormSubtitle}</h5>
            <div className="download-emet-modal__fields">{downloadFormFields.map(field => buildField(field))}</div>
            <div className="download-emet-modal__buttons">
                <Button
                    onClick={() => {
                        closeModal();
                    }}
                >
                    {cancelButton}
                </Button>
                <Button onClick={handleDownload} className="download-emet-modal__button" isDisabled={isDisabled} appearance="primary">
                    {downloadButton}
                </Button>
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
};

export default connect(createMapStateToProps, null)(DownloadEmetModal);
