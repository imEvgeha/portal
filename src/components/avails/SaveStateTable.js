import React from 'react';
import {resultPageSelect, resultPageSort, resultPageUpdateColumnsOrder} from '../../stores/actions/avail/dashboard';
import store from '../../stores/index';

export default function withRedux(WrappedComponent){

    return class extends React.Component {
        render(){
            return <WrappedComponent
                {...this.props}

                availsMapping = {store.getState().root.availsMapping}

                availTabPageSort = {store.getState().dashboard.session.availTabPageSort}
                resultPageSort = {(sort) => store.dispatch(resultPageSort(sort))}

                availTabPageSelection = {store.getState().dashboard.session.availTabPageSelection}
                resultPageSelect = {(selection) => store.dispatch(resultPageSelect(selection))}

                columnsOrder = {store.getState().dashboard.session.columns}
                updateColumnsOrder = {(columns) => store.dispatch(resultPageUpdateColumnsOrder(columns))}
            />;
        }
    };
}