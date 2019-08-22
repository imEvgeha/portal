import React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import {updatePromotedRights} from '../../stores/actions/DOP';
import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {rightsService} from '../../containers/avail/service/RightsService';

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
        promotedRights: state.dopReducer.session.promotedRights
    };
};

let mapDispatchToProps = {
    updatePromotedRights
};

class TableHeader extends React.Component {

    static propTypes = {
        table: t.object,
        promotedRights: t.array,
        updatePromotedRights: t.func
    };

    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };

    isPromoted = (node) => {
        return this.props.promotedRights.findIndex(e => e.rightId === node.data.id) > -1;
    };

    getPromotableStatus = node => {
        return  node && node.data.territory.some(({country, selected}) => country && !selected);
    }

    onBulkPromote = () => {
        const {promotedRights, updatePromotedRights, table} = this.props;
        let toPromote = [];
        table.api.getSelectedNodes().forEach(node => {
            const isPromotable = this.getPromotableStatus(node);
            if (isPromotable && !this.isPromoted(node)) {
                const territories = (node && node.data && node.data.territory) || [];
                const selectableTerritories = territories.filter(({country, selected}) => !selected && country) || [];
                const territoryNameList = selectableTerritories.map(el => el.country);
                toPromote.push({rightId: node.id, territories: territoryNameList});
            }
        });

        updatePromotedRights([...promotedRights, ...toPromote]);
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

    render() {
        return (
            <div style={{marginLeft: '20px', marginBottom: '10px'}}>
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
            </div>
        );
    }
}

let TabHead = connect(mapStateToProps, mapDispatchToProps)(TableHeader);
