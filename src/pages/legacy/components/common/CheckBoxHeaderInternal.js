import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
    return {
        availTabPageSelection: state.dashboard.session.availTabPageSelection,
    };
};

class CheckBoxHeaderInternal extends Component {
    constructor(props) {
        super(props);
        this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
    }

    onCheckBoxClick() {
        const visibleRange = this.props.api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset =
            0.7 + (this.props.api.headerRootComp.gridPanel.scrollVisibleService.horizontalScrollShowing ? 0.4 : 0);
        const visibleNodes = this.props.api
            .getRenderedNodes()
            .filter(
                ({rowTop, rowHeight}) =>
                    rowTop + rowHeight * topOffset > visibleRange.top &&
                    rowTop + rowHeight * bottomOffset < visibleRange.bottom
            );

        if (!this.props.availTabPageSelection.selectAll) {
            const notSelectedNodes = visibleNodes.filter(({selected}) => !selected);
            notSelectedNodes.forEach(node => {
                node.setSelected(true);
            });
        } else {
            const selectedNodes = visibleNodes.filter(({selected}) => selected);
            selectedNodes.forEach(node => {
                node.setSelected(false);
            });
        }
        this.setState({});
    }

    render() {
        const allVisibleSelected = this.props.availTabPageSelection.selectAll;
        const atLeastOneVisibleSelected = !this.props.availTabPageSelection.selectNone;

        return (
            <span className="ag-selection-checkbox" onClick={this.onCheckBoxClick}>
                <span
                    className={`ag-icon ag-icon-checkbox-checked ${
                        atLeastOneVisibleSelected && allVisibleSelected ? '' : 'ag-hidden'
                    }`}
                >
                    {' '}
                </span>
                <span className={`ag-icon ag-icon-checkbox-unchecked ${!atLeastOneVisibleSelected ? '' : 'ag-hidden'}`}>
                    {' '}
                </span>
                <span
                    className={`ag-icon ag-icon-checkbox-indeterminate ${
                        atLeastOneVisibleSelected && !allVisibleSelected ? '' : 'ag-hidden'
                    }`}
                >
                    {' '}
                </span>
            </span>
        );
    }
}

CheckBoxHeaderInternal.propTypes = {
    availTabPageSelection: PropTypes.object,
    api: PropTypes.object,
};
export const CheckBoxHeader = connect(mapStateToProps, null)(CheckBoxHeaderInternal);
