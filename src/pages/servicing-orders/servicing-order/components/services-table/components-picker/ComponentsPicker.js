/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import {HelperMessage} from '@atlaskit/form';
import SectionMessage from '@atlaskit/section-message';
import {Button} from '@portal/portal-components';
import './ComponentsPicker.scss';
import AudioComponentsPicker from './audio-picker/AudioComponentsPicker';
import TextComponentPicker from './text-picker/TextComponentPicker';
import {NO_COMP_EXISTS} from './constants';

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
                <Button label="Cancel" className="p-button-outlined p-button-secondary" onClick={onCancel} />
                <Button label="Save" className="p-button-outlined" onClick={onSave} disabled={!isSummaryChanged} />
            </div>
        </div>
    );
};

export const AddToService = ({isEnabled, onClick, count, type}) => {
    const step = type === 'Audio' ? '3' : '2';
    return (
        <div className="picker__service-panel">
            <b>{` Step ${step}: Add to service ${count ? `(${count})` : ''}`}</b>
            <Button
                label={`Add to service ${count ? `(${count})` : ''}`}
                className="p-button-outlined"
                disabled={!isEnabled}
                onClick={onClick}
            />
        </div>
    );
};

export const ComponentsPicker = ({data, closeModal, saveComponentData, index}) => {
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
                    <TextComponentPicker
                        index={index}
                        closeModal={closeModal}
                        saveComponentData={saveComponentData}
                        data={data}
                    />
                );
        }
        return notAvailableMsg(NO_COMP_EXISTS, barcode);
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
