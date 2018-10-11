import React from 'react'
import t from "prop-types";

export default class FreeTextSearch extends React.Component {

    static propTypes = {
        onSearch: t.func,
        containerId: t.string
    };

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.onSearch();
        }
    };

    render() {
        return (<div className="input-group stylish-input-group">
            <input type="text" className="form-control" placeholder="Search"
                   id={this.props.containerId + '-freetext-search-text'}
                   onKeyPress={this._handleKeyPress} />

            <div className="input-group-append">
                <button
                    type="button"
                    className="btn"
                    onClick={this.props.onSearch}
                    id={this.props.containerId + '-freetext-search-btn'}>
                    <i className="fas fa-search"> </i>
                </button>
                {/*<span className="input-group-text" id="basic-addon">.00</span>*/}
            </div>
        </div>)
    }
}
