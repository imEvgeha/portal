import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import {createInitialValues} from '../utils';
import {downloadFormSubtitle, downloadFormFields, cancelButton, downloadButton} from '../constants';
import './DownloadEmetModal.scss';

const DownloadEmetModal = ({closeModal}) => {
    const initialValues = createInitialValues(downloadFormFields);
    const [values, setValues] = useState(initialValues);

    const isDisabled = values ? !Object.values(values).every(value => Boolean(value) === true) : true;

    const buildField = field => {
        const {name, placeholder} = field;
        const updatedPlaceholder = `Select ${placeholder}...`;

        const getOptions = () => {
            // ...getting options from API
            return [
                {label: 'Test-1', value: 'test-1'},
                {label: 'Test-2', value: 'test-2'},
                {label: 'Test-3', value: 'test-3'},
            ];
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
                <Button className="download-emet-modal__button" isDisabled={isDisabled} appearance="primary">
                    {downloadButton}
                </Button>
            </div>
        </div>
    );
};

DownloadEmetModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
};

export default DownloadEmetModal;
