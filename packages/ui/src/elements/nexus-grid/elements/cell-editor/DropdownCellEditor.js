import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MultiSelect} from '@portal/portal-components';
import {uniqBy} from 'lodash';
import './DropdownCellEditor.scss';

class DropdownCellEditor extends Component {
    constructor(props) {
        super(props);
        const {data = {}, optionsKey, disabledOptionsKey} = props;
        const options = data[optionsKey];
        const optionsDisabled = data[disabledOptionsKey];

        this.state = {
            optionValues: options?.length ? this.prepareDataForSelect(options, optionsDisabled) : [],
            value: options?.length ? this.prepareDataForSelect(options, optionsDisabled).filter(x => x.selected) : [],
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

        const optionsList = [...preparedDisabledOptions, ...preparedOptions];

        return preparedOptions[0].country ? uniqBy(optionsList, 'country') : optionsList;
    };

    isPopup = () => true;

    getValue = () => {
        const {value} = this.state;
        return value.map(option => {
            delete option.isDisabled;
            return option;
        });
    };

    render() {
        const {value, optionValues} = this.state;
        return (
            <div className="nexus-c-dropdown-cell-editor">
                <MultiSelect
                    id="select territories"
                    filter={false}
                    value={value.map(v => v.country)}
                    optionDisabled={opt => opt.isDisabled}
                    options={optionValues}
                    appendTo="self"
                    columnClass="col-12"
                    optionLabel="country"
                    optionValue="country"
                    placeholder="Select Plan Territories"
                    onChange={e => {
                        const values = optionValues
                            .filter(t => e.value.includes(t.country))
                            .map(x => ({...x, isDirty: true, selected: true}));
                        this.setState({value: values});
                    }}
                />
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
