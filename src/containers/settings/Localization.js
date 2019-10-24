import React from 'react';
import connect from 'react-redux/es/connect/connect';
import styled from 'styled-components';
import Select from '@atlaskit/select';
import moment from 'moment';

import PropTypes from 'prop-types';
import {setLocale} from '../../stores/actions/localization/setLocale';
import { TextHeader } from '../../components/navigation/CustomNavigationElements';
import NexusDateTimePicker from '../../ui-elements/nexus-date-time-picker/NexusDateTimePicker';

const DataContainer = styled.div`
    width: 65%;
    float: left;
    height: calc(100vh - 90px);
    margin-left: 10px;
    padding: 15px;
`;

const DataBody = styled.div`
    width: 90%;
    margin: auto;
    padding: 10px;
`;

const PreviewText = styled.div`
    font-weight: bold;
    font-size: 16px;
    color: #111;
    margin-top: 10px;
`;


const Localization = ({changeLocale}) => {

    const getLocale = () => {
        let localStorageValue = localStorage.getItem('localization');
        return {label: localStorageValue == 'en-us' ? 'English (United States)' : localStorageValue === 'en-gb' ? 'English (United Kingdom)' : ''};
    };

    const handleChange = ({value}) => {
        localStorage.setItem('localization', value);
        changeLocale(value);
        moment.locale(value);
    };

    return (
        <DataContainer>
                <TextHeader>Set Localization
                    <div style={{clear: 'both'}} />
                </TextHeader>
                <DataBody>            
                    <Select
                    id="locale"
                    defaultValue={getLocale()}
                    isSearchable={false}
                    onChange={value => handleChange(value)}
                    options={[
                        { label: 'English (United States)', value: 'en-us' },
                        { label: 'English (United Kingdom)', value: 'en-gb' },
                    ]}
                    placeholder="Choose a Locale"
                    styles={{control: (base) => ({...base, fontSize: '14px'})}}
                    />

                    <PreviewText>Preview</PreviewText>
                        <NexusDateTimePicker
                            onChange={() => {}}
                            id="date" 
                            value="2018-04-30T00:00:00.000Z"                            
                            isWithInlineEdit={true}
                            onConfirm={() => {}}
                        />
                </DataBody>
            </DataContainer>
    );
};

Localization.propTypes = {
    changeLocale: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
    changeLocale: payload => dispatch(setLocale(payload))
});

export default connect(null, mapDispatchToProps)(Localization);