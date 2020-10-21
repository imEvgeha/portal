import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import {HelperMessage} from '@atlaskit/form';
import CheckIcon from '@atlaskit/icon/glyph/check';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import Select from '@atlaskit/select/dist/cjs/Select';
import Tag from '@atlaskit/tag';
import {get} from 'lodash';
import './ComponentsPicker.scss';
import {header, rows, createDynamicRows} from './constants';

// eslint-disable-next-line react/prop-types
const Header = ({heading, title, barcode}) => {
    return (
        <div className="picker__header">
            <h3>{heading}</h3>
            <b>{title}</b>
            <p>{barcode}</p>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const Footer = ({warning, onCancel, onSave}) => {
    return (
        <div className="picker__footer">
            <p>{warning}</p>
            <div className="picker__footer-buttons">
                <Button onClick={onCancel}>Cancel</Button>
                <Button appearance="primary" onClick={onSave}>
                    save
                </Button>
            </div>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const AudioChannelsTable = ({dataRows = rows}) => {
    return (
        <div className="picker__audio-panel">
            <b>Step 2: Select Audio Channels</b>
            <div className="picker__audio-panel-table">
                <DynamicTable
                    head={header}
                    rows={dataRows}
                    rowsPerPage={5}
                    defaultPage={1}
                    loadingSpinnerSize="large"
                    isLoading={false}
                />
            </div>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const ListItem = ({item}) => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
                <CheckIcon size="medium" primaryColor="grey" />
                <Tag text={item} />
            </div>
            <EditorRemoveIcon size="medium" primaryColor="grey" />
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const SummaryPanel = ({list = []}) => {
    return (
        <div className="picker__summary-panel">
            <HelperMessage>Audio Service Summary</HelperMessage>
            {list.map(item => (
                <ListItem key={item} item={item} />
            ))}
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const SelectionPanel = ({data}) => {
    // eslint-disable-next-line react/prop-types
    const {languageOptions, trackConfiguration, language, setLanguage, track, setTrack} = data;

    return (
        <div>
            <b>Step 1: Filter Language and Track configuration</b>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '340px',
                    justifyContent: 'space-between',
                    padding: '10px',
                }}
            >
                <div>
                    <HelperMessage>Language</HelperMessage>
                    <Select
                        id="language-select"
                        name="language-select"
                        className="picker__select"
                        options={languageOptions}
                        value={language}
                        onChange={val => setLanguage(val)}
                    />
                </div>
                <div>
                    <HelperMessage>Track configuration</HelperMessage>
                    <Select
                        id="track-select"
                        name="track-select"
                        className="picker__select"
                        options={trackConfiguration}
                        value={track}
                        onChange={val => setTrack(val)}
                    />
                </div>
            </div>
        </div>
    );
};

const AddtoService = () => {
    return (
        <div className="picker__service-panel">
            <b>Step 3: Add to Service</b>
            <Button onClick={null}>Add to service</Button>
        </div>
    );
};

const getAudioChannelsForLangTrack = (lang, track, audioComponentArray) => {
    console.log(' lang, track ', lang, track);
    const audioComponent = audioComponentArray.find(
        item => item.language === lang.value && item.trackConfiguration === track.value
    );
    console.log(' audioComponent found: ', audioComponent);
    return get(audioComponent, 'components', []);
};

// eslint-disable-next-line react/prop-types
const AudioComponentsPicker = ({data}) => {
    const [language, setLanguage] = useState('');
    const [track, setTrack] = useState('');

    // eslint-disable-next-line react/prop-types
    const {audioSummary, title, barcode, audioComponentArray = []} = data;
    const audioChannels = getAudioChannelsForLangTrack(language, track, audioComponentArray);

    const languageOptions = audioComponentArray.map(item => {
        const lang = get(item, 'language', '');
        return {value: lang, label: lang};
    });

    const trackConfiguration = audioComponentArray.map(item => {
        const track = get(item, 'trackConfiguration', '');
        return {value: track, label: track};
    });

    const selectionData = {
        languageOptions,
        trackConfiguration,
        language,
        setLanguage,
        track,
        setTrack,
    };

    console.log('audioChannels ', audioChannels);

    return (
        <div>
            <Header heading="Add Audio Components" title={title} barcode={barcode} />
            <hr className="solid" />
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <SelectionPanel data={selectionData} />
                    <AudioChannelsTable dataRows={createDynamicRows(audioChannels)} />
                    <AddtoService />
                </div>
                <SummaryPanel list={audioSummary} />
            </div>
            <hr className="solid" />
        </div>
    );
};

export const ComponentsPicker = ({data, closeModal, save}) => {
    console.log('component picker data: ', data);
    const {audioSummary, title, barcode, components, assetType} = data;
    return (
        <div>
            {assetType === 'Audio' && <AudioComponentsPicker data={data} />}
            <Footer onCancel={closeModal} onSave={save} />
        </div>
    );
};

ComponentsPicker.propTypes = {
    data: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
};

ComponentsPicker.defaultProps = {};

export default ComponentsPicker;
