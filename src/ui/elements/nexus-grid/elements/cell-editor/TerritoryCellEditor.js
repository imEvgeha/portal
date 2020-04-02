import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';
import './TerritoryCellEditor.scss';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import Form from '@atlaskit/form';
import {connect} from 'react-redux';
import NexusMultiInstanceField from '../../../nexus-multi-instance-field/NexusMultiInstanceField';
import {NexusModalContext} from '../../../nexus-modal/NexusModal';
import {getProperTerritoryFormValues} from '../../../../../pages/legacy/components/form/utils';
import TerritoryField from '../../../../../pages/legacy/containers/avail/components/TerritoryField';
import RightTerritoryFields from '../../../../../pages/legacy/components/form/RightTerritoryFields';
import RightTerritoryFormSchema from '../../../../../pages/legacy/components/form/RightTerritoryFormSchema';

class TerritoryCellEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            territoryIndex: null
        };
    }

    isPopup = () => true;

    getValue = () => this.state.value;

    handleChange = (value) => {
        this.setState({value});
    };

    getOptions = () => {
        let {options} = this.props;
        options = options.filter((rec) => (rec.countryCode)).map(rec => {
            return {
                    label: rec.countryName,
                    value: rec.countryCode
            };
        });
        return options;
};

    render() {
        const {value, territoryIndex} = this.state;

        return (
            <div className="nexus-c-territory-cell-editor">
                <NexusMultiInstanceField
                    existingItems={value}
                    onSubmit={this.handleChange}
                    schema={RightTerritoryFormSchema(this.getOptions())}
                    keyForTagLabel="country"
                    isUsingModal={false}
                    specialCreate={true}
                />
            </div>
        );
    }
}

TerritoryCellEditor.propTypes = {
    options: PropTypes.array,
    value: PropTypes.array,
};

TerritoryCellEditor.defaultProps = {
    options: [],
    value: null
};

TerritoryCellEditor.contextType = NexusModalContext;

export default TerritoryCellEditor;

