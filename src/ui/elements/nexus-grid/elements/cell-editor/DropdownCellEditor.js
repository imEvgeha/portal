import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dropdown, {
    DropdownItemCheckbox,
    DropdownItemGroupCheckbox,
} from '@atlaskit/dropdown-menu';
import './MultiSelectCellEditor.scss';

class DropdownCellEditor extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        const {data = {}, optionsKey, disabledOptionsKey} = props;
        const options = data[optionsKey];
        const optionsDisabled = data[disabledOptionsKey];

        this.state = {
            value: this.prepareDataForSelect(options, optionsDisabled),
        };
    }

    prepareDataForSelect = (options, optionsDisabled) => {
        const preparedOptions = Array.isArray(options) && options.map(option => ({
            isSelected: option.selected,
            id: option.country,
            country: option.country,
            isDisabled: false,
        }));


        // territories excluded is an array of strings not objects?
        const preparedDisabledOptions = Array.isArray(optionsDisabled) && optionsDisabled.map(option => ({
            isSelected: false,
            id: option,
            country: option,
            isDisabled: true,
        }));
        return [...preparedOptions, ...preparedDisabledOptions];
    }

    isPopup = () => {
        const {data = {}, optionsKey} = this.props;
        const options = data[optionsKey];
        return !!options.length;
    }

    getValue = () => {
        const {value} = this.state;
        const selectedValues = value && value.map(el => (el.isSelected ? el.country : null)).join(', ');
        return selectedValues;
    }

    handleChange = index => {
        const {value} = this.state;
        const prevIsSelected = value[index].isSelected;
        value[index].isSelected = !prevIsSelected;

        this.setState({
            value,
        });
    };

    render() {
        const {value} = this.state;

        return (
            <div className="nexus-c-dropdown-cell-editor">
                <Dropdown defaultOpen triggerType="button" trigger="Select Values">
                    <DropdownItemGroupCheckbox id="languages2" title="Select Plan Territories">
                        {value.map((option, index) => (
                            <DropdownItemCheckbox
                                defaultSelected={option.isSelected}
                                isSelected={option.isSelected}
                                key={option.id}
                                id={option.id}
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
    disabledOptionsKey: PropTypes.string,
    data: PropTypes.object.isRequired,
};

DropdownCellEditor.defaultProps = {
    optionsKey: '',
    disabledOptionsKey: '',
};

export default DropdownCellEditor;

