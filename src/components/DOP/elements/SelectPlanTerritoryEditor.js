import React, {Component} from 'react';
import t from 'prop-types';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import Option from './MultiSelectOption'; // need Option as a name inside react select components prop

class SelectPlanTerritoryEditor extends Component {
    static propTypes = {
        node: t.object,
        getPromotedRights: t.func.isRequired,
        updatePromotedRights: t.func,
    };

    static defaultProps = {
        node: {},
        updatePromotedRights: [],
    };

    constructor(props) {
        super(props);
        const right = props.getPromotedRights()
            .find(el => el.rightId === (props.node && props.node.id));
        const value = (right && right.territories && right.territories.map(el => {
            return {
                value: el, 
                label: el,
            };
        })) || [];
        const isAllSelected = this.isAllSelectableItemsSelected(value);
        this.state = {
            value: isAllSelected ? [...value, this.allOption] : value,
        };
    }

    allOption = {
        value: 'all',
        label: 'SELECT ALL',
    };

    handleChange = (value = [], event) => {
        const {updatePromotedRights, getPromotedRights, node} = this.props;
        const filteredPromotedRights = getPromotedRights().filter(el => el.rightId !== node.id);
        const filteredValue = value && value.filter(el => el.value !== this.allOption.value);
        // handle all select button click
        if (event.option.value === this.allOption.value) {
            return this.handleAllSelectButtonClick(event.action, updatePromotedRights, filteredPromotedRights);
        }

        // deselect action
        if (event.action === 'deselect-option') {
            return this.handleDeselectClick(filteredValue, updatePromotedRights, filteredPromotedRights);
        }

        // select action
        this.handleSelectClick(filteredValue, updatePromotedRights, filteredPromotedRights);
    };

    isPopup() {
        const {node} = this.props;
        const territories = (node && node.data && node.data.territory) || [];
        return territories.length > 0;
    }

    handleAllSelectButtonClick = (action, updatePromotedRights, filteredPromotedRights) => {
        const {node} = this.props;
        const selectableOptions = [this.allOption, ...this.getOptions(node && node.data && node.data.territory).filter(option => !option.selected)];
        const values = selectableOptions.map(option => option.value);
        this.setState({
            value: action === 'select-option' ? selectableOptions : [],
        }, () => {
            if (action === 'select-option') {
                return updatePromotedRights([
                    ...filteredPromotedRights, 
                    {rightId: node.id, territories: values.filter(el => el !== this.allOption.value)}
                ]);
            }
            updatePromotedRights(filteredPromotedRights);
        });
    }

    handleSelectClick = (value, updatePromotedRights, filteredPromotedRights) => {
        const {node} = this.props;
        this.setState(() => {
            const isAllSelected = this.isAllSelectableItemsSelected(value);
            return {
                value: isAllSelected ? [...value, this.allOption] : value,
            };
        }, () => {
            if (value.length > 0) {
                return updatePromotedRights([
                    ...filteredPromotedRights,
                    {rightId: node.id, territories: value.map(el => el.value)}
                ]);
            }
            updatePromotedRights(filteredPromotedRights);
        });
    }

    handleDeselectClick = (value, updatePromotedRights, filteredPromotedRights) => {
        const {node} = this.props;
        this.setState(() => (
            {
            value,
        }), () => {
            if (value.length > 0) {
                return updatePromotedRights([
                    ...filteredPromotedRights,
                    {rightId: node.id, territories: value.map(el => el.value)}
                ]);
            }
            updatePromotedRights(filteredPromotedRights);
        });
    }

    isAllSelectableItemsSelected = (selected = []) => {
        const {node} = this.props;
        const selectableOptions = this.getOptions(node && node.data && node.data.territory).filter(option => !option.selected);
        return selected && selected.length === selectableOptions.length;
    } 

    getOptions(territories = []) {
        const result = territories.map(el => {
            el.value = el.country;
            el.label = el.country;
            el.isDisabled = el.selected;
            return el;
        });

        return result || [];
    }

    render() {
        const {node} = this.props;
        const {value} = this.state;
        const filteredValue = value && value.filter(el => el.value !== this.allOption.value);
        let options = this.getOptions(node && node.data && node.data.territory);
        if (options.filter(el => !el.selected).length > 0) {
            options = [this.allOption, ...options];
        }

        return (
            options.length > 0 ? (
                <div 
                    className="nexus-select-plan-territory-editor"
                    style={{width: '200px'}} 
                >
                    <ReactMultiSelectCheckboxes
                        options={options}
                        placeholderButtonLabel='Select'
                        getDropdownButtonLabel={({placeholderButtonLabel, value}) => {
                            if (value && value.length > 0) {
                                return (
                                    <div style={{width:'100%'}}>
                                        <span style={{maxWidth:'90%', float:'left', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap'}}>
                                            {filteredValue.map(({value}) => value).join(', ')}
                                        </span>
                                        <span style={{width:'10%', float:'left', paddingLeft:'5px'}}>
                                            {`(${filteredValue.filter(el => !el.isSelected).length} selected)`}
                                        </span>
                                    </div>
                                );
                            }
                            return placeholderButtonLabel;
                        }}
                        components={{Option}}
                        onChange={this.handleChange}
                        value={value}
                    />
                </div>
            ) : null
        );
    }
}

export default SelectPlanTerritoryEditor;
