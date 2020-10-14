import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './MultiInstanceCellEditor.scss';
import AudioLanguageTypeFormSchema from '../../../../../pages/legacy/components/form/AudioLanguageTypeFormSchema';
import {NexusModalContext} from '../../../nexus-modal/NexusModal';
import NexusMultiInstanceField from '../../../nexus-multi-instance-field/NexusMultiInstanceField';

class AudioLanguageTypeCellEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    isPopup = () => true;

    // eslint-disable-next-line react/destructuring-assignment
    getValue = () => this.state.value;

    handleChange = value => {
        const addedLanguages = value.map(language => language.languageAudioTypes || language).filter(Boolean);

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
            <div className="nexus-c-multi-instance-cell-editor">
                <NexusMultiInstanceField
                    existingItems={value}
                    onSubmit={this.handleChange}
                    schema={AudioLanguageTypeFormSchema(this.getOptions())}
                    keyForTagLabel="language"
                    isUsingModal={false}
                    isSpecialCreate={true}
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
    value: null,
};

AudioLanguageTypeCellEditor.contextType = NexusModalContext;

export default AudioLanguageTypeCellEditor;
