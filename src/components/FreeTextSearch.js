import React from 'react'
import t from "prop-types";
import {dashboardUpdateSearchForm} from "../actions";
import connect from "react-redux/es/connect/connect";


const mapState = state => {
    return {
        dashboardSearchCriteria: state.dashboardSearchCriteria
    };
};

const mapActions = {
    dashboardUpdateSearchForm
};

class FreeTextSearch extends React.Component {

    static propTypes = {
        onSearch: t.func,
        containerId: t.string
    };

    constructor (props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSerach = this.handleSerach.bind(this);
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleSerach();
        }
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.props.dashboardUpdateSearchForm({
            [name]: value
        });
    }

    handleSerach() {
        this.props.onSearch(this.props.dashboardSearchCriteria);
    }

    render() {
        return (<div className="input-group stylish-input-group">
            <input type="text" className="form-control" placeholder="Search"
                   name={'searchText'}
                   value={this.props.dashboardSearchCriteria.searchText}
                   onChange={this.handleInputChange}
                   id={this.props.containerId + '-freetext-search-text'}
                   onKeyPress={this._handleKeyPress} />

            <div className="input-group-append">
                <button
                    type="button"
                    className="btn"
                    onClick={this.handleSerach}
                    id={this.props.containerId + '-freetext-search-btn'}>
                    <i className="fas fa-search"> </i>
                </button>
                {/*<span className="input-group-text" id="basic-addon">.00</span>*/}
            </div>
        </div>)
    }
}


export default connect(mapState, mapActions)(FreeTextSearch)