import React, {useState} from 'react';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {NEXUS_ENTITY_TYPES} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/constants';
import moment from 'moment';
import {Dropdown} from 'primereact/dropdown';
import {useDispatch} from 'react-redux';
import './Localization.scss';
import {setLocale} from '../../legacy/stores/actions/localization/setLocale';

const Localization = () => {
    const dispatch = useDispatch();
    const localeOptions = [
        {label: 'English (United States)', value: 'en-us', format: 'MM/DD/YYYY HH:MM:SS A'},
        {label: 'English (United Kingdom)', value: 'en-gb', format: 'DD/MM/YYYY HH:MM:SS A'},
    ];

    const initLocaleValue = () => localStorage.getItem('localization');

    const [localeValue, setLocaleValue] = useState(initLocaleValue());

    const onLocaleChange = e => {
        const value = e.value;
        localStorage.setItem('localization', value);
        dispatch(setLocale(value));
        moment.locale(value);
        setLocaleValue(value);
    };

    const getDateFormat = () => localeOptions.find(opt => opt.value === localeValue)?.format;

    const getDate = () => {
        const date = new Date();
        return `${moment(date).format(getDateFormat())} (UTC)`;
    };

    return (
        <div className="nexus-c-localization-panel h-100">
            <NexusEntity heading="Set Localization" type={NEXUS_ENTITY_TYPES.subheader} />
            <div className="nexus-c-localization-content mt-3">
                <div className="row">
                    <div className="col-12">
                        <div className="nexus-c-locale-wrapper">
                            <Dropdown
                                id="locale"
                                className="my-3"
                                value={localeValue}
                                options={localeOptions}
                                onChange={onLocaleChange}
                                optionLabel="label"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <NexusEntity heading="Preview" type={NEXUS_ENTITY_TYPES.subheader} />
            <div className="nexus-c-localization-content mt-3">
                <div className="row">
                    <div className="col-12">
                        <div className="nexus-c-locale-preview-wrapper">
                            <span>{getDate()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Localization.propTypes = {};

Localization.defaultProps = {};

export default Localization;
