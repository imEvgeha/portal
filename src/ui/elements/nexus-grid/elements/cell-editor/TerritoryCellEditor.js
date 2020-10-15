import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './MultiInstanceCellEditor.scss';
import RightTerritoryFormSchema from '../../../../../pages/legacy/components/form/RightTerritoryFormSchema';
import {NexusModalContext} from '../../../nexus-modal/NexusModal';
import NexusMultiInstanceField from '../../../nexus-multi-instance-field/NexusMultiInstanceField';

class TerritoryCellEditor extends Component {
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
        this.setState({value});
    };

    getOptions = () => {
        let {options} = this.props;
        options = options
            .filter(rec => rec.countryCode)
            .map(rec => {
                return {
                    label: rec.countryName,
                    value: rec.countryCode,
                };
            });
        return options;
    };

    render() {
        const {value} = this.state;

        return (
            <div className="nexus-c-multi-instance-cell-editor">
                <NexusMultiInstanceField
                    existingItems={value}
                    onSubmit={this.handleChange}
                    schema={RightTerritoryFormSchema(this.getOptions())}
                    keyForTagLabel="country"
                    isUsingModal={false}
                    isSpecialCreate={true}
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
    value: null,
};

TerritoryCellEditor.contextType = NexusModalContext;

export default TerritoryCellEditor;
