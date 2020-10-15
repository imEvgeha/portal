import React from 'react';
import {nextFrame} from '../../../../util/Common';
import {CHECKBOX_HEADER} from '../../constants/customColumnHeaders';
import {CheckBoxHeader} from './CheckBoxHeaderInternal';

export default function withSelection(SelectionWrappedComponent) {
    return props => {
        return <SelectionTable SelectionWrappedComponent={SelectionWrappedComponent} {...props} />;
    };
} // --> OFF

/* eslint react/no-unused-state: 0 */ export class SelectionTable extends React.Component {
    constructor(props) {
        super(props);

        this.setTable = this.setTable.bind(this);
        this.onDataLoaded = this.onDataLoaded.bind(this);
        this.refreshSelected = this.refreshSelected.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.clearAllSelected = this.clearAllSelected.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onSelectionChangedProcess = this.onSelectionChangedProcess.bind(this);

        const uniqueColumns = props.columns ? [...new Set([CHECKBOX_HEADER, ...props.columns])] : [CHECKBOX_HEADER];

        this.state = {
            table: null,
            colDef: [],
            selected:
                this.props.availTabPageSelection && this.props.availTabPageSelection.selected
                    ? this.props.availTabPageSelection.selected
                    : [],
            selectAll: this.props.availTabPageSelection ? this.props.availTabPageSelection.selectAll : false,
            selectNone: this.props.availTabPageSelection ? this.props.availTabPageSelection.selectNone : true,
            columns: uniqueColumns,
        };

        this.registeredOnSelect = false;
    }

    componentDidMount() {
        this.refreshColumns();
        if (this.props.setClearAllSelected) {
            this.props.setClearAllSelected(this.clearAllSelected);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.cols !== this.props.cols) {
            this.refreshColumns();
        }
        if (prevProps.columns !== this.props.columns) {
            if (this.props.columns) {
                this.setState({columns: [...new Set([CHECKBOX_HEADER, ...this.props.columns])]});
            } else {
                this.setState({columns: [CHECKBOX_HEADER]});
            }
        }

        if (prevProps.availTabPageSelection !== this.props.availTabPageSelection) {
            this.setState({
                selected: this.props.availTabPageSelection.selected,
                selectAll: this.props.availTabPageSelection.selectAll,
                selectNone: this.props.availTabPageSelection.selectNone,
            });
        }
    }

    onDataLoaded(response) {
        if (this.state.selected.length > 0) {
            this.state.table.api.forEachNode(rowNode => {
                if (rowNode.data && this.state.selected.filter(sel => sel.id === rowNode.data.id).length > 0) {
                    rowNode.setSelected(true);
                }
            });
        }

        this.onSelectionChanged();
        if (this.props.onDataLoaded) {
            this.props.onDataLoaded(response);
        }
    }

    onSelectionChanged() {
        if (!this.registeredOnSelect) {
            this.registeredOnSelect = true;
            nextFrame(this.onSelectionChangedProcess);
        }
    }

    onScroll() {
        const allVisibleSelected = this.areAllVisibleSelected();
        const oneVisibleSelected = this.isOneVisibleSelected();
        const selectionSource = this.props.availTabPageSelection ? this.props.availTabPageSelection : this.state;
        if (allVisibleSelected !== selectionSource.selectAll || oneVisibleSelected === selectionSource.selectNone) {
            this.setState({selectAll: allVisibleSelected, selectNone: !oneVisibleSelected});
            if (this.props.resultPageSelect) {
                this.props.resultPageSelect({
                    selected: this.state.selected,
                    selectAll: allVisibleSelected,
                    selectNone: !oneVisibleSelected,
                });
            }
        }
    }

    refreshSelected() {
        if (!this.state.table) return;
        this.state.table.api.deselectAll();
        this.state.table.api.forEachNode(rowNode => {
            if (rowNode.data && this.state.selected.filter(sel => sel.id === rowNode.data.id).length > 0) {
                rowNode.setSelected(true);
            }
        });
    }

    clearAllSelected() {
        if (this.state.table) {
            this.state.table.api.deselectAll();
        }
    }

    onSelectionChangedProcess() {
        this.registeredOnSelect = false;
        if (!this.state.table) return;

        if (this.props.hidden) return;

        let selected = this.state.table.api.getSelectedRows().slice(0);
        if (this.state.table.api.getDisplayedRowCount() > 0) {
            this.state.selected.map(sel => {
                if (
                    selected.filter(rec => sel.id === rec.id).length === 0 &&
                    this.state.table.api.getRowNode(sel.id) === null
                ) {
                    selected.push(sel);
                }
            });
        } else {
            if (this.state.selected && this.state.selected.length > 0) selected = selected.concat(this.state.selected);
        }
        this.setState({
            selected: selected,
            selectNone: !this.isOneVisibleSelected(),
            selectAll: this.areAllVisibleSelected(),
        });
        if (this.props.resultPageSelect) {
            this.props.resultPageSelect({
                selected: selected,
                selectNone: !this.isOneVisibleSelected(),
                selectAll: this.areAllVisibleSelected(),
            });
        }
    }

    isOneVisibleSelected() {
        const visibleRange = this.state.table.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset =
            0.7 +
            (this.state.table.api.headerRootComp.gridPanel.scrollVisibleService.horizontalScrollShowing ? 0.4 : 0);
        const visibleNodes = this.state.table.api
            .getRenderedNodes()
            .filter(
                ({rowTop, rowHeight}) =>
                    rowTop + rowHeight * topOffset > visibleRange.top &&
                    rowTop + rowHeight * bottomOffset < visibleRange.bottom
            );
        const selectedNodes = visibleNodes.filter(({selected}) => selected);
        return selectedNodes.length > 0;
    }

    areAllVisibleSelected() {
        const visibleRange = this.state.table.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset =
            0.7 +
            (this.state.table.api.headerRootComp.gridPanel.scrollVisibleService.horizontalScrollShowing ? 0.4 : 0);
        const visibleNodes = this.state.table.api
            .getRenderedNodes()
            .filter(
                ({rowTop, rowHeight}) =>
                    rowTop + rowHeight * topOffset > visibleRange.top &&
                    rowTop + rowHeight * bottomOffset < visibleRange.bottom
            );
        const selectedNodes = visibleNodes.filter(({selected}) => selected);

        return visibleNodes.length === selectedNodes.length;
    }

    staticDataLoaded(e) {
        e.api.selectAll();
    }

    refreshColumns() {
        const colDef = {
            checkbox_sel: defaultSelectionColDef,
        };
        this.setState({colDef});
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
        const {SelectionWrappedComponent} = this.props;
        return (
            <SelectionWrappedComponent
                {...this.props}
                colDef={this.state.colDef}
                columns={this.state.columns}
                setTable={this.setTable}
                onDataLoaded={this.onDataLoaded}
                rowSelection="multiple"
                onSelectionChanged={this.onSelectionChanged}
                suppressRowClickSelection={true}
                onBodyScroll={this.onScroll}
                staticDataLoaded={this.staticDataLoaded}
            />
        );
    }
}

export const defaultSelectionColDef = {
    headerName: '',
    field: CHECKBOX_HEADER,
    checkboxSelection: true,
    width: 40,
    pinned: 'left',
    resizable: false,
    suppressSizeToFit: true,
    suppressMovable: true,
    lockPosition: true,
    headerComponentFramework: CheckBoxHeader,
};
