import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import './MultiSelectCellEditor.scss';

class MultiSelectCellEditor extends Component {
    constructor(props) {
        super(props);
        const {value} = props;
        this.state = {
            value: this.prepareDataForSelect(value),
        };
    }

    prepareDataForSelect = data => {
        if (data && data.length) {
            const arr = data.filter(Boolean);
            return arr.map(el => {
                return {
                    value: el,
                    label: el,
                    key: el,
                };
            });
        }
        return [];
    };

    isPopup = () => {
        const {options} = this.props;
        return !!options.length;
    };

    getValue = () => {
        const {value} = this.state;
        return value && value.map(el => el.value);
    };

    handleChange = value => {
        this.setState({
            value,
        });
    };

    render() {
        const {options} = this.props;
        const {value} = this.state;

        return (
            <div className="nexus-c-multi-select-cell-editor">
                <Select
                    options={options}
                    isMulti={true}
                    isSearchable={true}
                    placeholder="Select"
                    onChange={this.handleChange}
                    value={value}
                    defaultValue={value}
                />
            </div>
        );
    }
}

MultiSelectCellEditor.propTypes = {
    options: PropTypes.array,
    value: PropTypes.array,
};

MultiSelectCellEditor.defaultProps = {
    options: [],
    value: null,
};

export default MultiSelectCellEditor;
