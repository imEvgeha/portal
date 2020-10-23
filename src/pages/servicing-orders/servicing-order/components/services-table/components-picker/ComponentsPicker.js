import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import Flag from '@atlaskit/flag';
import {HelperMessage} from '@atlaskit/form';
import CheckIcon from '@atlaskit/icon/glyph/check';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Select from '@atlaskit/select/dist/cjs/Select';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import {get, uniqBy, groupBy, pickBy, forIn, flattenDeep, trimEnd, omit} from 'lodash';
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
const Footer = ({warning, onCancel, onSave, count}) => {
    return (
        <div className="picker__footer">
            <p>{warning}</p>
            <div className="picker__footer-buttons">
                <Button onClick={onCancel}>Cancel</Button>
                <Button appearance="primary" onClick={onSave} isDisabled={count === 0}>
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
                <Tooltip key={item.name} content={item.tooltip}>
                    <ListItem item={item.name} onDelete={() => onDelete(item.name)} />
                </Tooltip>
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
const AudioComponentsPicker = ({data, closeModal, save, index}) => {
    const [language, setLanguage] = useState('');
    const [track, setTrack] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    // eslint-disable-next-line react/prop-types
    // eslint-disable-next-line react/prop-types
    const [components, setComponents] = useState(groupBy(data.audioSummary, v => [v.language, v.trackConfig] || {}));

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

        setComponents(prev => {
            return Object.keys(prev).length
                ? groupBy(
                      uniqBy(flattenDeep([...Object.values(components), ...selectedRows]), v =>
                          [v.channelNumber, v.language, v.trackConfig].join()
                      ),
                      v => [v.language, v.trackConfig].join()
                  )
                : groupBy([...selectedRows], v => [v.language, v.trackConfig].join());
        });
        setSelectedRows([]);
        unCheckAll();
        console.log(
            'save to local componentns, selectedRows: ',
            flattenDeep(Object.values(components)),
            flattenDeep([...Object.values(components), ...selectedRows])
        );
    };

    const unCheckAll = () => {
        setTableRows(prev =>
            prev.map(item => {
                return {...item, isChecked: false};
            })
        );
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

    console.log('components', components);
    //  console.log('audioChannels ', audioChannels);

    const getToolTipText = () => {
        const list = [];
        forIn(components, (val, key) => {
            let tooltip = '';
            val.forEach((item, index) => {
                tooltip += `${(index + 1).toString()  }. ${  item.channelPosition  }, `;
            });
            list.push({name: key, tooltip: trimEnd(tooltip, ', ')});
        });
        return list;
    };

    const componentsWithToolTipText = getToolTipText();

    const saveComponentsInRow = () => {
        save(index, components);
        closeModal();
    };

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
                <SummaryPanel list={componentsWithToolTipText} setComponents={setComponents} remove={removeComponent} />
            </div>
            <hr className="solid" />
            <Footer onCancel={closeModal} onSave={saveComponentsInRow} count={Object.keys(components).length} />
        </div>
    );
};

const notAvailableFlag = desc => (
    <Flag
        icon={<ErrorIcon primaryColor="red" label="Info" />}
        description={desc}
        id="1"
        key="1"
        title="Not Available"
    />
);

export const ComponentsPicker = ({data, closeModal, save, index}) => {
    console.log('component picker data: ', data);
    const {audioComponentArray, assetType} = data;
    return (
        <div>
            {assetType === 'Audio' ? (
                audioComponentArray.length ? (
                    <AudioComponentsPicker data={data} closeModal={closeModal} save={save} index={index} />
                ) : (
                    notAvailableFlag('Audio channels does not exists for this barcode. Try another barcode.')
                )
            ) : (
                notAvailableFlag('Selection not available for this asset at the moment.')
            )}
        </div>
    );
};

ComponentsPicker.propTypes = {
    data: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

ComponentsPicker.defaultProps = {};

export default ComponentsPicker;
