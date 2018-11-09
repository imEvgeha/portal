import React from 'react';
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
    }

    getTheadThProps = (state, rowInfo, column) => {
        return {
            onDragStart: (e) => {
                e.stopPropagation();

                let newState = {};
                newState.dragged = column.id;
                this.setState(newState);
            },
            onDrag: (e) => e.stopPropagation,
            onDragEnd: (e) => {
                e.stopPropagation();
                let newState = {};
                newState.dragged = null;
                this.setState(newState);
            },
            onDragOver: (e) => {
                e.preventDefault();
            },
            onDrop: (e) => {
                e.preventDefault();
                if(column.id != this.state.dragged){

                    let pos1 = this.props.columnsOrder.indexOf(column.id);
                    let pos2 = this.props.columnsOrder.indexOf(this.state.dragged);

                    this.props.columnsOrder.splice(pos1, 0, this.props.columnsOrder.splice(pos2, 1)[0]);
                }
                this.props.resultPageUpdateColumnsOrder(this.props.columnsOrder);
            },
            className: 'pointer',
            draggable: true
        };
    };

    render() {
        const {getTheadThProps} = this;
        const enhancements = {
            getTheadThProps
        };
        const { columns } = this.props;

        let accessors = [];
        columns.map(col => {
            accessors.push(col.accessor);
        });

        let cols=[];
        if (this.props.columnsOrder) {
            this.props.columnsOrder.map(acc => {
            if(accessors.indexOf(acc)>-1)
                cols.push(columns[accessors.indexOf(acc)]);
            });
        }

        return (
                <InfiniteScrollTable
                      {...this.props}
                      columns={cols}
                      {...enhancements}
                />
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDropTable);