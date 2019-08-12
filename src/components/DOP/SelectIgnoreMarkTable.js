import React, {Component} from 'react';
import {defaultSelectionColDef, SelectionTable} from '../common/SelectionTable';

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
            checkbox_sel: {...defaultSelectionColDef, headerComponentFramework: CheckBoxHeaderInternal},
            select_ignore_sel: {
                headerName: '',
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


class CheckBoxHeaderInternal extends Component {
    static propTypes = {
        api: t.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectAll: false,
            atLeastOneVisibleSelected: false
        };
        this.onCheckBoxClick = this.onCheckBoxClick.bind(this);

        this.props.api.addEventListener('viewportChanged', () => {
            this.updateState();
        });
        this.props.api.addEventListener('selectionChanged', () => {
            this.updateState();
        });
    }

    componentDidMount() {
        this.updateState();
    }

    onCheckBoxClick() {
        let visibleNodes = this.getVisibleNodes();

        if (!this.state.selectAll) {
            const notSelectedNodes = visibleNodes.filter(({selected}) => !selected);
            notSelectedNodes.forEach(node => {
                node.setSelected(true);
            });
            this.setState({selectAll: false, atLeastOneVisibleSelected: false});
        } else {
            const selectedNodes = visibleNodes.filter(({selected}) => selected);
            selectedNodes.forEach(node => {
                node.setSelected(false);
            });
            this.setState({selectAll: true, atLeastOneVisibleSelected: true});
        }
    }

    getVisibleNodes = () => {
        const visibleRange = this.props.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset = 0.7 + (this.props.api.headerRootComp.scrollVisibleService.bodyHorizontalScrollShowing ? 0.4 : 0);
        return this.props.api.getRenderedNodes().filter(({rowTop, rowHeight}) => (rowTop + rowHeight * topOffset > visibleRange.top) && (rowTop + rowHeight * bottomOffset < visibleRange.bottom));
    };

    updateState = () => {
        let visibleNodes = this.getVisibleNodes();
        let filtered = visibleNodes.filter(e => this.props.api.getSelectedRows().findIndex(s => s.id === e.id) > -1);
        let atLeastOneVisibleSelected = filtered.length > 0;

        if (this.state.atLeastOneVisibleSelected !== atLeastOneVisibleSelected) {
            this.setState({
                atLeastOneVisibleSelected
            });
        }
        let selectAll = filtered.length === visibleNodes.length;
        if (this.state.selectAll !== selectAll) {
            this.setState({
                selectAll
            });
        }
    };

    render() {
        const allVisibleSelected = this.state.selectAll;
        const atLeastOneVisibleSelected = this.state.atLeastOneVisibleSelected;

        return (
            <span className="ag-selection-checkbox" onClick={this.onCheckBoxClick}>
                <span
                    className={`ag-icon ag-icon-checkbox-checked ${atLeastOneVisibleSelected && allVisibleSelected ? '' : 'ag-hidden'}`}> </span>
                <span
                    className={`ag-icon ag-icon-checkbox-unchecked ${!atLeastOneVisibleSelected ? '' : 'ag-hidden'}`}> </span>
                <span
                    className={`ag-icon ag-icon-checkbox-indeterminate ${atLeastOneVisibleSelected && !allVisibleSelected ? '' : 'ag-hidden'}`}> </span>
            </span>
        );
    }
}


let mapStateToProps = state => {
    return {
        promotedRights: state.dopReducer.promotedRights
    };
};

let mapDispatchToProps = {
    updatePromotedRights
};

const defaultColor = '#606060';
const selectedColor = '#D7D7D7';
const ignoredColor = '#FFFFFF';

class SelectIgnoreCell extends React.Component {

    static propTypes = {
        node: t.object,
        promotedRights: t.array,
        updatePromotedRights: t.func
    };

    constructor(props) {
        super(props);

        let isIgnored = this.props.node.data && this.props.node.data.status === 'Ready';

        this.state = {
            isIgnored: isIgnored,
            isLoading: false
        };
    }

    isPromoted = () => {
        return this.props.promotedRights.find(e => e === this.props.node.data.id);
    };

    onPromoteClick = () => {
        if (this.isPromoted()) {
            this.props.updatePromotedRights(this.props.promotedRights.filter(e => e !== this.props.node.data.id));
        } else {
            this.props.updatePromotedRights([...this.props.promotedRights, this.props.node.data.id]);
        }
    };

    onIgnoreClick = () => {
        this.setState({
            isLoaded: true
        });
        if (this.props.node.data.status === 'Ready') {
            rightsService.update({status: 'ReadyNew'}, this.props.node.data.id).then(res => {
                this.props.node.setData(res.data);
                this.setState({isIgnored: false, isLoaded: false});
            });
        } else {
            rightsService.update({status: 'Ready'}, this.props.node.data.id).then(res => {
                this.props.node.setData(res.data);
                this.setState({isIgnored: true, isLoaded: false});
            });
        }
    };

    isIgnorable = () => {
        return this.props.node.data && (this.props.node.data.status === 'Ready' || this.props.node.data.status === 'ReadyNew');
    };

    render() {
        return (
            <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <button className="btn"
                        style={{background: this.isPromoted() ? selectedColor : defaultColor, margin: '5px'}}
                        onClick={this.onPromoteClick}>{this.isPromoted() ? 'Unselect' : 'Select'}</button>
                {this.isIgnorable() && <button className="btn"
                                               style={{
                                                   background: this.state.isIgnored ? ignoredColor : selectedColor,
                                                   margin: '5px'
                                               }}
                                               onClick={this.onIgnoreClick}
                                               disabled={this.state.isLoaded}>{this.state.isIgnored ? 'Unignore' : 'Ignore'}</button>}
            </div>
        );
    }
}

let selectIgnoreCell = connect(mapStateToProps, mapDispatchToProps)(SelectIgnoreCell);
