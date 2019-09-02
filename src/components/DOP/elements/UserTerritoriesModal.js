import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import React from 'react';
import t from 'prop-types';
import {
    updateSelectedTerritories
} from '../../../stores/actions/DOP';
import connect from 'react-redux/es/connect/connect';
import {getConfigApiValues} from '../../../common/CommonConfigService';
import {INPUT_TIMEOUT} from '../../../constants/common-ui';
import {configFields} from '../../../containers/metadata/service/ConfigService';
import {QuickSearch} from '@atlaskit/quick-search';
import {Checkbox} from '@atlaskit/checkbox';
import {DeleteButton, TerritoryTag} from './TerritoryItem';
import union from 'lodash.union';

let mapStateToProps = state => {
    return {
        selectedTerritories: state.dopReducer.session.selectedTerritories
    };
};

let mapDispatchToProps = {
    updateSelectedTerritories
};

const pageSize = 1000;

class UserTerritoriesModal extends React.Component {

    static propTypes = {
        isOpen: t.bool,
        toggle: t.func,
        selectedTerritories: t.array,
        updateSelectedTerritories: t.func
    };

    constructor(props) {
        super(props);
        this.state = {
            searchValue: null,
            configTerritories: [],
            isLoading: false,
            tempSelectedTerritories: []
        };

        this.keyInputTimeout = 0;
        this.loadTerritoriesData();
    }

    loadTerritoriesData = (searchValue) => {
        if (this.keyInputTimeout) clearTimeout(this.keyInputTimeout);

        this.keyInputTimeout = setTimeout(() => {
            this.setState({
                isLoading: true,
                searchValue: searchValue
            });
            getConfigApiValues(configFields.LOCALE, 0, pageSize, 'countryName', 'countryName', searchValue)
                .then((res) => {
                    this.setState({
                        configTerritories: res.data.data,
                        isLoading: false,
                    });
                });
        }, INPUT_TIMEOUT);
    };

    onRemoveSelected = (territory) => {
        let newSelectedTerritories = this.getSelectedTerritories().filter(e => e.id !== territory.id);
        this.setState({
            tempSelectedTerritories: newSelectedTerritories
        });
    };

    onCheckBoxClick = (event) => {
        let territory = JSON.parse(event.target.value);
        let newSelectedTerritories = this.getSelectedTerritories().filter(e => e.id !== territory.id);
        if (event.target.checked) {
            newSelectedTerritories.push(territory);
        }
        this.setState({
            tempSelectedTerritories: newSelectedTerritories
        });
    };

    isTerritoryChecked = (territory) => {
        return this.getSelectedTerritories().findIndex(e => e.id === territory.id) > -1;
    };

    onSave = () => {
        this.props.updateSelectedTerritories(this.getSelectedTerritories());
        this.toggle();
    };

    getCheckbox = (c, index) => {
        return (<Checkbox
            key={index}
            isChecked={this.isTerritoryChecked(c)}
            value={JSON.stringify(c)}
            label={c.countryName}
            onChange={this.onCheckBoxClick}
        />);
    };
    
    getSelectedTerritories = () => {
        return union(this.props.selectedTerritories, this.state.tempSelectedTerritories);
    };

    toggle = () => {
        this.props.toggle();
        this.setState({
            tempSelectedTerritories: []
        });
    };
    
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.toggle}>
                <ModalHeader toggle={this.props.toggle}>User Territories</ModalHeader>
                <ModalBody>
                    <div style={{display: 'flex', flexDirection: 'column', padding: '5px'}}>

                        <span>Set default territories to be automatically selected on right selection</span>
                        <span>Notice: You can manually change this per right</span>

                        <div style={{flexWrap: 'wrap', marginTop: '10px', marginBottom: '10px'}}>
                            {this.getSelectedTerritories().map((e, index) => {
                                return (
                                    <TerritoryTag key={index}>{e.countryName} <DeleteButton onClick={() => this.onRemoveSelected(e)}>&times;</DeleteButton> </TerritoryTag>
                                );
                            })}
                        </div>

                        <div style={{marginTop: '10px', marginBottom: '20px'}}>
                            <QuickSearch
                                isLoading={this.state.isLoading}
                                onSearchInput={({target}) => {
                                    this.loadTerritoriesData(target.value);
                                }}
                                value={this.state.searchValue}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            height: '100px',
                            overflowY: this.state.configTerritories.length > 6 ? 'scroll' : ''
                        }}>
                            <div>{this.state.configTerritories.map((c, index) => {
                                if(index % 2 === 0) return this.getCheckbox(c, index);
                            })}
                            </div>
                            <div>{this.state.configTerritories.map((c, index) => {
                                if(index % 2 !== 0) return this.getCheckbox(c, index);
                            })}
                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onSave}>Save</Button>
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTerritoriesModal);
