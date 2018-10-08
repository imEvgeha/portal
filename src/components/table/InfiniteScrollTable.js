import React from "react";
import ReactDOM from 'react-dom'
import ReactTable from "react-table";
import {dashboardResultPageUpdate} from "../../actions";
import connect from "react-redux/es/connect/connect";

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
            scrollSliderLoadPercent: this.props.scrollSliderLoadPercent ? this.props.scrollSliderLoadPercent : 0.75
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
        this.props.renderData(0, this.props.startPageSize, this.props.pageIncrement)
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
        this.props.renderData(this.props.dashboardAvailTabPage.pages, this.props.startPageSize, this.props.pageIncrement)
            .then(response => {
                console.log("Response");
                console.log(this.props.dashboardAvailTabPage.pages);
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

    render() {
        return (
            <ReactTable ref={this.ref}
                        showPagination={false}
                        columns={this.props.columns}
                        data={this.props.dashboardAvailTabPage.avails}
                        pageSize={this.props.dashboardAvailTabPage.pageSize}
                        style={this.props.style ? this.props.style : {}}
                        manual={!!this.props.fetchData}
                        onFetchData={this.props.fetchData ? this.props.fetchData : () => null}
                        loading={this.props.sortLoading}
            />
        );
    }
}

export default connect(mapState, mapActions)(InfiniteScrollTable);

