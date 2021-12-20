import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from 'primereact/dropdown';
import {connect} from 'react-redux';
import {createLanguagesSelector, createCountrySelector} from './downloadEmetModalSelectors';
import {downloadFormSubtitle, downloadFormFields} from '../constants';
import './DownloadEmetModal.scss';

const DownloadEmetModal = ({languages, locale, values, setValues}) => {

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
                        filterBy="label,value"
                        placeholder={updatedPlaceholder}
                        filter={!isItStatus}
                    />
                </div>
            </div>
        );
    };


    return (
        <div className="nexus-c-download-emet-modal">
            <h5 className="nexus-c-download-emet-modal__subtitle">{downloadFormSubtitle}</h5>
            <div className="nexus-c-download-emet-modal__fields">
                {downloadFormFields.map(field => buildField(field))}
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
    languages: PropTypes.array.isRequired,
    locale: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
    setValues: PropTypes.func.isRequired,
};

export default connect(createMapStateToProps, null)(DownloadEmetModal);
