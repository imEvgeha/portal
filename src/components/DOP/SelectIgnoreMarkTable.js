import React from 'react';
import {CheckBoxHeader, SelectionTable} from '../common/SelectionTable';

import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {updatePromotedRights} from '../../stores/actions/DOP';
import {rightsService} from '../../containers/avail/service/RightsService';


export default function withSelectIgnoreMark(SelectionIgnoreMarkWrappedComponent) {
    return (props) => <SelectionIgnoreMarkWrappedTable
        SelectionIgnoreMarkWrappedComponent={SelectionIgnoreMarkWrappedComponent} {...props} />;
}

class SelectionIgnoreMarkWrappedTable extends SelectionTable {

    constructor(props) {
        super(props);

        this.state = {
            rowsProps: this.props.rowsProps,
            table: null,
            colDef: [],
            selected: this.props.availTabPageSelection && this.props.availTabPageSelection.selected ? this.props.availTabPageSelection.selected : [],
            selectAll: this.props.availTabPageSelection ? this.props.availTabPageSelection.selectAll : false,
            selectNone: this.props.availTabPageSelection ? this.props.availTabPageSelection.selectNone : true,
            columns: this.props.columns ? ['checkbox_sel', 'select_ignore_sel'].concat(this.props.columns) : ['checkbox_sel', 'select_ignore_sel']
        };
    }

    refreshColumns() {
        let colDef = {
            checkbox_sel: {
                headerName: '',
                checkboxSelection: true,
                width: 40,
                pinned: 'left',
                suppressResize: true,
                suppressSizeToFit: true,
                suppressMovable: true,
                lockPosition: true,
                headerComponentFramework: CheckBoxHeader
            },
            select_ignore_sel: {
                headerName: 'Select Ignore',
                width: 200,
                pinned: 'left',
                suppressResize: true,
                suppressSizeToFit: true,
                suppressMovable: true,
                lockPosition: true,
                cellRenderer: 'selectIgnoreMarkCell'
            }
        };
        this.setState({colDef: colDef});
    }

    render() {
        const {SelectionIgnoreMarkWrappedComponent} = this.props;

        const frameworkComponents = {...this.props.frameworkComponents, selectIgnoreMarkCell: selectIgnoreCell};

        return <SelectionIgnoreMarkWrappedComponent
            {...this.props}
            colDef={this.state.colDef}
            columns={this.state.columns}
            setTable={this.setTable}

            onDataLoaded={this.onDataLoaded}

            rowSelection="multiple"
            suppressRowClickSelection={true}
            onBodyScroll={this.onScroll}

            staticDataLoaded={this.staticDataLoaded}
            frameworkComponents={frameworkComponents}
        />;
    }
}


let mapStateToProps = state => {
    return {
        promotedRights: state.dopReducer.promotedRights
    };
};

let mapDispatchToProps = {
    updatePromotedRights: updatePromotedRights
};

const defaultColor = '#606060';
const selectedColor = '#D7D7D7';
const ignoredColor = '#FFFFFF';

class SelectIgnoreCell extends React.Component {

    static propTypes = {
        node: t.object,
        promotedRights: t.array,
        updatePromotedRights: t.object
    };

    constructor(props) {
        super(props);

        this.state = {
            isIgnored: false
        };
    }

    isSelected = () => {
        return this.props.promotedRights.find(e => e === this.props.node.data.id);
    };

    onSelectClick = () => {
        if (this.isSelected()) {
            this.props.updatePromotedRights(this.props.promotedRights.filter(e => e !== this.props.node.data.id));
        } else {
            this.props.updatePromotedRights([...this.props.promotedRights, this.props.node.data.id]);
        }
    };

    onIgnoreClick = () => {
        if (this.props.node.data.status === 'Ready') {
            rightsService.update({status: 'ReadyNew'}, this.props.node.data.id).then(res => {
                this.props.node.setData(res.data);
                this.setState({isIgnored: false});
            });
        } else {
            rightsService.update({status: 'Ready'}, this.props.node.data.id).then(res => {
                this.props.node.setData(res.data);
                this.setState({isIgnored: true});
            });
        }
    };

    isIgnorable = () => {
        return this.props.node.data && (this.props.node.data.status === 'Ready' || this.props.node.data.status === 'ReadyNew');
    };

    render() {
        return (
            <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <button className="btn "
                        style={{background: this.isSelected() ? selectedColor : defaultColor, margin: '5px'}}
                        onClick={this.onSelectClick}>{this.isSelected() ? 'Unselect' : 'Select'}</button>
                {this.isIgnorable() && <button className="btn "
                                               style={{ background: this.state.isIgnored ? ignoredColor : selectedColor, margin: '5px' }}
                                               onClick={this.onIgnoreClick}>{this.state.isIgnored ? 'Unignore' : 'Ignore'}</button>}
            </div>
        );
    }
}

let selectIgnoreCell = connect(mapStateToProps, mapDispatchToProps)(SelectIgnoreCell);
