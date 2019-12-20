import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import './TerritoryCellEditor.scss';
import TerritoryField from '../../../../containers/avail/components/TerritoryField';
import RightTerritoryFields from '../../../../components/form/RightTerritoryFields';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import Form from '@atlaskit/form';
import {getProperTerritoryFormValues} from '../../../../components/form/utils';
import {connect} from 'react-redux';

class TerritoryCellEditor extends Component {
    static propTypes = {
        options: PropTypes.array,
        value: PropTypes.array,
        isOpen: PropTypes.bool
    };

    static defaultProps = {
        options: [],
        value: null,
        isOpen: false
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            isOpen: props.isOpen,
            territoryIndex: null
        };
    }

    isPopup = () => true;

    getValue = () => this.state.value;

    // handleChange = (value) => {
    //     this.setState({value});
    // };

    onRemove = (territory) => {
        const value = this.state.value.filter(t => !isEqual(t, territory));
        this.setState({value});
    };

    onClick = (territoryIndex) => {
        this.setState({territoryIndex});
    };

    onAddClick = () => {
        this.setState({territoryIndex: -1});
    };

    onSubmitForm = (territory, index) => {
        let newTerritories = this.state.value.slice(0);
        const isEdit = !isNaN(index) && index > -1;
        const formattedTerritory = getProperTerritoryFormValues(territory, isEdit, this.state.value, index);
        if(isEdit) {
            newTerritories[index] = formattedTerritory;
        } else {
            newTerritories.push(territory);
        }
        this.setState({value: newTerritories});
        this.hideTerritoryForm();
    };

    hideTerritoryForm = () => {
        this.setState({territoryIndex: null});
    };

    renderTerritoryCreateEditFrom = (index, isEdit = false,) => {
        return (
            <Form id={'find-me'} onSubmit={(territory) => this.onSubmitForm(territory, index)}>
                {({formProps}) => (
                    <form {...formProps}>
                        <RightTerritoryFields
                            options={this.getOptions()}
                            isEdit={isEdit}
                            existingTerritoryList={this.getValue()}
                            territoryIndex={index}
                            />
                        <Button appearance="default" onClick={() => {
                            this.hideTerritoryForm();
                        }}>
                            Cancel
                        </Button>
                        <Button appearance="primary" type="submit">
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                    </form>
                )}
            </Form>
        );
    };

    getOptions = () => {
        let {options} = this.props;
        options = options.filter((rec) => (rec.countryCode)).map(rec => {
            return {
                    label: rec.countryName,
                    value: rec.countryCode
            };
        });
        return options;
};

    render() {
        const {value, territoryIndex} = this.state;

        return (
            <div className="nexus-c-territory-cell-editor">
                <TerritoryField
                    territory={value}
                    name={'territory-cell'}
                    onRemoveClick={(terr) => this.onRemove(terr)}
                    onAddClick={this.onAddClick}
                    onTagClick={this.onClick}
                    isTableMode={true}
                />
                {territoryIndex !== null && this.renderTerritoryCreateEditFrom(territoryIndex, territoryIndex > -1)}
            </div>
        );
    }
}

export default TerritoryCellEditor;

