import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import { ERROR_ICON, SUCCESS_ICON } from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import { downloadFile } from '@vubiquity-nexus/portal-utils/lib/Common';
import { connect } from 'react-redux';
import {compose} from 'redux';
import { exportService } from '../../../../../legacy/containers/avail/service/ExportService';
import {createInitialValues} from '../utils';
import {createLanguagesSelector, createCountrySelector} from './downloadEmetModalSelectors'
import {downloadFormSubtitle, downloadFormFields, cancelButton, downloadButton, successDownloadTitle, successDownloadDesc, failureDownloadTitle, failureDownloadDesc} from '../constants';
import './DownloadEmetModal.scss';

const DownloadEmetModal = ({closeModal, languages, locale, addToast}) => {
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
        exportService.bulkExportMetadata(values)
            .then(response => {
                const buffer = new Uint8Array(response.value).buffer;
                const buftype = 'application/vnd.ms-excel;charset=utf-8';
                const blob = new Blob([buffer], {type: buftype});
                downloadFile(blob);
                addToast({
                    title: successDownloadTitle,
                    description: successDownloadDesc,
                    icon: SUCCESS_ICON,
                    isWithOverlay: true,
                    isAutoDismiss: true,
                });
            }).catch(err => {
                addToast({
                    title: failureDownloadTitle,
                    description: `${failureDownloadDesc} - ${err}`,
                    icon: ERROR_ICON,
                    isWithOverlay: true,
                    isAutoDismiss: true,
                });
            })
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
    addToast: PropTypes.func,
};

DownloadEmetModal.defaultProps = {
    addToast: () => null,
}

export default compose(
    withToasts,
    // eslint-disable-next-line
    connect(createMapStateToProps, null)
)(DownloadEmetModal);
