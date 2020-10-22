import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import {HelperMessage} from '@atlaskit/form';
import CheckIcon from '@atlaskit/icon/glyph/check';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import Select from '@atlaskit/select/dist/cjs/Select';
import Tag from '@atlaskit/tag';
import {get, uniqBy, groupBy, pickBy, values} from 'lodash';
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
const AudioChannelsTable = ({dataRows}) => {
    return (
        <div className="picker__audio-panel">
            <b>Step 2: Select Audio Channels</b>
            <div className="picker__audio-panel-table">
                <DynamicTable head={header} rows={dataRows} rowsPerPage={5} defaultPage={1} />
            </div>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const ListItem = ({item, onDelete}) => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '11px'}}>
            <div>
                <CheckIcon size="medium" primaryColor="grey" />
                {/* eslint-disable-next-line react/prop-types */}
                <Tag text={item} />
            </div>
            <div onClick={onDelete}>
                <EditorRemoveIcon size="medium" primaryColor="grey" />
            </div>
        </div>
    );
};

/* <ListItem key={`${item.language}${item.trackConfig}${item.channelNumber}`} item={item} onDelete={()=>onDelete(item)}/> */
// eslint-disable-next-line react/prop-types
const SummaryPanel = ({list = [], setComponents, remove}) => {
    // const onDelete = item => setComponents(list.filter(row=> `${row.channelNumber}${row.trackConfig}` !== `${item.channelNumber}${item.trackConfig}`));
    const onDelete = key => remove(key);
    return (
        <div className="picker__summary-panel">
            <HelperMessage>Audio Service Summary</HelperMessage>
            {list.map(item => (
                <ListItem key={item} item={item} onDelete={() => onDelete(item)} />
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
                    <HelperMessage>Language / MFX</HelperMessage>
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

// eslint-disable-next-line react/prop-types
const AddtoService = ({isEnabled, onClick, count}) => {
    return (
        <div className="picker__service-panel">
            <b>Step 3: Add to Service ({count})</b>
            <Button appearance="primary" isDisabled={!isEnabled} onClick={onClick}>
                Add to service ({count})
            </Button>
        </div>
    );
};

const getAudioChannelsForLangTrack = (lang, track, audioComponentArray) => {
    const audioComponent = audioComponentArray.find(
        item => item.language === lang.value && item.trackConfiguration === track.value
    );
    return get(audioComponent, 'components', []);
};

// eslint-disable-next-line react/prop-types
const AudioComponentsPicker = ({data}) => {
    const [language, setLanguage] = useState('');
    const [track, setTrack] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    // eslint-disable-next-line react/prop-types
    // eslint-disable-next-line react/prop-types
    const [components, setComponents] = useState(data.audioSummary || {});

    // eslint-disable-next-line react/prop-types
    const {audioSummary, title, barcode, audioComponentArray = []} = data;

    const languageOptions = uniqBy(
        audioComponentArray.map(item => {
            const lang = get(item, 'language', '');
            return {value: lang, label: lang};
        }),
        'value'
    );

    const trackConfiguration = uniqBy(
        audioComponentArray.map(item => {
            const track = get(item, 'trackConfiguration', '');
            return {value: track, label: track};
        }),
        'value'
    );

    const audioChannels = getAudioChannelsForLangTrack(language, track, audioComponentArray);

    const checkboxData = audioChannels.map(item => {
        return {
            isChecked: false,
            ...item,
        };
    });

    useEffect(() => {
        setLanguage(languageOptions[0]);
        setTrack(trackConfiguration[0]);
    }, [data]);

    useEffect(() => {
        setTableRows(checkboxData);
    }, [language, track]);

    useEffect(() => {
        setSelectedRows(tableRows.filter(item => item.isChecked === true));
    }, [tableRows]);

    const saveComponentsLocally = () => {
        // setComponents(prev => uniqBy([...prev,...selectedRows],v => [v.channelNumber, v.language].join()));
        const ca = values(components).map(item => values(item));
        console.log('save to local componentns, selectedRows: ', components, selectedRows, ...values(components), [
            ...[...values(components), ...selectedRows],
        ]);
        setComponents(prev => {
            return Object.keys(prev).length
                ? groupBy(
                      uniqBy([...values(prev), ...selectedRows], v => [v.channelNumber, v.language].join()),
                      v => [v.language, v.trackConfig].join()
                  )
                : groupBy([...selectedRows], v => [v.language, v.trackConfig].join());
        });
    };

    const removeComponent = keytoRemove => {
        const newComponents = pickBy(components, (_, key) => key !== keytoRemove);
        setComponents(newComponents);
    };

    const selectionData = {
        languageOptions,
        trackConfiguration,
        language,
        setLanguage,
        track,
        setTrack,
    };

    console.log('components, list', components, Object.keys(components));
    //  console.log('audioChannels ', audioChannels);

    return (
        <div>
            <Header heading="Add Audio Components" title={title} barcode={barcode} />
            <hr className="solid" />
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <SelectionPanel data={selectionData} />
                    <AudioChannelsTable dataRows={createDynamicRows(tableRows, setTableRows)} />
                    <AddtoService
                        isEnabled={selectedRows.length}
                        onClick={saveComponentsLocally}
                        count={selectedRows.length}
                    />
                </div>
                <SummaryPanel list={Object.keys(components)} setComponents={setComponents} remove={removeComponent} />
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
