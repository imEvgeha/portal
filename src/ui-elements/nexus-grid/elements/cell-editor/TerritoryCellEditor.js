import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import './TerritoryCellEditor.scss';
import TerritoryField from '../../../../containers/avail/components/TerritoryField';
import RightTerritoryFields from '../../../../components/form/RightTerritoryFields';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import Form from '@atlaskit/form';
import {getProperTerritoryFormValues} from '../../../../components/form/utils';
import {connect} from 'react-redux';
import RightTerritoryFormSchema from '../../../../components/form/RightTerritoryFormSchema';
import NexusMultiInstanceField from '../../../nexus-multi-instance-field/NexusMultiInstanceField';
import {NexusModalContext} from '../../../../ui-elements/nexus-modal/NexusModal';

class TerritoryCellEditor extends Component {

    static contextType = NexusModalContext;

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

export default TerritoryCellEditor;

