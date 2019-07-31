import React from 'react';
import {resultPageSelect, resultPageSort, resultPageUpdateColumnsOrder} from '../../stores/actions/avail/dashboard';
import store from '../../stores/index';

export default function withRedux(WrappedComponent){

    return class extends React.Component {
        render(){
            return <WrappedComponent
                {...this.props}

                availTabPageSort = {store.getState().dashboard.session.availTabPageSort}
                resultPageSort = {resultPageSort}

                availTabPageSelection = {store.getState().dashboard.session.availTabPageSelection}
                resultPageSelect = {resultPageSelect}

                columnsOrder = {store.getState().dashboard.session.columns}
                updateColumnsOrder = {resultPageUpdateColumnsOrder}
            />;
        }
    }
}