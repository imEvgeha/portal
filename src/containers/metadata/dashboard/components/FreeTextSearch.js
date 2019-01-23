import React from 'react';
import PropTypes from 'prop-types';

class FreeTextSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }
    onChangeFreeText = (e) => {
        e.preventDefault();
        this.setState({
            text: e.target.value
        });
    }

    render() {
        return (<div className="input-group stylish-input-group">
            <input type="text" className="form-control" placeholder="Search"
                name={'text'}
                disabled={this.props.disabled}
                value={this.state.text}
                onChange={this.onChangeFreeText}
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
    disabled: PropTypes.bool.isRequired,
    containerId: PropTypes.string.isRequired
};

export default FreeTextSearch;