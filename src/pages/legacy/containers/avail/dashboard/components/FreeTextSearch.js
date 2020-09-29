import React from 'react';
import PropTypes from 'prop-types';
import {searchFormUpdateTextSearch} from '../../../../stores/actions/avail/dashboard';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        freeTextSearch: state.dashboard.session.freeTextSearch,
    };
};

const mapDispatchToProps = {
    searchFormUpdateTextSearch,
};

class FreeTextSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.freeTextSearch.text,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.freeTextSearch !== this.props.freeTextSearch) {
            this.setState({text: this.props.freeTextSearch.text});
        }
    }

    _handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    }

    handleSearch() {
        this.props.searchFormUpdateTextSearch({
            text: this.state.text,
        });
        this.props.onSearch({text: this.state.text});
    }

    render() {
        return (
            <div className="input-group stylish-input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    name="text"
                    disabled={this.props.disabled}
                    value={this.state.text}
                    onChange={this.handleInputChange}
                    id={this.props.containerId + '-freetext-search-text'}
                    onKeyPress={this._handleKeyPress}
                />
                <div className="input-group-append">
                    <button
                        type="button"
                        disabled={this.props.disabled}
                        onClick={this.handleSearch}
                        id={this.props.containerId + '-freetext-search-btn'}
                    >
                        <i className="fas fa-search"> </i>
                    </button>
                </div>
            </div>
        );
    }
}

FreeTextSearch.propTypes = {
    searchFormUpdateTextSearch: PropTypes.func,
    onSearch: PropTypes.func,
    containerId: PropTypes.string,
    disabled: PropTypes.bool,
    freeTextSearch: PropTypes.object,
};
export default connect(mapStateToProps, mapDispatchToProps)(FreeTextSearch);
