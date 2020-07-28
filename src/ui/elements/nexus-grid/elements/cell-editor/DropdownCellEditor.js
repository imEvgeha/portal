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
        const {data = {}, optionsKey, disabledOptionsKey: optionsDisabledKey} = props;
        const options = data[optionsKey];
        const optionsDisabled = data[optionsDisabledKey];

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
        const preparedDisabledOptions = Array.isArray(optionsDisabled) && optionsDisabled.map(option => ({
            isSelected: option.selected,
            id: option.country,
            country: option.country,
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
        return value && value.map(el => el.country).join(', ');
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
            <div className="nexus-c-multi-select-cell-editor">
                <Dropdown defaultOpen triggerType="button" trigger="Drop menu">
                    <DropdownItemGroupCheckbox id="languages2" title="Languages">
                        {value.map((option, index) => (
                            <DropdownItemCheckbox
                                defaultSelected={option.isSelected}
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

