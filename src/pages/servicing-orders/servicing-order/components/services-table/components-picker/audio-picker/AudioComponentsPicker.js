/* eslint react/prop-types: 0 */
import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import DynamicTable from '@atlaskit/dynamic-table';
import SectionMessage from '@atlaskit/section-message';
import {Dropdown} from '@portal/portal-components';
import {differenceBy, flattenDeep, get, groupBy, pickBy, uniqBy} from 'lodash';
import {AddToService, Footer, Header} from '../ComponentsPicker';
import {createDynamicTableRows, getAudioChannelsForLangTrack, getToolTipText} from '../pickerUtils';
import AudioSummaryPanel from './AudioSummaryPanel';
import {AUDIO_CHANNEL_EXISTS, header} from '../constants';
import './AudioComponentPicker.scss';

export const AudioChannelsTable = ({dataRows, checkAll, unCheckAll}) => {
    const [checkedAll, setCheckedAll] = useState(false);
    const setToggle = () => {
        setCheckedAll(prev => !prev);
    };

    useEffect(() => {
        checkedAll ? checkAll() : unCheckAll();
    }, [checkedAll]);

    header.cells[0] = {
        key: 'check',
        content: <Checkbox id="header-check" name="header-check" isChecked={checkedAll} onChange={setToggle} />,
        width: 5,
    };

    return (
        <div className="audio-picker__audio-panel">
            <b>Step 2: Select Audio Channels</b>
            <div className="audio-picker__audio-panel-table">
                {dataRows.length === 0 ? (
                    <SectionMessage>
                        <p>No Channels found for this combination</p>
                    </SectionMessage>
                ) : (
                    <DynamicTable head={header} rows={dataRows} rowsPerPage={5} defaultPage={1} />
                )}
            </div>
        </div>
    );
};

const SelectionPanel = ({data}) => {
    const {languageOptions, trackConfiguration, language, setLanguage, track, setTrack} = data;

    return (
        <div>
            <b>Step 1: Filter Language and Track configuration</b>
            <div className="audio-picker__selection-panel">
                <div>
                    <Dropdown
                        labelProps={{
                            label: 'Language / MFX',
                            shouldUpper: false,
                            stacked: true,
                        }}
                        id="language-select"
                        name="language-select"
                        className="audio-picker__select"
                        options={languageOptions}
                        value={language.value}
                        onChange={e => {
                            const value = languageOptions.find(x => x.value === e.value);
                            setLanguage(value);
                        }}
                    />
                </div>
                <div>
                    <Dropdown
                        labelProps={{
                            label: 'Track configuration',
                            shouldUpper: false,
                            stacked: true,
                        }}
                        id="track-select"
                        name="track-select"
                        className="audio-picker__select"
                        options={trackConfiguration}
                        value={track.value}
                        onChange={e => {
                            const value = trackConfiguration.find(x => x.value === e.value);
                            setTrack(value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const AudioComponentsPicker = ({data, closeModal, saveComponentData, index}) => {
    const [language, setLanguage] = useState('');
    const [track, setTrack] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [components, setComponents] = useState(groupBy(data.compSummary, v => [v.language, v.trackConfig] || {}));
    const [warningText, setWarningText] = useState('');
    const {title, barcode, componentArray: audioComponentArray = []} = data;

    const languageOptions = useMemo(
        () =>
            uniqBy(
                audioComponentArray.map(item => {
                    const lang = get(item, 'language', '');
                    return {value: lang, label: lang};
                }),
                'value'
            ),
        []
    );

    const trackConfiguration = useMemo(
        () =>
            uniqBy(
                audioComponentArray.map(item => {
                    const track = get(item, 'trackConfiguration', '');
                    return {value: track, label: track};
                }),
                'value'
            ),
        []
    );

    const audioChannels = useMemo(
        () => getAudioChannelsForLangTrack(language, track, audioComponentArray),
        [language, track]
    );

    const checkboxData = useMemo(
        () =>
            audioChannels.map(item => {
                return {
                    isChecked: false,
                    ...item,
                };
            }),
        [language, track]
    );

    const flattenComponents = useMemo(() => flattenDeep(Object.values(components)), [components]);

    const isSummaryChanged =
        differenceBy(flattenComponents, data.compSummary, 'amsComponentId').length > 0 ||
        flattenComponents.length !== data.compSummary.length;

    const selectedVsSummaryDiff = differenceBy(selectedRows, flattenComponents, 'amsComponentId').length > 0;

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

    useEffect(() => {
        setWarningText(!selectedVsSummaryDiff && selectedRows.length ? AUDIO_CHANNEL_EXISTS : '');
    }, [selectedRows]);

    const saveComponentsLocally = () => {
        setComponents(prev => {
            return Object.keys(prev).length
                ? groupBy(
                      uniqBy(flattenDeep([...Object.values(components), ...selectedRows]), v =>
                          [v.sourceChannelNumber, v.language, v.trackConfig].join()
                      ),
                      v => [v.language, v.trackConfig].join()
                  )
                : groupBy([...selectedRows], v => [v.language, v.trackConfig].join());
        });
        setSelectedRows([]);
        unCheckAll();
    };

    const unCheckAll = () => {
        setTableRows(prev =>
            prev.map(item => {
                return {...item, isChecked: false};
            })
        );
    };

    const checkAll = () => {
        setTableRows(prev =>
            prev.map(item => {
                return {...item, isChecked: true};
            })
        );
    };

    const removeComponent = keyToRemove => {
        const newComponents = pickBy(components, (_, key) => key !== keyToRemove);
        setComponents(newComponents);
        if (selectedRows.length > 0) {
            setSelectedRows([]);
            unCheckAll();
        }
    };

    const selectionData = {
        languageOptions,
        trackConfiguration,
        language,
        setLanguage,
        track,
        setTrack,
    };

    const componentsWithToolTipText = getToolTipText(components);

    const saveComponentsInRow = () => {
        saveComponentData(index, components);
        closeModal();
    };

    return (
        <div>
            <Header heading="Add Audio Components" title={title} barcode={barcode} />
            <hr className="solid" />
            <div className="audio-picker__outer">
                <div className="audio-picker__inner">
                    <SelectionPanel data={selectionData} />
                    <AudioChannelsTable
                        dataRows={createDynamicTableRows(tableRows, setTableRows)}
                        checkAll={checkAll}
                        unCheckAll={unCheckAll}
                    />
                    <AddToService
                        isEnabled={selectedRows.length && !warningText}
                        onClick={saveComponentsLocally}
                        count={selectedRows.length}
                        type="Audio"
                    />
                </div>
                <AudioSummaryPanel
                    list={componentsWithToolTipText}
                    setComponents={setComponents}
                    remove={removeComponent}
                />
            </div>
            <hr className="solid" />
            <Footer
                onCancel={closeModal}
                onSave={saveComponentsInRow}
                isSummaryChanged={isSummaryChanged}
                warning={warningText}
            />
        </div>
    );
};

AudioComponentsPicker.propTypes = {
    data: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    saveComponentData: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

AudioComponentsPicker.defaultProps = {};

export default AudioComponentsPicker;
