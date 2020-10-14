import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CheckBoxHeaderInternal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectAll: false,
            atLeastOneVisibleSelected: false,
        };
    }

    componentDidMount() {
        const {api} = this.props;
        api.addEventListener('viewportChanged', () => this.updateState());
        api.addEventListener('selectionChanged', () => this.updateState());
        this.updateState();
    }

    onCheckBoxClick = () => {
        const visibleNodes = this.getVisibleNodes();

        if (!this.state.selectAll) {
            const notSelectedNodes = visibleNodes.filter(({selected}) => !selected);
            notSelectedNodes.forEach(node => {
                node.setSelected(true);
            });
            this.setState({selectAll: false, atLeastOneVisibleSelected: false});
            return;
        }
        const selectedNodes = visibleNodes.filter(({selected}) => selected);
        selectedNodes.forEach(node => {
            node.setSelected(false);
        });
        this.setState({selectAll: true, atLeastOneVisibleSelected: true});
    };

    getVisibleNodes = () => {
        const {api} = this.props;
        const visibleRange = api.getVerticalPixelRange();
        const topOffset = 0.4;
        const bottomOffset =
            0.7 + (api.headerRootComp.gridPanel.scrollVisibleService.horizontalScrollShowing ? 0.4 : 0);
        return (
            api
                .getRenderedNodes()
                .filter(
                    ({rowTop, rowHeight}) =>
                        rowTop + rowHeight * topOffset > visibleRange.top &&
                        rowTop + rowHeight * bottomOffset < visibleRange.bottom
                ) || []
        );
    };

    updateState = () => {
        const {api} = this.props;
        const visibleNodes = this.getVisibleNodes();
        const filtered = visibleNodes.filter(e => api.getSelectedRows().findIndex(s => s.id === e.id) > -1) || [];
        const atLeastOneVisibleSelected = filtered.length > 0;

        if (this.state.atLeastOneVisibleSelected !== atLeastOneVisibleSelected) {
            this.setState({
                atLeastOneVisibleSelected,
            });
        }

        const selectAll = filtered.length === visibleNodes.length;
        if (this.state.selectAll !== selectAll) {
            this.setState({
                selectAll,
            });
        }
    };

    render() {
        const {selectAll, atLeastOneVisibleSelected} = this.state;

        return (
            <span className="ag-selection-checkbox" onClick={this.onCheckBoxClick}>
                <span
                    className={`ag-icon ag-icon-checkbox-checked ${
                        atLeastOneVisibleSelected && selectAll ? '' : 'ag-hidden'
                    }`}
                />
                <span
                    className={`ag-icon ag-icon-checkbox-unchecked ${!atLeastOneVisibleSelected ? '' : 'ag-hidden'}`}
                />
                <span
                    className={`ag-icon ag-icon-checkbox-indeterminate ${
                        atLeastOneVisibleSelected && !selectAll ? '' : 'ag-hidden'
                    }`}
                />
            </span>
        );
    }
}

CheckBoxHeaderInternal.propTypes = {
    api: PropTypes.object,
};

CheckBoxHeaderInternal.defaultProps = {
    api: null,
};

export default CheckBoxHeaderInternal;
