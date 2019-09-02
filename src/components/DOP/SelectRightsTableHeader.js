import React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Tooltip} from 'reactstrap';
import {updatePromotedRights, updateSelectedTerritories, updateUseSelectedTerritories} from '../../stores/actions/DOP';
import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {rightsService} from '../../containers/avail/service/RightsService';
import styled from 'styled-components';
import {colors} from '@atlaskit/theme';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import ToggleButton from 'react-toggle-button';
import UserTerritoriesModal from './elements/UserTerritoriesModal';
import union from 'lodash.union';
import {DeleteButton, TerritoryTag} from './elements/TerritoryItem';

export default function withSelectRightHeader(SelectRightHeaderWrappedComponent) {
    return (props) => <SelectRightsTableHeader
        SelectRightHeaderWrappedComponent={SelectRightHeaderWrappedComponent} {...props} />;
}

export class SelectRightsTableHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            table: null
        };
    }

    setTable = (element) => {
        if (element) {
            this.setState({table: element});
            if (this.props.setTable) {
                this.props.setTable(element);
            }
        }
    };

    render() {
        const {SelectRightHeaderWrappedComponent} = this.props;
        return (
            <div>
                <TabHead table={this.state.table}/>
                <SelectRightHeaderWrappedComponent
                    {...this.props}
                    setTable={this.setTable}
                />
            </div>
        );
    }
}


let mapStateToProps = state => {
    return {
        promotedRights: state.dopReducer.session.promotedRights,
        selectedTerritories: state.dopReducer.session.selectedTerritories,
        useSelectedTerritories: state.dopReducer.session.useSelectedTerritories
    };
};

let mapDispatchToProps = {
    updatePromotedRights,
    updateUseSelectedTerritories,
    updateSelectedTerritories
};

const IconExplorerLink = styled.a`
  &,
  &:hover,
  &:active,
  &:focus {
    border-radius: 5px;
    color: inherit;
    cursor: pointer;
    display: block;
    line-height: 0;
    padding: 10px;
  }

  &:hover {
    background: ${colors.N30A};
  }
`;

class TableHeader extends React.Component {

    static propTypes = {
        table: t.object,
        promotedRights: t.array,
        updatePromotedRights: t.func,
        selectedTerritories: t.array,
        useSelectedTerritories: t.bool,
        updateUseSelectedTerritories: t.func,
        updateSelectedTerritories: t.func
    };

    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            isUserTerritoriesModalOpen: false,
            isOpenTooltip: false
        };
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };

    toggleTooltip = () => {
        this.setState(prevState => ({
            isOpenTooltip: !prevState.isOpenTooltip
        }));
    }

    isPromoted = (node) => {
        return this.props.promotedRights.findIndex(e => e.rightId === node.data.id) > -1;
    };

    getPromotableStatus = node => {
        return  node && node.data.territory.some(({country, selected}) => country && !selected);
    };

    onBulkPromote = () => {
        const {promotedRights, updatePromotedRights, table} = this.props;
        let toPromote = [];
        table.api.getSelectedNodes().forEach(node => {
            const isPromotable = this.getPromotableStatus(node);
            if (isPromotable && !this.isPromoted(node)) {
                const territories = (node && node.data && node.data.territory) || [];
                const newTerritories = this.getTerritoriesWithUserSelected(territories);

                toPromote.push({rightId: node.id, territories: newTerritories});
            }
        });

        updatePromotedRights([...promotedRights, ...toPromote]);
    };

    getTerritoriesWithUserSelected = (territories) => {
        const selectableTerritories = territories.filter(({country, selected}) => !selected && country) || [];
        let newTerritories = selectableTerritories.map(el => el.country);
        if (this.props.useSelectedTerritories) {
            const userSelectedTerritoryList = this.props.selectedTerritories.map((el => el.countryCode));
            newTerritories = union(newTerritories, userSelectedTerritoryList);
        }
        return newTerritories;
    };

    onBulkUnPromote = () => {
        const {promotedRights, updatePromotedRights, table} = this.props;
        let unPromotedRights = promotedRights.slice(0);
        table.api.getSelectedNodes().forEach(node => {
            if (this.isPromoted(node)) {
                unPromotedRights = unPromotedRights.filter(e => e.rightId !== node.data.id);
            }
        });

        updatePromotedRights(unPromotedRights);
    };

    onBulkIgnore = () => {
        this.props.table.api.getSelectedNodes().forEach(node => {
            if (node.data.status === 'ReadyNew') {
                rightsService.update({status: 'Ready'}, node.data.id).then(res => {
                    node.setData(res.data);
                    this.props.table.api.redrawRows({rowNodes: [node]});
                });
            }
        });
    };

    onBulkUnIgnore = () => {
        this.props.table.api.getSelectedNodes().forEach(node => {
            if (node.data.status === 'Ready') {
                rightsService.update({status: 'ReadyNew'}, node.data.id).then(res => {
                    node.setData(res.data);
                    this.props.table.api.redrawRows({rowNodes: [node]});
                });
            }
        });
    };

    onClearSelection = () => {
        this.props.table.api.getSelectedNodes().forEach(n => {
            n.setSelected(false);
        });
    };

    toggleModal = () => {
        this.setState({ isUserTerritoriesModalOpen: !this.state.isUserTerritoriesModalOpen });
    };

    onRemoveSelectedTerritory = (territory) => {
        let filteredTerritories = this.props.selectedTerritories.filter(el => el.id !== territory.id);
        this.props.updateSelectedTerritories(filteredTerritories);
    };

    render() {
        return (
            <div style={{marginLeft: '20px', marginBottom: '10px', display: 'flex', paddingLeft: '10px', paddingRight: '10px',  justifyContent: 'space-between'}}>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle color="light">
                        <b>...</b>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={this.onBulkPromote}>Select</DropdownItem>
                        <DropdownItem onClick={this.onBulkUnPromote}>Unselect</DropdownItem>
                        <DropdownItem onClick={this.onBulkIgnore}>Ignore</DropdownItem>
                        <DropdownItem onClick={this.onBulkUnIgnore}>Unignore</DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem onClick={this.onClearSelection}>Clear Selection</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <div id='selectedUserTerritories' style={{ display: 'flex', alignItems: 'center', verticalAlign: 'middle'}}>
                    <span >User Territories: </span>
                    <IconExplorerLink onClick={this.toggleModal}>
                        <ShortcutIcon  size='small'/>
                    </IconExplorerLink>
                    <Tooltip style={{background: '#ffffff', border: '1px solid #000', weight:'100px'}} target='selectedUserTerritories' autohide={false} placement='bottom' isOpen={this.state.isOpenTooltip} toggle={this.toggleTooltip}>
                        <div style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: '2px', marginBottom: '2px'}}>
                            {this.props.selectedTerritories.map((e, index) => {
                                return (
                                    <TerritoryTag key={index}>{e.countryName} <DeleteButton onClick={() => this.onRemoveSelectedTerritory(e)}>&times;</DeleteButton> </TerritoryTag>
                                );
                            })}
                        </div>
                    </Tooltip>
                    <ToggleButton
                        value={ this.props.useSelectedTerritories }
                        onToggle={(useSelectedTerritories) => this.props.updateUseSelectedTerritories(!useSelectedTerritories)} />

                    <UserTerritoriesModal isOpen={this.state.isUserTerritoriesModalOpen} toggle={this.toggleModal}/>

                </div>
            </div>
        );
    }
}

let TabHead = connect(mapStateToProps, mapDispatchToProps)(TableHeader);
