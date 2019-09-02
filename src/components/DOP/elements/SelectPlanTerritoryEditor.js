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
        const right = props.getPromotedRights()
            .find(el => el.rightId === (props.node && props.node.id));
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
        const {node} = this.props;
        const territories = (node && node.data && node.data.territory && node.data.territory.filter(el => el.country)) || [];
        return territories.length > 0;
    }

    getOptions(territories = []) {
        const result = territories && territories
            .filter(el => el.country)
            .map(el => {
                el.value = el.country;
                el.label = el.country;
                el.isDisabled = el.selected;
                return el;
            });

        return result || [];
    }

    onCheckboxSelect = values => {
        console.error(values, 'values ')
        const {updatePromotedRights, getPromotedRights, node} = this.props;
        const territories = values.map(el => el.value);
        let updatedRights = getPromotedRights().filter(right => right.rightId !== node.data.id);
        console.error(getPromotedRights(), updatedRights, node.data.id);
        if (territories.length > 0) {
            const updatedRight = {
                rightId: node.data.id,
                territories,
            };
            updatedRights = [...updatedRights, updatedRight];    
        }
        return updatePromotedRights(updatedRights); 
    } 

    render() {
        const {node} = this.props;
        const {value} = this.state;
        const options = this.getOptions(node && node.data && node.data.territory);

        return (
            options.length > 0 ? (
                <div 
                    className="nexus-select-plan-territory-editor"
                    style={{width: '200px'}} 
                >
                    <NexusCheckboxSelect
                        options={options}
                        defaultValues={value}
                        placeholder="Select all"
                        onCheckboxSelectChange={this.onCheckboxSelect}
                    />
                </div>
            ) : null
        );
    }
};

export default SelectPlanTerritoryEditor;
