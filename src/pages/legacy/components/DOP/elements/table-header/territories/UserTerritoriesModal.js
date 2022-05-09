import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import React from 'react';
import PropTypes from 'prop-types';
import {updateSelectedTerritories} from '../../../../../stores/actions/DOP';
import {connect} from 'react-redux';
import {getConfigApiValues} from '../../../../../../settings/CommonConfigService';
import {INPUT_TIMEOUT} from '../../../../../constants/common-ui';
import {configFields} from '../../../../../containers/metadata/service/ConfigService';
import {QuickSearch} from '@atlaskit/quick-search';
import {Checkbox} from '@atlaskit/checkbox';
import {DeleteButton, TerritoryTag} from './TerritoryItem';

const pageSize = 1000;

class UserTerritoriesModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: null,
            configTerritories: [],
            isLoading: false,
            tempSelectedTerritories: [],
        };

        this.keyInputTimeout = 0;
    }

    componentDidMount() {
        this.loadTerritoriesData();
        this.setState({
            tempSelectedTerritories: this.props.selectedTerritories,
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedTerritories !== prevProps.selectedTerritories) {
            this.setState({
                tempSelectedTerritories: this.props.selectedTerritories,
            });
        }
    }

    loadTerritoriesData = searchValue => {
        if (this.keyInputTimeout) clearTimeout(this.keyInputTimeout);

        this.keyInputTimeout = setTimeout(() => {
            this.setState({
                isLoading: true,
                searchValue: searchValue,
            });
            getConfigApiValues(configFields.LOCALE, 0, pageSize, 'countryName', 'countryName', searchValue).then(
                res => {
                    this.setState({
                        configTerritories: res.data,
                        isLoading: false,
                    });
                }
            );
        }, INPUT_TIMEOUT);
    };

    onRemoveSelected = territory => {
        const tempSelectedTerritories = this.state.tempSelectedTerritories.filter(e => e.id !== territory.id);
        this.setState({
            tempSelectedTerritories,
        });
    };

    onCheckBoxClick = event => {
        const territory = JSON.parse(event.target.value);
        const newSelectedTerritories = this.state.tempSelectedTerritories.filter(e => e.id !== territory.id);
        const tempSelectedTerritories = event.target.checked
            ? [...newSelectedTerritories, territory]
            : newSelectedTerritories;

        this.setState({
            tempSelectedTerritories,
        });
    };

    isTerritoryChecked = territory => {
        return this.state.tempSelectedTerritories.findIndex(e => e.id === territory.id) > -1;
    };

    onSave = () => {
        this.props.updateSelectedTerritories(this.state.tempSelectedTerritories);
        this.props.toggle();
    };

    getCheckbox = (c, index) => {
        return (
            <Checkbox
                key={index}
                isChecked={this.isTerritoryChecked(c)}
                value={JSON.stringify(c)}
                label={c.countryName}
                onChange={this.onCheckBoxClick}
            />
        );
    };

    toggle = () => {
        this.props.toggle();
        this.setState({
            tempSelectedTerritories: this.props.selectedTerritories,
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
                            {this.state.tempSelectedTerritories.map((e, index) => {
                                return (
                                    <TerritoryTag key={index}>
                                        {e.countryName}{' '}
                                        <DeleteButton onClick={() => this.onRemoveSelected(e)}>&times;</DeleteButton>{' '}
                                    </TerritoryTag>
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

                        <div
                            style={{
                                display: 'flex',
                                height: '100px',
                                overflowY: this.state.configTerritories.length > 6 ? 'scroll' : '',
                            }}
                        >
                            <div>
                                {this.state.configTerritories.map((c, index) => {
                                    if (index % 2 === 0) return this.getCheckbox(c, index);
                                })}
                            </div>
                            <div>
                                {this.state.configTerritories.map((c, index) => {
                                    if (index % 2 !== 0) return this.getCheckbox(c, index);
                                })}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onSave}>
                        Save
                    </Button>
                    <Button color="secondary" onClick={this.toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedTerritories: state.dopReducer.session.selectedTerritories,
    };
};

const mapDispatchToProps = {
    updateSelectedTerritories,
};

UserTerritoriesModal.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    selectedTerritories: PropTypes.array,
    updateSelectedTerritories: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(UserTerritoriesModal);
