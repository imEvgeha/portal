import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteScrollTable from './InfiniteScrollTable';

class DragDropTable extends React.Component {

    constructor(props) {
        super(props);

        this.state=this.state || {};
//        this.state.columnX = 0;
//        this.state.columnY = 0;
//        this.state.dragging = false;

        this.reorder = [];

//        this._createColumnTemplate.bind(this);
//        this._onStartDrag.bind(this);
    }

    getTheadThProps = (state, rowInfo, column, instance) => {
        if (column.id === 'title') {
            return {
                onMouseDown: (e) => {
                    e.stopPropagation();
                    //this._onStartDrag(e, column);
                    console.log('AHA', {
                        state,
                        rowInfo,
                        column,
                        instance,
                        event: e
                    });
                },
                className: 'pointer',
                draggable: true
            };
        } else {
            return {};
        }
    };

     componentDidMount() {
        this.mountEvents();
      }

      componentDidUpdate() {
        this.mountEvents();
      }

      mountEvents() {
          const headers = Array.prototype.slice.call(
            document.querySelectorAll(".rt-resizable-header")
          );
         headers.forEach((header, i) => {
               header.setAttribute("draggable", true);
               //the dragged header
               header.ondragstart = e => {
                 e.stopPropagation();
                 this.dragged = i;
               };

               header.ondrag = e => e.stopPropagation;

               header.ondragend = e => {
                 e.stopPropagation();
                 //setTimeout(() => (this.dragged = null), 1000);
               };

               //the dropped header
               header.ondragover = e => {
                 e.preventDefault();
               };

               header.ondrop = e => {
                 e.preventDefault();
                 const { target, dataTransfer } = e;
                 this.reorder.push({ a: i, b: this.dragged });
                 this.setState({ trigger: Math.random() });
               };
             });
      }

//    dragContainer(children) {
//        const dragColumn = this.state.dragging ? this._renderDragColumn() : null;
//        const styles = {
//            position: "relative"
//        };
//        return (
//              <div
//                onMouseUp={this._endDrag.bind(this)}
//                onMouseMove={this._updateStyles.bind(this)}
//                //onMouseOver={this._isOver.bind(this)}
//                //onMouseLeave={this._exitWithoutChange.bind(this)}
//                style={styles}
//                ref={(container) => this.container = container }
//                >
//                { children }
//                {dragColumn}
//              </div>
//            )
//    }

//    _exitWithoutChange() {
//        let newState = {};
//        newState.dragging = false;
//        newState.currentlySelected = undefined;
//        newState.currentlyOver = undefined;
//        this.setState(newState);
//    }

//    _renderDragColumn() {
//        let styles = {
//            position: "absolute",
//            left: this.state.columnX + 10 - this.container.getBoundingClientRect().left,
//            top: 0,
//            width: this.state.columnWidth,
//            border: '1px solid #ccc'
//        };
//
//        return (
//            <div  style={styles}>
//                { this.state.dragColumn }
//            </div>
//        )
//    }

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

//    _endDrag() {
//        this._reorder();
//        this._clearDragState();
//    }

//    _clearDragState() {
//        let newState = {};
//        newState.dragging = false;
//        newState.currentlySelected = undefined;
//        newState.currentlyOver = undefined;
//        this.setState(newState);
//    }

//    _isOver() {
//        if (!this.state.dragging)  { return }
//        let newState = {};
////        newState.currentlyOver = this._closestTag(event.target, ['th', 'td']).cellIndex;
//        this.setState(newState);
//    }

    // Transverse up to find a table cell.
//    _closestTag (element, target) {
//        console.log('FIND CLOSEST TAG FOR: ', element, target);
//        if (!element || element.tagName.toLowerCase() === 'body') { console.log('no parent'); return 'Error: no parent #{target} found'; }
//        if (element.classList.contains(target)) { console.log('FOUND:', element); return element; }
//        else { console.log('GO DEEPER');return this._closestTag(element.parentNode, target); }
//    }

    _reorder() {
        this.reorder.push({ a: i, b: this.dragged });
//        let oldHeaders = [];
//        this.state.headers.forEach((header) => { oldHeaders.push(header) }); // copy current headers
//        const selectedIndex =this.state.currentlySelected;
//        const overIndex = this.state.currentlyOver;
//        let newState = {};
//        const selectedHeader = oldHeaders.splice(selectedIndex, 1)[0];
//        overIndex == 0 ? oldHeaders.unshift(selectedHeader) : oldHeaders.splice(overIndex, 0, selectedHeader);
//        newState.headers = oldHeaders;
//        this.setState(newState);
    }

//    _updateStyles(event) {
//        if (!this.state.dragging) { return; }
//        let newState = {};
//        newState.columnX = event.clientX;
//        newState.columnY = event.clientY;
//        this.setState(newState);
//    }

    render() {
        const {getTheadThProps} = this;
        const enhancements = {
            //getTheadThProps
        };
        const { rows, columns } = this.props;
        const cols = columns.map(col => ({
              ...col,
               Header: <span className="draggable-header">{col.Header}</span>
        }));
        this.reorder.forEach(o => cols.splice(o.a, 0, cols.splice(o.b, 1)[0]));
        return (//this.dragContainer(
                <InfiniteScrollTable
                      {...this.props}
                      columns={cols}
                      {...enhancements}
                />
            );
    }
}

export default DragDropTable;