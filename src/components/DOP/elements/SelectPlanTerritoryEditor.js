import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NexusCheckboxSelect from '../../../ui-elements/nexus-checkbox-select/NexusCheckboxSelect';

class SelectPlanTerritoryEditor extends Component {
    static propTypes = {
        node: PropTypes.object,
        getPromotedRights: PropTypes.func.isRequired,
        updatePromotedRights: PropTypes.func,
    };

    static defaultProps = {
        node: {},
        updatePromotedRights: [],
    };

    constructor(props) {
        super(props);
        const right = props.getPromotedRights().find(el => el.rightId === (props.node && props.node.id));
        const value = (right && right.territories && right.territories
            .map(el => {
                return {
                    value: el, 
                    label: el,
                };
            })) || [];
        this.state = {
            value,
        };
    }

    isPopup() {
        const {node = {}} = this.props;
        const {data = {}} = node;
        const {territory = []} = data;
        const territories = (territory && territory.filter(el => el.country)) || [];
        return territories.length > 0;
    }

    getOptions(territories = []) {
        const result = territories && territories
            .filter(el => el.country)
            .map(el => {
                el.value = el.country;
                el.label = el.country;
                el.isDisabled = el.selected;
                el.isChecked = el.selected;
                return el;
            });

        return result || [];
    }

    onCheckboxSelect = values => {
        const {updatePromotedRights, getPromotedRights, node = {}} = this.props;
        const {data = {}} = node;
        const rightId = data && data.id;
        const territories = values.map(el => el.value) || [];
        const filteredRights = getPromotedRights().filter(right => right.rightId !== rightId);
        const updatedRights = (territories.length > 0 && rightId) 
            ? [...filteredRights, {rightId, territories}] 
            : filteredRights;
        return updatePromotedRights(updatedRights); 
    } 

    render() {
        const {node = {}} = this.props;
        const {data = {}} = node;
        const {value} = this.state;
        const options = this.getOptions(data && data.territory);

        return (
            options.length > 0 ? (
                <div 
                    className="nexus-c-select-plan-territory-editor"
                    style={{width: '200px'}} 
                >
                    <NexusCheckboxSelect
                        options={options}
                        defaultValues={value}
                        placeholder="Select territory"
                        onCheckboxSelectChange={this.onCheckboxSelect}
                    />
                </div>
            ) : null
        );
    }
}

export default SelectPlanTerritoryEditor;
