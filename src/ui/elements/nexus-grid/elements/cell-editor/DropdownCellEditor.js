import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dropdown, {DropdownItemCheckbox, DropdownItemGroupCheckbox} from '@atlaskit/dropdown-menu';
import './DropdownCellEditor.scss';

class DropdownCellEditor extends Component {
    constructor(props) {
        super(props);
        const {data = {}, optionsKey, disabledOptionsKey, newOptionsKey} = props;
        const options = data[optionsKey];
        const newOption = data[newOptionsKey] || [];
        const optionsDisabled = data[disabledOptionsKey];
        this.state = {
            value: this.prepareDataForSelect(options, newOption, optionsDisabled),
        };
    }

    prepareDataForSelect = (options, newOption, optionsDisabled) => {
        let preparedOptions = [];
        if (newOption && newOption.length) {
            preparedOptions =
                Array.isArray(newOption) &&
                newOption.map(option => {
                    return {
                        ...option,
                        isDisabled: false,
                    };
                });
        } else {
            preparedOptions =
                Array.isArray(options) &&
                options
                    .filter(option => !option.selected)
                    .map(option => {
                        return {
                            ...option,
                            isNewlySelected: false,
                            isDisabled: false,
                        };
                    });
        }
        const preparedDisabledOptions =
            Array.isArray(optionsDisabled) &&
            optionsDisabled.map(option => ({
                selected: false,
                isDisabled: true,
                id: option,
                country: option,
            }));

        return [...preparedOptions, ...preparedDisabledOptions];
    };

    isPopup = () => {
        const {data = {}, optionsKey} = this.props;
        const options = data[optionsKey];
        return !!options.length;
    };

    getValue = () => {
        const {value} = this.state;
        const cleanValues = value
            .filter(option => !option.isDisabled)
            .map(option => {
                delete option.isDisabled;
                return option;
            });
        return cleanValues;
    };

    handleChange = index => {
        const {value} = this.state;
        const prevIsSelected = value[index].isNewlySelected;
        value[index].isNewlySelected = !prevIsSelected;

        this.setState({
            value,
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
                                isSelected={option.isNewlySelected}
                                key={option.country}
                                id={option.country}
                                isDisabled={option.isDisabled}
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
    newOptionsKey: PropTypes.string,
    disabledOptionsKey: PropTypes.string,
    data: PropTypes.object.isRequired,
};

DropdownCellEditor.defaultProps = {
    optionsKey: '',
    newOptionsKey: '',
    disabledOptionsKey: '',
};

export default DropdownCellEditor;
