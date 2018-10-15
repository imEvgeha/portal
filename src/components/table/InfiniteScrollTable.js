import React from "react";
import ReactDOM from 'react-dom'
import ReactTable from "react-table";
import checkboxHOC from "react-table/lib/hoc/selectTable";

import {availDetailsModal} from "../../containers/dashboard/components/AvailDetailsModal";

const CheckboxTable = checkboxHOC(ReactTable);

class InfiniteScrollTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            scrollSliderLoadPercent: this.props.scrollSliderLoadPercent ? this.props.scrollSliderLoadPercent : 0.75,
            selectAll: false
        };

        this.ref = React.createRef();
    }

    componentDidMount() {
        let tbody = ReactDOM.findDOMNode(this.ref.current).getElementsByClassName("rt-tbody")[0];

        tbody.addEventListener("scroll", () => {
            let isTimeToLoad = (tbody.scrollTop + tbody.clientHeight) >= (tbody.scrollHeight * this.state.scrollSliderLoadPercent);
            let isScrollDown = this.oldScroll < tbody.scrollTop;
            this.oldScroll = tbody.scrollTop;

            if (isTimeToLoad && isScrollDown && !this.state.loading) {
                this.props.onLoadMoreItems();
            }
        });
    }

    fetchData = (state, instance) => {
        console.log(state);
        if (state.sortable) {
            this.props.onSort(state.sorted);
        }
    };

    getTrProps = (state, rowInfo) => {
        if (rowInfo && rowInfo.row) {
            const selected = this.isSelected(rowInfo.original.id);
            return {
                onClick: (e) => {
                    availDetailsModal.open(rowInfo.original, () => {});
                },
                style: {
                    backgroundColor: selected ? "rgba(0,0,0,0.5)" : ""
                }
            };
        } else {
            return {}
        }
    };

    toggleSelection = (key, shift, row) => {
        let selection = [...this.props.selection];
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key);
        }
        this.props.onSelection(selection)
    };

    toggleAll = () => {
        const selectAll = !this.state.selectAll;
        const selection = [];
        if (selectAll) {
            const wrappedInstance = this.ref.current.getWrappedInstance();
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            currentRecords.forEach(item => {
                selection.push(item._original.id);
            });
        }
        this.setState({selectAll});
        this.props.onSelection(selection);
    };

    isSelected = key => {
        return this.props.selection.includes(key);
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, getTrProps} = this;
        const {selectAll} = this.state;

        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: "checkbox",
            getTrProps
        };

        return (
            <CheckboxTable
                ref={this.ref}
                className={'-striped -highlight'}
                showPagination={false}
                columns={this.props.columns}
                //Add _id key for CheckboxTable purpose
                data={this.props.data.map(item => {
                    return {_id: item.id, ...item};
                })}
                pageSize={this.props.pageSize < 10 ? 10 : this.props.pageSize}
                style={this.props.style ? this.props.style : {}}
                manual={!!this.props.fetchData}
                onFetchData={this.props.fetchData ? this.props.fetchData : () => null}
                loading={this.props.sortLoading}
                {...checkboxProps}
            />
        );
    }
}

export default InfiniteScrollTable;

