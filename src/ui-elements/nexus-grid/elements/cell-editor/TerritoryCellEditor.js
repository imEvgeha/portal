import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import './TerritoryCellEditor.scss';
import TerritoryField from '../../../../containers/avail/components/TerritoryFiels';
import RightTerritoryFields from '../../../../components/form/RightTerritoryFields';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import Form from '@atlaskit/form';
import {getProperTerritoryFormValues} from '../../../../components/form/utils';
import {connect} from 'react-redux';

class TerritoryCellEditor extends Component {
    static propTypes = {
        value: PropTypes.array,
        isOpen: PropTypes.bool,
        selectValues: PropTypes.object,
    };

    static defaultProps = {
        value: null,
        isOpen: false,
        selectValues: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            isOpen: props.isOpen,
            territoryIndex: null
        };
    }

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
        let options = [];
        if (this.props.selectValues && this.props.selectValues['territory']) {
            options = this.props.selectValues['territory'];
        }

        //We fetch options from state.root.selectValues. the same as in RightDetails, but the objects are different (formatted).
        options = options.filter((rec) => (rec.value)).map(rec => {
            return {
                ...rec,
                label: rec.label || rec.value,
                aliasValue: (rec.aliasId ? (options.filter((pair) => (rec.aliasId === pair.id)).length === 1 ? options.filter((pair) => (rec.aliasId === pair.id))[0].value : null) : null)
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

const mapStateToProps = state => {
    return {
        selectValues: state.root.selectValues
    };
};

export default connect(mapStateToProps)(TerritoryCellEditor);

