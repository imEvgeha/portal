import React from 'react';
import PropTypes from 'prop-types';
import {searchFormUpdateTextSearch} from '../../../../stores/actions/metadata/index';
import {connect} from 'react-redux';

const mapDispatchToProps = {
    searchFormUpdateTextSearch
};

class FreeTextSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
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
            title: this.state.title
        });
        this.props.onSearch({title: this.state.title});
    }

    render() {
        return (<div className="input-group stylish-input-group">
            <input type="text" className="form-control" placeholder="Search"
                name={'title'}
                disabled={this.props.disabled}
                value={this.state.title}
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

FreeTextSearch.propTypes = {
    disabled: PropTypes.bool,
    containerId: PropTypes.string,
    searchFormUpdateTextSearch: PropTypes.func,
    onSearch: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(FreeTextSearch);