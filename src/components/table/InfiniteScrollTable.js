import React from "react";
import ReactDOM from 'react-dom'
import ReactTable from "react-table";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import connect from "react-redux/es/connect/connect";

import {dashboardResultPageUpdate} from "../../actions";

const CheckboxTable = checkboxHOC(ReactTable);

const mapState = state => {
    return {
        dashboardAvailTabPage: state.dashboardAvailTabPage
    };
};

const mapActions = {
    dashboardResultPageUpdate
};

class InfiniteScrollTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            scrollSliderLoadPercent: this.props.scrollSliderLoadPercent ? this.props.scrollSliderLoadPercent : 0.75,
            selection: [],
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
                this.loadMoreItems();
            }
        });
    }

    componentWillMount() {
        this.loadInitItems();
    }

    loadInitItems() {
        this.setState({loading: true});
        this.props.renderData(0, this.props.pageSize)
            .then(response => {
                    this.props.dashboardResultPageUpdate({
                        pages: 1,
                        avails: response,
                        pageSize: response.length,
                    });
                    this.setState({loading: false});
                }
            ).catch((error) => {
            this.setState({loading: false});
            console.log("Unexpected error");
            console.log(error);
        });
    }

    loadMoreItems() {
        this.setState({loading: true});
        this.props.renderData(this.props.dashboardAvailTabPage.pages, this.props.pageSize)
            .then(response => {
                this.addLoadedItems(response);
                this.setState({loading: false});
            }).catch((error) => {
            this.setState({loading: false});
            console.log("Unexpected error");
            console.log(error);
        });
    }

    addLoadedItems(items) {
        if (items.length > 0) {
            this.props.dashboardResultPageUpdate({
                pages: this.props.dashboardAvailTabPage.pages + 1,
                avails: this.props.dashboardAvailTabPage.avails.concat(items),
                pageSize: this.props.dashboardAvailTabPage.pageSize + items.length,
            });
        }
    }

    getTrProps = (state, rowInfo) => {
        if (rowInfo && rowInfo.row) {
            const selected = this.isSelected(rowInfo.original.id);
            return {
                onClick: (e) => {
                    console.log("click")
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
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key);
        }
        this.setState({selection});
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
        this.setState({selectAll, selection});
    };

    isSelected = key => {
        return this.state.selection.includes(key);
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
                data={this.props.dashboardAvailTabPage.avails.map(item => {
                    return {_id: item.id, ...item};
                })}
                pageSize={this.props.dashboardAvailTabPage.pageSize}
                style={this.props.style ? this.props.style : {}}
                manual={!!this.props.fetchData}
                onFetchData={this.props.fetchData ? this.props.fetchData : () => null}
                loading={this.props.sortLoading}
                {...checkboxProps}
            />
        );
    }
}

export default connect(mapState, mapActions)(InfiniteScrollTable);

