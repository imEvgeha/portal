import React from 'react';
import t from 'prop-types';
import {searchFormUpdateTextSearch} from '../../../../stores/actions/avail/dashboard';
import connect from 'react-redux/es/connect/connect';

const mapDispatchToProps = {
    searchFormUpdateTextSearch
};

class FreeTextSearch extends React.Component {

    static propTypes = {
        searchFormUpdateTextSearch: t.func,
        onSearch: t.func,
        containerId: t.string,
        disabled: t.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSearch() {
        this.props.searchFormUpdateTextSearch({
            text: this.state.text
        });
        this.props.onSearch({text: this.state.text});
    }

    render() {
        return (<div className="input-group stylish-input-group">
            <input type="text" className="form-control" placeholder="Search"
                name={'text'}
                disabled={this.props.disabled}
                value={this.state.text}
                onChange={this.handleInputChange}
                id={this.props.containerId + '-freetext-search-text'}
                onKeyPress={this._handleKeyPress}/>
            <div className="input-group-append">
                <button
                    type="button"
                    disabled={this.props.disabled}
                    onClick={this.handleSearch}
                    id={this.props.containerId + '-freetext-search-btn'}>
                    <i className="fas fa-search"> </i>
                </button>
            </div>
        </div>);
    }
}

export default connect(null, mapDispatchToProps)(FreeTextSearch);