import React from 'react';
import PropTypes from 'prop-types';
import {NexusTag} from '../../../../../ui/elements/';
import {uid} from 'react-uid';
import {CustomFieldAddText} from '../custom-form-components/CustomFormComponents';
import './AudioLanguageField.scss';

const AudioLanguageField = ({name, audioLanguages, onRemoveClick, onAddClick, onTagClick, renderChildren, mappingErrorMessage, isTableMode = false}) => {

    const getLanguages = () => {
        return audioLanguages.map((lang, i) => (
            <NexusTag
                key={uid(lang)}
                text={lang.language}
                value={lang}
                removeButtonText='Remove'
                onRemove={() => onRemoveClick(lang)}
                onClick={() => onTagClick(i)}
            />
        ));
    };

    const getAddButton = () => {
        return (
            <CustomFieldAddText
                onClick={onAddClick}
                id={'right-create-' + name + '-button'}
            >
                Add...
            </CustomFieldAddText>
        );
    };

    return (
        <div className='nexus-c-audio-language-field'>
            {isTableMode && getAddButton()}
            {audioLanguages && audioLanguages.length > 0 ? getLanguages() : !isTableMode && getAddButton()}
            {renderChildren()}
            <br />
            {mappingErrorMessage[name] && mappingErrorMessage[name].text && (
                <small className="text-danger m-2">
                    {get(mappingErrorMessage, [name, 'text'], '')}
                </small>
            )}
        </div>
    );
};

AudioLanguageField.propTypes = {
    audioLanguages: PropTypes.array,
    name: PropTypes.string.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onTagClick: PropTypes.func,
    mappingErrorMessage: PropTypes.object,
    renderChildren: PropTypes.func,
    isTableMode: PropTypes.bool
};

AudioLanguageField.defaultProps = {
    audioLanguages: [],
    renderChildren: () => null,
    onTagClick: () => null,
    mappingErrorMessage: {},
    isTableMode: false
};

export default AudioLanguageField;
