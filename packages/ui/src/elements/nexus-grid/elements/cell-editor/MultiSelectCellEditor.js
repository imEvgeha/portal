import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MultiSelect} from '@portal/portal-components';
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

    render() {
        const {options} = this.props;
        const {value} = this.state;

        return (
            <div className="nexus-c-multi-select-cell-editor">
                <MultiSelect
                    id="ddlMultiSelectCellEditor"
                    filter={true}
                    value={value.map(v => v.value)}
                    options={options}
                    appendTo="self"
                    columnClass="col-12"
                    placeholder="Select"
                    onChange={e => {
                        const value = options.filter(t => e.value.includes(t.value));
                        this.setState({
                            value,
                        });
                    }}
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
