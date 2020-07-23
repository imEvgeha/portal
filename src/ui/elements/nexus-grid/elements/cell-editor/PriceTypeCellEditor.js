import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PriceTypeFormSchema from '../../../../../pages/legacy/components/form/PriceTypeFormSchema';
import {NexusModalContext} from '../../../nexus-modal/NexusModal';
import NexusMultiInstanceField from '../../../nexus-multi-instance-field/NexusMultiInstanceField';
import './MultiInstanceCellEditor.scss';

class PriceTypeCellEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    isPopup = () => true;

    getValue = () => this.state.value;

    handleChange = (value) => {
        const addedPriceTypes = value
            .map((price) => price.pricing || price)
            .filter(Boolean);
        this.setState({value: addedPriceTypes});
    };

    getOptions = () => {
        const {options = {}} = this.props;
        const {priceTypes, currencies} = options || {};

        return {priceTypes, currencies};
    };

    render() {
        const {value} = this.state;

        return (
            <div className="nexus-c-multi-instance-cell-editor">
                <NexusMultiInstanceField
                    existingItems={value}
                    onSubmit={this.handleChange}
                    schema={PriceTypeFormSchema(this.getOptions())}
                    keyForTagLabel="priceType"
                    isUsingModal={false}
                    specialCreate={true}
                />
            </div>
        );
    }
}

PriceTypeCellEditor.propTypes = {
    options: PropTypes.shape({
        priceTypes: PropTypes.array,
        currencies: PropTypes.array,
    }),
    value: PropTypes.array,
};

PriceTypeCellEditor.defaultProps = {
    options: {
        priceTypes: [],
        currencies: [],
    },
    value: null
};

PriceTypeCellEditor.contextType = NexusModalContext;

export default PriceTypeCellEditor;

