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
import styled from 'styled-components';

let mapStateToProps = state => {
    return {
        selectedTerritories: state.dopReducer.session.selectedTerritories
    };
};

let mapDispatchToProps = {
    updateSelectedTerritories
};

const pageSize = 1000;

const TerritoryTag = styled.div`
    padding: 10px;
    border: 1px solid #EEE;
    color: #111;
    font-weight: bold;
    display: inline-block;
    margin-right: 2px;
    font-size: 14px;
    margin-top: 2px;
`;

const DeleteButton = styled.div`
    color: #c0392b;
    display: inline-block;
    cursor: pointer;
    &:hover {
        color: #e74c3c;
    }
`;

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
            selectedTerritories: this.props.selectedTerritories
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
        let newSelectedTerritories = this.state.selectedTerritories.filter(e => e.id !== territory.id);
        this.setState({
            selectedTerritories: newSelectedTerritories
        });
    };

    onCheckBoxClick = (event) => {
        let territory = JSON.parse(event.target.value);
        let newSelectedTerritories = this.state.selectedTerritories.filter(e => e.id !== territory.id);
        if (event.target.checked) {
            newSelectedTerritories.push(territory);
        }
        this.setState({
            selectedTerritories: newSelectedTerritories
        });
    };

    isTerritoryChecked = (territory) => {
        return this.state.selectedTerritories.findIndex(e => e.id === territory.id) > -1;
    };

    onSave = () => {
        this.props.updateSelectedTerritories(this.state.selectedTerritories);
        this.props.toggle();
    };

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>User Territories</ModalHeader>
                <ModalBody>
                    <div style={{display: 'flex', flexDirection: 'column', padding: '5px'}}>

                        <span>Set default territories to be automatically selected on right selection</span>
                        <span>Notice: You can manually change this per right</span>

                        <div style={{flexWrap: 'wrap', marginTop: '10px', marginBottom: '10px'}}>
                            {this.state.selectedTerritories.map((e, index) => {
                                return (
                                    <TerritoryTag key={index}>{e.countryName} <DeleteButton onClick={() => this.onRemoveSelected(e)}>&times;</DeleteButton> </TerritoryTag>
                                );
                            })}
                        </div>

                        <div style={{marginTop: '10px', marginBottom: '10px'}}>
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
                            overflowY: this.state.configTerritories.length > 3 ? 'scroll' : ''
                        }}>
                            <div>{this.state.configTerritories.map((c, index) => {
                                if(index % 2 === 0) return (<Checkbox
                                    key={index}
                                    isChecked={this.isTerritoryChecked(c)}
                                    value={JSON.stringify(c)}
                                    label={c.countryName}
                                    onChange={this.onCheckBoxClick}
                                />
                                );
                            })}
                            </div>
                            <div>{this.state.configTerritories.map((c, index) => {
                                if(index % 2 !== 0) return (<Checkbox
                                        key={index}
                                        isChecked={this.isTerritoryChecked(c)}
                                        value={JSON.stringify(c)}
                                        label={c.countryName}
                                        onChange={this.onCheckBoxClick}
                                    />
                                );
                            })}
                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onSave}>Save</Button>
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTerritoriesModal);
