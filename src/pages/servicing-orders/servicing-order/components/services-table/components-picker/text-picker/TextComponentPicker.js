/* eslint react/prop-types: 0 */
import React, {useEffect, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import {HelperMessage} from '@atlaskit/form';
import Select from '@atlaskit/select/dist/cjs/Select';
import Textfield from '@atlaskit/textfield';
import {differenceBy, get, uniqBy} from 'lodash';
import {Header, Footer, AddToService} from '../ComponentsPicker';
import TextSummaryPanel from './TextSummaryPanel';
import {TEXT_COMP_EXISTS, TEXT_COMP_NOTFOUND} from '../constants';
import './TextComponentPicker.scss';

const SelectionPanel = ({data}) => {
    const {languageOptions, formatOptions, language, setLanguage, format, setFormat} = data;

    return (
        <div>
            <b>Step 1: Select Configuration</b>
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

const TextComponentsPicker = ({data, closeModal, saveComponentData, index}) => {
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
        setLanguage(languageOptions[0]);
        setFormat(formatOptions[0]);
        setComponents(data.compSummary);
    }, [data]);

    useEffect(() => {
        const componentID = get(
            componentArray.find(item => item.language === language.value && item.format === format.value),
            'amsComponentId',
            ''
        );
        setComponentId(componentID);
        const doesComponentExistInSummary = components.findIndex(item => item.amsComponentId === componentID) !== -1;
        setWarningText(doesComponentExistInSummary ? TEXT_COMP_EXISTS : '');
    }, [language, format, components]);

    useEffect(() => {
        !componentId && setWarningText(TEXT_COMP_NOTFOUND);
    }, [componentId]);

    const isSummaryChanged =
        differenceBy(components, data.compSummary, 'amsComponentId').length > 0 ||
        components.length !== data.compSummary.length;

    const saveComponentsLocally = () => {
        setComponents([...components, {language: language.value, format: format.value, amsComponentId: componentId}]);
    };

    const removeComponent = compId => {
        setComponents(prev => prev.filter(item => item.amsComponentId !== compId));
    };

    const selectionData = {
        languageOptions,
        formatOptions,
        language,
        setLanguage,
        format,
        setFormat,
    };

    const saveComponentsInRow = () => {
        saveComponentData(index, components);
        closeModal();
    };

    return (
        <div>
            <Header heading="Add Text Components" title={title} barcode={barcode} />
            <hr className="solid" />
            <div className="text-picker__outer">
                <div className="text-picker__inner">
                    <SelectionPanel data={selectionData} />
                    <div className="text-picker__component">
                        <HelperMessage>Component ID</HelperMessage>
                        <Textfield
                            name="componentID"
                            isReadOnly={true}
                            defaultValue={componentId}
                            style={{height: '40px'}}
                        />
                    </div>
                    <AddToService isEnabled={!warningText} onClick={saveComponentsLocally} type="text" />
                </div>
                <TextSummaryPanel list={components} setComponents={setComponents} remove={removeComponent} />
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
    saveComponentData: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

TextComponentsPicker.defaultProps = {};

export default TextComponentsPicker;
