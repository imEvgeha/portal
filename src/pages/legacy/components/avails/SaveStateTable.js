import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {resultPageSelect, resultPageSort, resultPageUpdateColumnsOrder} from '../../stores/actions/avail/dashboard';
import {store} from '../../../../index';

export default function withRedux(WrappedComponent) {
    const mapStateToProps = state => {
        return {
            availTabPageLoading: state.dashboard.availTabPageLoading,
        };
    };

    return connect(
        mapStateToProps,
        null
    )(
        class extends React.Component {
            render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        availTabPageLoading={this.props.availTabPageLoading}
                        availsMapping={store.getState().root.availsMapping}
                        availTabPageSort={store.getState().dashboard.session.availTabPageSort}
                        resultPageSort={sort => store.dispatch(resultPageSort(sort))}
                        availTabPageSelection={store.getState().dashboard.session.availTabPageSelection}
                        resultPageSelect={selection => store.dispatch(resultPageSelect(selection))}
                        promotedRightsFullData={store.getState().dopReducer.session.promotedRightsFullData}
                        columnsOrder={store.getState().dashboard.session.columns}
                        updateColumnsOrder={columns => store.dispatch(resultPageUpdateColumnsOrder(columns))}
                    />
                );
            }
        }
    );
}
withRedux.propTypes = {
    availTabPageLoading: PropTypes.bool,
};
