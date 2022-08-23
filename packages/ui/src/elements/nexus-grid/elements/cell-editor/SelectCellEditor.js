import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from '@portal/portal-components';
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

    render() {
        const {options} = this.props;
        const {value} = this.state;

        return (
            <div className="nexus-c-select-cell-editor">
                <Dropdown
                    options={options}
                    placeholder="Select"
                    columnClass="col-12"
                    appendTo="self"
                    onChange={event => {
                        const {options} = this.props;
                        const value = options.find(x => x.value === event.value);
                        this.setState({
                            value,
                        });
                    }}
                    value={value.value}
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
