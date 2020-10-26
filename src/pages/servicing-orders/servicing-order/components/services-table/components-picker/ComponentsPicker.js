import React from 'react';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import './ComponentsPicker.scss';
import AudioComponentsPicker from './AudioComponentsPicker';
import {NO_AUDIO_EXISTS, NO_SELECTION_AVAILABLE} from './constants';

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
