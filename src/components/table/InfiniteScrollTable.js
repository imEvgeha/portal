import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import t from 'prop-types';

const CheckboxTable = checkboxHOC(ReactTable);

const startPageSize = 9;

class InfiniteScrollTable extends React.Component {

    static propTypes = {
        loading: t.bool,
        style: t.object,
        columns: t.array,
        data: t.array,
        pageSize:t.number,
        selection: t.array,
        selectAll: t.bool,
        sorted: t.array,
        onLoadMoreItems: t.func,
        onSortedChange: t.func,
        onSelection: t.func,
        onCellClick: t.func
    };

    constructor(props) {
        super(props);
        this.state = {
            scrollSliderLoadPercent: this.props.scrollSliderLoadPercent ? this.props.scrollSliderLoadPercent : 0.75,
            selectAll: false
        };

        this.ref = React.createRef();
    }

    componentDidMount() {
        let tbody = ReactDOM.findDOMNode(this.ref.current).getElementsByClassName('rt-tbody')[0];

        tbody.addEventListener('scroll', () => {
            let isTimeToLoad = (tbody.scrollTop + tbody.clientHeight) >= (tbody.scrollHeight * this.state.scrollSliderLoadPercent);
            let isScrollDown = this.oldScroll < tbody.scrollTop;
            this.oldScroll = tbody.scrollTop;

            if (isTimeToLoad && isScrollDown) {
                this.props.onLoadMoreItems();
            }
        });
    }

    getTrProps = (state, rowInfo) => {
        if (rowInfo && rowInfo.row) {
            const selected = this.isSelected(rowInfo.original.id);
            return {
                // onClick: () => {
                //     availDetailsModal.open(rowInfo.original, () => {}, () => {}, {onEdit: this.props.onEdit});
                // },
                style: {
                    backgroundColor: selected ? 'rgba(0,0,0,0.5)' : ''
                }
            };
        } else {
            return {};
        }
    };

    getTdProps = (state, rowInfo, column, instance) => {

        if (column.id !== '_selector') {
            return {
                onClick: (e) => {
                    this.props.onCellClick(rowInfo.original);
                },
                className: 'pointer'
            };
        } else {
            return {};
        }
    };

    toggleSelection = (key) => {
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
        this.props.onSelection(selection, this.props.selectAll);
    };

    toggleAll = () => {
        const selectAll = !this.props.selectAll;
        let oldSelection = [...this.props.selection];
        let newSelection = [];
        let selection = [];
        if (selectAll) {
            const wrappedInstance = this.ref.current.getWrappedInstance();
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            currentRecords.forEach(item => {
                newSelection.push(item._original.id);
            });
             selection = oldSelection.concat(newSelection.filter(function (item) {
                return oldSelection.indexOf(item) < 0;
            }));
        }
        this.props.onSelection(selection, selectAll);
    };

    isSelected = key => {
        return this.props.selection.includes(key);
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, getTrProps, getTdProps} = this;
        let selectAll = this.props.selectAll;

        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
            getTrProps,
            getTdProps
        };

        return (
            <CheckboxTable
                {...this.props}
                ref={this.ref}
                className={'-striped -highlight'}
                showPagination={false}
                columns={this.props.columns}
                //Add _id key for CheckboxTable purpose
                data={this.props.data.map(item => {
                    return {_id: item.id, ...item};
                })}
                sorted={this.props.sorted}
                pageSize={this.props.pageSize < startPageSize ? startPageSize : this.props.pageSize}
                style={this.props.style ? this.props.style : {}}
                manual
                onSortedChange={this.props.onSortedChange}
                loading={this.props.loading}
                {...checkboxProps}
            />
        );
    }
}

export default InfiniteScrollTable;

