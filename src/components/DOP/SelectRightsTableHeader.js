import React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import {updatePromotedRights} from '../../stores/actions/DOP';
import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {rightsService} from "../../containers/avail/service/RightsService";

export default function withSelectRightHeader(SelectRightHeaderWrappedComponent) {
    return (props) => <SelectRightsTableHeader
        SelectRightHeaderWrappedComponent={SelectRightHeaderWrappedComponent} {...props} />;
}

export class SelectRightsTableHeader extends React.Component {

    constructor(props) {
        super(props);

        this.setTable = this.setTable.bind(this);
        this.state = {
            table: null
        };
    }

    setTable(element) {
        if (element) {
            this.setState({table: element});
            if (this.props.setTable) {
                this.props.setTable(element);
            }
        }
    }

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
        return this.props.promotedRights.findIndex(e => e === node.data.id) > -1;
    };

    onBulkPromote = () => {
        let toPromote = [];
        this.props.table.api.getSelectedNodes().forEach(node => {
            if (!this.isPromoted(node)) {
                toPromote.push(node.id);
            }
        });

        this.props.updatePromotedRights([...this.props.promotedRights, ...toPromote]);

        console.log('onBulkPromote');
    };

    onBulkUnPromote = () => {
        let unPromotedRights = this.props.promotedRights.slice(0);
        this.props.table.api.getSelectedNodes().forEach(node => {
            if (this.isPromoted(node)) {
                unPromotedRights = unPromotedRights.filter(e => e !== node.data.id);
            }
        });

        this.props.updatePromotedRights(unPromotedRights);

        console.log('onBulkUnPromote');
    };

    onBulkIgnore = () => {
        this.props.table.api.getSelectedNodes().forEach(node => {
            if (node.data.status === 'ReadyNew') {
                rightsService.update({status: 'Ready'}, node.data.id).then(res => {
                    node.setData(res.data);
                    this.setState({isIgnored: true, isLoaded: false});
                });
            }
        });
        console.log('onBulkIgnore')
    };

    onBulkUnIgnore = () => {
        this.props.table.api.getSelectedNodes().forEach(node => {
            if (node.data.status === 'Ready') {
                rightsService.update({status: 'ReadyNew'}, node.data.id).then(res => {
                    node.setData(res.data);
                    this.setState({isIgnored: false, isLoaded: false});
                });
            }
        });

        console.log('onBulkUnIgnore')
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
                        <DropdownItem>Clear Selection</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}

let TabHead = connect(mapStateToProps, mapDispatchToProps)(TableHeader);
