/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {HelperMessage} from '@atlaskit/form';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import SectionMessage from '@atlaskit/section-message';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import './ComponentsPicker.scss';
import AudioComponentsPicker from './audio-picker/AudioComponentsPicker';
import TextComponentPicker from './text-picker/TextComponentPicker';
import {NO_AUDIO_EXISTS, NO_SELECTION_AVAILABLE} from './constants';

const notAvailableMsg = (desc, barcode) => (
    <SectionMessage title="Not Available">
        <p>{`Barcode ${barcode} :${desc}`}</p>
    </SectionMessage>
);

export const Header = ({heading, title, barcode}) => {
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

export const Footer = ({warning, onCancel, onSave, isSummaryChanged}) => {
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

export const ListItem = ({item, onDelete}) => {
    return (
        <div className="picker__list-item">
            <Tag text={item} />
            <div onClick={onDelete}>
                <EditorRemoveIcon size="medium" primaryColor="grey" />
            </div>
        </div>
    );
};

export const SummaryPanel = ({list = [], remove}) => {
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

export const AddToService = ({isEnabled, onClick, count}) => {
    return (
        <div className="picker__service-panel">
            <b>Step 3: {`Add to service ${count ? `(${count})` : ''}`}</b>
            <Button appearance="primary" isDisabled={!isEnabled} onClick={onClick}>
                {`Add to service ${count ? `(${count})` : ''}`}
            </Button>
        </div>
    );
};

export const ComponentsPicker = ({data, closeModal, saveComponentData, index}) => {
    console.log('data at component picker: ', data);
    const {componentArray, assetType, barcode} = data;

    const resolvePickerType = () => {
        if (componentArray.length > 0) {
            if (assetType === 'Audio')
                return (
                    <AudioComponentsPicker
                        data={data}
                        closeModal={closeModal}
                        saveComponentData={saveComponentData}
                        index={index}
                    />
                );
            if (['Closed Captioning', 'Subtitles'].includes(assetType))
                return (
                    <TextComponentPicker index={index} closeModal={closeModal} save={saveComponentData} data={data} />
                );
        }
        return notAvailableMsg(NO_AUDIO_EXISTS, barcode);
    };
    return <div>{resolvePickerType()}</div>;
};

ComponentsPicker.propTypes = {
    data: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    saveComponentData: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

ComponentsPicker.defaultProps = {};

export default ComponentsPicker;
