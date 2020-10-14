import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {union} from 'lodash';
import {NexusCheckboxSelect} from '../../../../../ui/elements';

class SelectPlanTerritoryEditor extends Component {
    constructor(props) {
        super(props);
        const right = props.getPromotedRights().find(el => el.rightId === (props.node && props.node.id));
        const value =
            (right &&
                right.territories &&
                right.territories.map(el => {
                    return {
                        value: el,
                        label: el,
                    };
                })) ||
            [];
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
        const result =
            territories &&
            territories
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
        const {
            updatePromotedRights,
            getPromotedRights,
            updatePromotedRightsFullData,
            getPromotedRightsFullData,
            node = {},
        } = this.props;
        const {data = {}} = node;
        const rightId = data && data.id;

        const territories = this.getTerritoriesWithUserSelected(values);
        const filteredRights = getPromotedRights().filter(right => right.rightId !== rightId);
        const updatedRights =
            territories.length > 0 && rightId ? [...filteredRights, {rightId, territories}] : filteredRights;

        const filteredRightsFullData = getPromotedRightsFullData().filter(right => right.id !== rightId);
        const updatedRightsFullData =
            territories.length > 0 && rightId ? [...filteredRightsFullData, data] : filteredRightsFullData;
        updatePromotedRightsFullData(updatedRightsFullData);

        return updatePromotedRights(updatedRights);
    };

    getTerritoriesWithUserSelected = values => {
        let territories = values.map(el => el.value) || [];
        if (this.props.useSelectedTerritories) {
            territories = union(
                territories,
                this.props.selectedTerritories.map(el => el.countryCode)
            );
        }
        return territories || [];
    };

    render() {
        const {value} = this.state;
        const {node = {}} = this.props;
        const {data = {}} = node;
        const options = this.getOptions(data && data.territory);

        return options.length > 0 ? (
            <div className="nexus-c-select-plan-territory-editor" style={{width: '200px'}}>
                <NexusCheckboxSelect
                    options={options}
                    defaultValues={value}
                    placeholder="Select territory"
                    onCheckboxSelectChange={this.onCheckboxSelect}
                />
            </div>
        ) : null;
    }
}

SelectPlanTerritoryEditor.propTypes = {
    node: PropTypes.object,
    updatePromotedRights: PropTypes.func,
    updatePromotedRightsFullData: PropTypes.func,
    selectedTerritories: PropTypes.array,
    useSelectedTerritories: PropTypes.bool,
    getPromotedRights: PropTypes.func.isRequired,
    getPromotedRightsFullData: PropTypes.array.isRequired,
};

SelectPlanTerritoryEditor.defaultProps = {
    node: {},
    selectedTerritories: [],
    useSelectedTerritories: false,
};
export default SelectPlanTerritoryEditor;
