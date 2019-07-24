import React from 'react';
import connect from 'react-redux/es/connect/connect';
import {resultPageSelect, resultPageSort, resultPageUpdateColumnsOrder} from '../../stores/actions/avail/dashboard';
import t from 'prop-types';

export default function withRedux(WrappedComponent){

    let mapStateToProps = state => {
        return {
            availTabPageSort: state.dashboard.session.availTabPageSort,
            availTabPageSelection: state.dashboard.session.availTabPageSelection,
            columnsOrder: state.dashboard.session.columns,
        };
    };

    let mapDispatchToProps = {
        resultPageSort,
        resultPageSelect,
        resultPageUpdateColumnsOrder
    };

    return connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {

        static propTypes = {
            availTabPageSort: t.array,
            resultPageSort: t.func,

            availTabPageSelection: t.object,
            resultPageSelect: t.func,

            columnsOrder: t.array,
            resultPageUpdateColumnsOrder: t.func,
        };

        constructor(props) {
            super(props);
        }



        render(){
            return <WrappedComponent
                {...this.props}

                availTabPageSort = {this.props.availTabPageSort}
                resultPageSort = {this.props.resultPageSort}

                availTabPageSelection = {this.props.availTabPageSelection}
                resultPageSelect = {this.props.resultPageSelect}

                columnsOrder = {this.props.columnsOrder}
                resultPageUpdateColumnsOrder = {this.props.resultPageUpdateColumnsOrder}
            />;
        }
    })
}