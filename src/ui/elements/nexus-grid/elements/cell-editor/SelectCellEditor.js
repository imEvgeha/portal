import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import './SelectCellEditor.scss';

class SelectCellEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                label: props.value,
                value: props.value,
            },
        };
    }

    isPopup = () => {
        const {options} = this.props;
        return !!options.length;
    };

    // eslint-disable-next-line react/destructuring-assignment
    getValue = () => this.state.value.value;

    handleChange = value => {
        this.setState({
            value,
        });
    };

    render() {
        const {options} = this.props;
        const {value} = this.state;

        return (
            <div className="nexus-c-select-cell-editor">
                <Select
                    options={options}
                    placeholder="Select"
                    onChange={this.handleChange}
                    value={value}
                    defaultValue={value}
                />
            </div>
        );
    }
}

SelectCellEditor.propTypes = {
    options: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

SelectCellEditor.defaultProps = {
    options: [],
    value: null,
};

export default SelectCellEditor;
