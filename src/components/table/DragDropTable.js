import React from 'react';
import ReactDOM from 'react-dom';
import connect from 'react-redux/es/connect/connect';
import InfiniteScrollTable from './InfiniteScrollTable';
import t from 'prop-types';

import {
    resultPageUpdateColumnsOrder
} from '../../actions/dashboard';

const mapStateToProps = state => {
    return {
        columnsOrder: state.dashboard.columns
    };
};

const mapDispatchToProps = {
    resultPageUpdateColumnsOrder: resultPageUpdateColumnsOrder
};

class DragDropTable extends React.Component {

    static propTypes = {
        columnsOrder: t.array,
        resultPageUpdateColumnsOrder: t.func,
    };

    constructor(props) {
        super(props);

        this.state=this.state || {};

        this.state.columnX = 0;
        this.state.columnY = 0;
        this.state.dragging = false;
    }

    getTheadThProps = (state, rowInfo, column, instance) => {
        return {
            onDragStart: (e) => {
                e.stopPropagation();
                //console.log('Dragging Column Info:', {state, rowInfo, column, instance, event: e});
                let header = this._closestTag(e.target, 'rt-th');

                let newState = {};
                newState.dragColumn = this._createColumnTemplate(e.target);
                //newState.dragging = true;
                newState.dragged = column.id;
                newState.columnWidth = header.getBoundingClientRect().width;
                newState.columnX = e.clientX;
                newState.columnY = e.clientY;
                this.setState(newState);
            },
            onDrag: (e) => e.stopPropagation,
            onDragEnd: (e) => {
                e.stopPropagation();
                let newState = {};
                //newState.dragging = false;
                newState.dragged = null;
                newState.currentlyOver = null;
                this.setState(newState);
            },
            onDragOver: (e) => {
                e.preventDefault();
            },
            onDrop: (e) => {
                e.preventDefault();
                const { target, dataTransfer } = e;
                if(column.id != this.state.dragged){

                    let pos1 = this.props.columnsOrder.indexOf(column.id);
                    let pos2 = this.props.columnsOrder.indexOf(this.state.dragged);

                    this.props.columnsOrder[pos1] = this.state.dragged;
                    this.props.columnsOrder[pos2] = column.id;
                }
                this.props.resultPageUpdateColumnsOrder(this.props.columnsOrder);
                this.setState({ trigger: Math.random() });
                //onDragEnd(e);
            },
            className: 'pointer',
            draggable: true
        };
    };

    dragContainer(children) {
        const dragColumn = this.state.dragging ? this._renderDragColumn() : null;
        const styles = {
            position: "relative"
        };
        return (
              <div
                onMouseUp={this.endDrag.bind(this)}
                onMouseMove={this.updatePosition.bind(this)}
                //onMouseOver={this._isOver.bind(this)}
                //onMouseLeave={this._exitWithoutChange.bind(this)}
                style={styles}
                ref={(container) => this.container = container }
                >
                { children }
                {dragColumn}
              </div>
            )
    }

    _renderDragColumn() {
        let styles = {
            position: "absolute",
            left: this.state.columnX + 10 - this.container.getBoundingClientRect().left - this.state.columnWidth /2 ,
            top: 0,
            width: this.state.columnWidth,
            border: '1px solid #ccc'
        };

        return (
            <div  style={styles}>
                { this.state.dragColumn }
            </div>
        )
    }

    _createColumnTemplate(target) {
//         transverse out from target and get table.
//         Identify what column index the target resides in the table
//         create a table, render the TH from [column index]
//         for each tr in the tbody, render the [column index] td or th

//        const header = this._closestTag(target, 'rt-th');
//        console.log('HEADER: ', header);
//        const table = this._closestTag(target, 'rt-table');
//        console.log('table: ', table);
//        console.log('table.props: ', this.props.children);
//        const tbody  = ReactDOM.findDOMNode(table).getElementsByClassName('rt-tbody')[0];
//        console.log('tbody: ', tbody);
//        const rows  = ReactDOM.findDOMNode(table).getElementsByClassName('rt-tr');
//        console.log('rows: ', rows);

//        const cellIndex = header.cellIndex;
//        const cells = [];
//        if (rows.length) { // populate cells
//            for(var i = 0; i < rows.length; i++ ) {
//                let node = rows[i].childNodes[cellIndex];
//                node ? cells.push(node) : null;
//            }
//        }
//
//        const headerMarkup = header.outerHTML;
//        const tableClass = table.className;
//        const tableRows = cells.map( (cell) => { return ( <tr dangerouslySetInnerHTML={ {__html: cell.outerHTML } }></tr> ) });

//        return (
//            <table className={tableClass}>
//                <thead>
//                    <tr dangerouslySetInnerHTML={ {__html: headerMarkup} }>
//                    </tr>
//                </thead>
//                <tbody>
//                    { tableRows }
//                </tbody>
//            </table>
//        )

        return (
             <div>
               <img src={require('./../../img/table.png')}/>
              </div>
            )
    }

//    _onStartDrag(e, column) {
//        let header = this._closestTag(e.target, 'rt-th');
//        let newState = {};
//        newState.dragColumn = this._createColumnTemplate(e.target);
//        newState.dragging = true;
//        newState.currentlySelected = column.id;
//        newState.columnWidth = header.getBoundingClientRect().width;
//        newState.columnX = e.clientX;
//        newState.columnY = e.clientY;
//        this.setState(newState);
//      }

    endDrag() {
        let newState = {};
        newState.dragging = false;
        newState.currentlySelected = undefined;
        newState.currentlyOver = null;
        this.setState(newState);
    }

//    _isOver() {
//        if (!this.state.dragging)  { return }
//        let newState = {};
////        newState.currentlyOver = this._closestTag(event.target, ['th', 'td']).cellIndex;
//        this.setState(newState);
//    }

    // Transverse up to find a table cell.
    _closestTag (element, target) {
        //console.log('FIND CLOSEST TAG FOR: ', element, target);
        if (!element || element.tagName.toLowerCase() === 'body') {
            //console.log('no parent');
            return 'Error: no parent #{target} found';
        }
        if (element.classList.contains(target)) {
            //console.log('FOUND:', element);
            return element;
        } else {
            //console.log('GO DEEPER');
            return this._closestTag(element.parentNode, target);
        }
    }

//    _reorder() {
//        this.reorder.push({ a: i, b: this.dragged });
//        let oldHeaders = [];
//        this.state.headers.forEach((header) => { oldHeaders.push(header) }); // copy current headers
//        const selectedIndex =this.state.currentlySelected;
//        const overIndex = this.state.currentlyOver;
//        let newState = {};
//        const selectedHeader = oldHeaders.splice(selectedIndex, 1)[0];
//        overIndex == 0 ? oldHeaders.unshift(selectedHeader) : oldHeaders.splice(overIndex, 0, selectedHeader);
//        newState.headers = oldHeaders;
//        this.setState(newState);
//    }

    updatePosition(event) {
        if (!this.state.dragging) { return; }
        let newState = {};
        newState.columnX = event.clientX;
        newState.columnY = event.clientY;
        this.setState(newState);
    }

    render() {
        const {getTheadThProps} = this;
        const enhancements = {
            getTheadThProps
        };
        const { rows, columns } = this.props;

        let accessors = [];
        columns.map(col => {
            accessors.push(col.accessor);
        });

        let cols=[];
        this.props.columnsOrder.map(acc => {
            cols.push(columns[accessors.indexOf(acc)]);
        });

        return this.dragContainer(
                <InfiniteScrollTable
                      {...this.props}
                      columns={cols}
                      {...enhancements}
                />
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDropTable);