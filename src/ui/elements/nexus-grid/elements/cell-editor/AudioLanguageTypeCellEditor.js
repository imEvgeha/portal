import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './TerritoryCellEditor.scss';
import NexusMultiInstanceField from '../../../nexus-multi-instance-field/NexusMultiInstanceField';
import {NexusModalContext} from '../../../nexus-modal/NexusModal';
import AudioLanguageTypeFormSchema from '../../../../../pages/legacy/components/form/AudioLanguageTypeFormSchema';

class AudioLanguageTypeCellEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    isPopup = () => true;

    getValue = () => this.state.value;

    handleChange = (value) => {
        const addedLanguages = value
            .map((language) => language.languageAudioTypes || language)
            .filter(Boolean);

        this.setState({value: addedLanguages});
    };

    getOptions = () => {
        const {options = {}} = this.props;
        const {languages, audioTypes} = options || {};

        return {languages, audioTypes};
    };

    render() {
        const {value} = this.state;

        return (
            <div className="nexus-c-territory-cell-editor">
                <NexusMultiInstanceField
                    existingItems={value}
                    onSubmit={this.handleChange}
                    schema={AudioLanguageTypeFormSchema(this.getOptions())}
                    keyForTagLabel="language"
                    isUsingModal={false}
                    specialCreate={true}
                />
            </div>
        );
    }
}

AudioLanguageTypeCellEditor.propTypes = {
    options: PropTypes.shape({
        languages: PropTypes.array,
        audioTypes: PropTypes.array,
    }),
    value: PropTypes.array,
};

AudioLanguageTypeCellEditor.defaultProps = {
    options: {
        languages: [],
        audioTypes: [],
    },
    value: null
};

AudioLanguageTypeCellEditor.contextType = NexusModalContext;

export default AudioLanguageTypeCellEditor;

