import React from 'react';
import {CheckBoxHeader, SelectionTable} from '../common/SelectionTable';

import styled, {css} from 'styled-components';
import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {updatePromotedRights} from '../../stores/actions/DOP';


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


const SelectionButton = styled.a`
    display: inline-block;
    border-radius: 3px;
    margin: 10px;
    
    ${props => props.isSelected && css`
        background-color: #D7D7D7;
        &:hover {background-color: #606060;}
    `}
    ${props => !props.isSelected && css`
        background-color: #606060;
        &:hover {background-color: #D7D7D7;}
    `}
`;

const IgnoreButton = styled.a`
    display: inline-block;
    border-radius: 3px;
    margin: 10px;
    
    ${props => props.isIgnored && css`
        background-color: #FFFFFF;
        &:hover {background-color: #D7D7D7;}
    `}
    ${props => !props.isIgnored && css`
        background-color: #D7D7D7;
        &:hover {background-color: #FFFFFF;}
    `}
`;

let mapStateToProps = state => {
    return {
        promotedRights: state.dopReducer.promotedRights
    };
};

let mapDispatchToProps = {
    updatePromotedRights: updatePromotedRights
};

class SelectIgnoreCell extends React.Component {

    static propTypes = {
        node: t.object,
        data: t.object,
        promotedRights: t.array,
        // updatePromotedRights: t.fun
    };

    constructor(props) {
        super(props);
        // console.log(props)
    }

    isSelected = () => {
        return this.props.promotedRights.find(e => e === this.props.data.id);
    };

    isIgnored = () => {
        return this.props.data.status === 'Ready';
    };

    onSelectClick = () => {
        if (this.isSelected()) {
            this.props.updatePromotedRights(this.props.promotedRights.filter(e => e !== this.props.data.id));
        } else {
            this.props.updatePromotedRights([...this.props.promotedRights, this.props.data.id]);
        }
    };

    onIgnoreClick = () => {
        if (this.isIgnored()) {
            console.log('Unignore', this.props.data.id);
        } else {
            console.log('Ignore', this.props.data.id);
        }
    };

    render() {
        return (
            <div>
                {/*<ButtonGroup appearance="primary">*/}
                    <SelectionButton isSelected={this.isSelected()} onClick={this.onSelectClick}>{this.isSelected() ? 'Unselect' : 'Select'}</SelectionButton>
                    <IgnoreButton isIgnored={this.isIgnored()} onClick={this.onIgnoreClick}>{this.isIgnored() ? 'Unignore' : 'Ignore'}</IgnoreButton>
                {/*</ButtonGroup>*/}
            </div>
        );
    }
}

let selectIgnoreCell = connect(mapStateToProps, mapDispatchToProps)(SelectIgnoreCell);
