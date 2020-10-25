/* eslint react/prop-types: 0 */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import {HelperMessage} from '@atlaskit/form';
import CheckIcon from '@atlaskit/icon/glyph/check';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select/dist/cjs/Select';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import {differenceBy, flattenDeep, get, groupBy, pickBy, uniqBy} from 'lodash';
import './ComponentsPicker.scss';
import {Check, createDynamicTableRows, getAudioChannelsForLangTrack, getToolTipText} from './pickerUtils';
import {header, CHANNEL_EXISTS, NO_AUDIO_EXISTS, NO_SELECTION_AVAILABLE} from './constants';

const Header = ({heading, title, barcode}) => {
    return (
        <div className="picker__header">
            <h3>{heading}</h3>
            <div className="picker__header-title">
                <b>{title}</b>
                <p>{barcode}</p>
            </div>
        </div>
    );
};

const Footer = ({warning, onCancel, onSave, isSummaryChanged}) => {
    return (
        <div className="picker__footer">
            <HelperMessage>
                <span className="picker__footer-warning">{warning}</span>
            </HelperMessage>
            <div className="picker__footer-buttons">
                <Button onClick={onCancel}>Cancel</Button>
                <Button appearance="primary" onClick={onSave} isDisabled={!isSummaryChanged}>
                    save
                </Button>
            </div>
        </div>
    );
};

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
        content: <Check name="header-check" isChecked={checkedAll} toggle={setToggle} />,
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

const SummaryPanel = ({list = [], remove}) => {
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

const SelectionPanel = ({data}) => {
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

const AddToService = ({isEnabled, onClick, count}) => {
    return (
        <div className="picker__service-panel">
            <b>Step 3: Add to Service ({count})</b>
            <Button appearance="primary" isDisabled={!isEnabled} onClick={onClick}>
                Add to service ({count})
            </Button>
        </div>
    );
};

const AudioComponentsPicker = ({data, closeModal, save, index}) => {
    const [language, setLanguage] = useState('');
    const [track, setTrack] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [components, setComponents] = useState(groupBy(data.audioSummary, v => [v.language, v.trackConfig] || {}));
    const [warningText, setWarningText] = useState('');
    const {title, barcode, audioComponentArray = []} = data;

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

    const flattenComponents = flattenDeep(Object.values(components));

    const isSummaryChanged =
        differenceBy(flattenComponents, data.audioSummary, 'componentID').length > 0 ||
        flattenComponents.length !== data.audioSummary.length;

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
        save(index, components);
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

const notAvailableMsg = (desc, barcode) => (
    <SectionMessage title="Not Available">
        <p>{`Barcode ${barcode} :${desc}`}</p>
    </SectionMessage>
);

export const ComponentsPicker = ({data, closeModal, save, index}) => {
    const {audioComponentArray, assetType, barcode} = data;
    return (
        <div>
            {assetType === 'Audio' ? (
                audioComponentArray.length ? (
                    <AudioComponentsPicker data={data} closeModal={closeModal} save={save} index={index} />
                ) : (
                    notAvailableMsg(NO_AUDIO_EXISTS, barcode)
                )
            ) : (
                notAvailableMsg(NO_SELECTION_AVAILABLE, barcode)
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
