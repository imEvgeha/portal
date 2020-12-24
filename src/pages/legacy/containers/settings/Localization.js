import React from 'react';
import {connect} from 'react-redux';
import Select from '@atlaskit/select';
import moment from 'moment';
import PropTypes from 'prop-types';
import './Localization.scss';
import {setLocale} from '../../stores/actions/localization/setLocale';
import {TextHeader} from '../../components/navigation/CustomNavigationElements';
import NexusDateTimePicker from '@vubiquity-nexus/portal-ui/lib/elements/nexus-date-and-time-elements/nexus-date-time-picker/NexusDateTimePicker';

const Localization = ({changeLocale}) => {
    const getLocale = () => {
        const localStorageValue = localStorage.getItem('localization');
        return {
            label:
                localStorageValue === 'en-us'
                    ? 'English (United States)'
                    : localStorageValue === 'en-gb'
                    ? 'English (United Kingdom)'
                    : '',
        };
    };

    const handleChange = ({value}) => {
        localStorage.setItem('localization', value);
        changeLocale(value);
        moment.locale(value);
    };

    return (
        <div className="nexus-c-settings-localization">
            <TextHeader>
                Set Localization
                <div style={{clear: 'both'}} />
            </TextHeader>
            <div className="nexus-c-settings-localization__data-body">
                <Select
                    id="locale"
                    defaultValue={getLocale()}
                    isSearchable={false}
                    onChange={handleChange}
                    options={[
                        {label: 'English (United States)', value: 'en-us'},
                        {label: 'English (United Kingdom)', value: 'en-gb'},
                    ]}
                    placeholder="Choose a Locale"
                    styles={{control: base => ({...base, fontSize: '14px'})}}
                />

                <div className="nexus-c-settings-localization__preview-text">Preview</div>
                <NexusDateTimePicker
                    onChange={() => {
                        /* Empty because it's just for preview */
                    }}
                    id="date"
                    value="2018-04-30T00:00:00.000Z"
                    isWithInlineEdit={true}
                    onConfirm={() => {
                        /* Empty because it's just for preview */
                    }}
                />
            </div>
        </div>
    );
};

Localization.propTypes = {
    changeLocale: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
    changeLocale: payload => dispatch(setLocale(payload)),
});

export default connect(null, mapDispatchToProps)(Localization);
