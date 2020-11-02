/* eslint react/prop-types: 0 */
import React, {useEffect, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import {HelperMessage} from '@atlaskit/form';
import Select from '@atlaskit/select/dist/cjs/Select';
import Textfield from '@atlaskit/textfield';
import {differenceBy, flattenDeep, get, groupBy, pickBy, uniqBy} from 'lodash';
import {Header, Footer, SummaryPanel, AddToService} from '../ComponentsPicker';
import {getToolTipText} from '../pickerUtils';
import {CHANNEL_EXISTS, header} from '../constants';
import './TextComponentPicker.scss';

const SelectionPanel = ({data}) => {
    const {languageOptions, formatOptions, language, setLanguage, format, setFormat} = data;

    return (
        <div>
            <b>Step 1: Filter Language and Track configuration</b>
            <div className="text-picker__selection-panel">
                <div>
                    <HelperMessage>Language / MFX</HelperMessage>
                    <Select
                        id="language-select"
                        name="language-select"
                        className="text-picker__select"
                        options={languageOptions}
                        value={language}
                        onChange={val => setLanguage(val)}
                    />
                </div>
                <div>
                    <HelperMessage>Format</HelperMessage>
                    <Select
                        id="track-select"
                        name="track-select"
                        className="text-picker__select"
                        options={formatOptions}
                        value={format}
                        onChange={val => setFormat(val)}
                    />
                </div>
            </div>
        </div>
    );
};

const TextComponentsPicker = ({data, closeModal, save, index}) => {
    const [language, setLanguage] = useState('');
    const [format, setFormat] = useState('');
    const [componentId, setComponentId] = useState('');
    const [components, setComponents] = useState([]);
    const [warningText, setWarningText] = useState('');
    const {title, barcode, componentArray = []} = data;

    const languageOptions = useMemo(
        () =>
            uniqBy(
                componentArray.map(item => {
                    const lang = get(item, 'language', '');
                    return {value: lang, label: lang};
                }),
                'value'
            ),
        []
    );

    const formatOptions = useMemo(
        () =>
            uniqBy(
                componentArray.map(item => {
                    const track = get(item, 'format', '');
                    return {value: track, label: track};
                }),
                'value'
            ),
        []
    );

    useEffect(() => {
        const componentID = get(
            componentArray.find(item => item.language === language.value && item.format === format.value),
            'componentID',
            ''
        );
        setComponentId(componentID);
    }, [language, format]);

    const isSummaryChanged =
        differenceBy(components, data.compSummary, 'componentID').length > 0 ||
        components.length !== data.compSummary.length;

    const doesComponentExistInSummary = components.findIndex(item => item.componentID === componentId) !== -1;

    useEffect(() => {
        setLanguage(languageOptions[0]);
        setFormat(formatOptions[0]);
    }, [data]);

    useEffect(() => {
        setWarningText(doesComponentExistInSummary ? CHANNEL_EXISTS : '');
    }, [format, language]);

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
        formatOptions,
        language,
        setLanguage,
        format,
        setFormat,
    };

    const componentsWithToolTipText = getToolTipText(components);

    const saveComponentsInRow = () => {
        save(index, components);
        closeModal();
    };

    return (
        <div>
            <Header heading="Add Text Components" title={title} barcode={barcode} />
            <hr className="solid" />
            <div className="picker__outer">
                <div className="text-picker__inner">
                    <SelectionPanel data={selectionData} />
                    <Textfield
                        name="componentID"
                        isReadOnly={true}
                        defaultValue={componentId}
                        style={{height: '40px'}}
                    />
                    <AddToService isEnabled={!warningText} onClick={saveComponentsLocally} />
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

TextComponentsPicker.propTypes = {
    data: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

TextComponentsPicker.defaultProps = {};

export default TextComponentsPicker;
