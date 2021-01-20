import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dropdown, {DropdownItemCheckbox, DropdownItemGroupCheckbox} from '@atlaskit/dropdown-menu';
import {cloneDeep, uniqBy} from 'lodash';
import './DropdownCellEditor.scss';

class DropdownCellEditor extends Component {
    constructor(props) {
        super(props);
        const {data = {}, optionsKey, disabledOptionsKey} = props;
        const options = data[optionsKey];
        const optionsDisabled = data[disabledOptionsKey];

        this.state = {
            value: options && options.length ? this.prepareDataForSelect(options, optionsDisabled) : [],
        };
    }

    prepareDataForSelect = (options, optionsDisabled) => {
        const preparedOptions =
            Array.isArray(options) &&
            options.map(option => {
                if ((!option.hasOwnProperty('isDirty') && option.selected) || option.isDisabled) {
                    return {
                        ...option,
                        isDisabled: true,
                    };
                }
                return {
                    ...option,
                    isDisabled: false,
                };
            });
        const preparedDisabledOptions =
            Array.isArray(optionsDisabled) &&
            optionsDisabled.map(option => ({
                selected: false,
                isDisabled: true,
                id: option,
                country: option,
            }));

        const optionsList = [...preparedOptions, ...preparedDisabledOptions];

        return preparedOptions[0].country ? uniqBy(optionsList, 'country') : optionsList;
    };

    isPopup = () => {
        const {data = {}, optionsKey} = this.props;
        const options = data[optionsKey];
        return !!options.length;
    };

    getValue = () => {
        const {value} = this.state;
        const cleanValues = value.map(option => {
            delete option.isDisabled;
            return option;
        });
        return cleanValues;
    };

    handleChange = index => {
        const {value} = this.state;
        const updatedValue = cloneDeep(value);
        const prevIsSelected = updatedValue[index].selected;
        updatedValue[index].selected = !prevIsSelected;
        updatedValue[index].isDirty = true;
        this.setState({
            value: updatedValue,
        });
    };

    render() {
        const {value} = this.state;

        return (
            <div className="nexus-c-dropdown-cell-editor">
                <Dropdown defaultOpen triggerType="button">
                    <DropdownItemGroupCheckbox id="select territories" title="Select Plan Territories">
                        {value.map((option, index) => (
                            <DropdownItemCheckbox
                                isSelected={option.selected}
                                key={option.country}
                                id={option.country}
                                isDisabled={option.isDisabled || option.withdrawn}
                                onClick={() => this.handleChange(index)}
                            >
                                {option.country}
                            </DropdownItemCheckbox>
                        ))}
                    </DropdownItemGroupCheckbox>
                </Dropdown>
            </div>
        );
    }
}

DropdownCellEditor.propTypes = {
    optionsKey: PropTypes.string,
    disabledOptionsKey: PropTypes.string,
    data: PropTypes.object.isRequired,
};

DropdownCellEditor.defaultProps = {
    optionsKey: '',
    disabledOptionsKey: '',
};

export default DropdownCellEditor;
