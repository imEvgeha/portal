import React from "react";
import ReactDOM from 'react-dom'
import ReactTable from "react-table";

class InfiniteScrollTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            pages: 1,
            pageSize: this.props.startPageSize,
            scrollSliderLoadPercent: this.props.scrollSliderLoadPercent ? this.props.scrollSliderLoadPercent : 0.75
        };

        this.loadInitItems();
        this.ref = React.createRef();
    }

    componentDidMount() {
        let tbody = ReactDOM.findDOMNode(this.ref.current).getElementsByClassName("rt-tbody")[0];

        tbody.addEventListener("scroll", () => {
            let isTimeToLoad = (tbody.scrollTop + tbody.clientHeight) >= (tbody.scrollHeight * this.state.scrollSliderLoadPercent);
            if (isTimeToLoad && !this.state.loading) {
                this.loadMoreItems();
            }
        });
    }

    loadInitItems() {
        this.props.renderData(0, this.props.startPageSize, this.props.pageIncrement)
            .then(response => {
                    console.log(response);
                    this.setState({data: response})
                }
            ).catch(() => {
            console.log("Unexpected error");
        });
    }

    loadMoreItems() {
        this.setState({loading: true});
        this.props.renderData(this.state.pages, this.props.startPageSize, this.props.pageIncrement)
            .then(response => {
                this.setLoadedItems(response)
            }).catch(() => {
            console.log("Unexpected error");
        });
    }

    setLoadedItems(items) {
        if (items.length > 0) {
            this.setState((state) => ({
                data: state.data.concat(items),
                pageSize: state.pageSize + items.length,
                pages: state.pages + 1,
                loading: false
            }));
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        return (
            <ReactTable ref={this.ref}
                        showPagination={false}
                        data={this.state.data}
                        columns={this.props.columns}
                        pageSize={this.state.pageSize}
                        style={this.props.style ? this.props.style : {}}
                        className = {'-striped -highlight'}
            />
        );
    }
}

export default InfiniteScrollTable;

