/* eslint react/prop-types: 0 */
import React, {useEffect, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import DynamicTable from '@atlaskit/dynamic-table';
import {HelperMessage} from '@atlaskit/form';
import CheckIcon from '@atlaskit/icon/glyph/check';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select/dist/cjs/Select';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import {differenceBy, flattenDeep, get, groupBy, pickBy, uniqBy} from 'lodash';
import {Header, Footer, SummaryPanel, AddToService} from '../ComponentsPicker';
import {createDynamicTableRows, getAudioChannelsForLangTrack, getToolTipText} from '../pickerUtils';
import {CHANNEL_EXISTS, header} from '../constants';

const AudioChannelsTable = ({dataRows, checkAll, unCheckAll}) => {
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
        <div className="picker__audio-panel">
            <b>Step 2: Select Audio Channels</b>
            <div className="picker__audio-panel-table">
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
            <div className="picker__selection-panel">
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

    const audioChannels = useMemo(() => getAudioChannelsForLangTrack(language, track, audioComponentArray), [
        language,
        track,
    ]);

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
        differenceBy(flattenComponents, data.compSummary, 'componentID').length > 0 ||
        flattenComponents.length !== data.compSummary.length;

    const selectedVsSummaryDiff = differenceBy(selectedRows, flattenComponents, 'componentID').length > 0;

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
        setWarningText(!selectedVsSummaryDiff && selectedRows.length ? CHANNEL_EXISTS : '');
    }, [selectedRows]);

    const saveComponentsLocally = () => {
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
            <div className="picker__outer">
                <div className="picker__inner">
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
                    />
                </div>
                <SummaryPanel list={componentsWithToolTipText} setComponents={setComponents} remove={removeComponent} />
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
