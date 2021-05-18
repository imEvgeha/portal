import React from 'react';
import PropTypes from 'prop-types';
import {searchFormUpdateTextSearch} from '../../../../stores/actions/metadata/index';
import {connect} from 'react-redux';

const mapDispatchToProps = {
    searchFormUpdateTextSearch,
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

    _handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    };

    componentDidMount() {
        this.setState({title: this.props.lastSearch});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    }

    handleSearch() {
        let {title} = this.state;
        const seasonNumber = title.match(/[S]\d{1,2}/i)?.[0].match(/\d{1,2}/)?.[0]; // match s/S ,(1-2) digits
        const episodeNumber = title.match(/[E]\d{1,2}/i)?.[0].match(/\d{1,2}/)?.[0]; // match e/E ,(1-2) digits

        let splitTitle = title.split(' ');
        if (splitTitle.length > 1) {
            if (seasonNumber && episodeNumber) {
                splitTitle.splice(splitTitle.length - 2, 2);
            } else if (seasonNumber || episodeNumber) {
                splitTitle.pop();
            }
        }
        title = splitTitle.join(' ');

        const {searchFormUpdateTextSearch, onSearch} = this.props;

        if (seasonNumber || episodeNumber) searchFormUpdateTextSearch({seriesName: title, seasonNumber, episodeNumber});
        else searchFormUpdateTextSearch({title});

        // If title was wrapped with double-quotes then do an exact search,
        // otherwise proceed with standard search
        if (title.startsWith('"') && title.endsWith('"')) {
            const strippedTitle = title.slice(1, title.length - 1); // Strip double-quotes
            if (seasonNumber || episodeNumber)
                onSearch({seriesName: strippedTitle, seasonNumber, episodeNumber, exactMatch: true});
            else onSearch({title: strippedTitle, exactMatch: true});
        } else {
            if (seasonNumber || episodeNumber) onSearch({seriesName: title, seasonNumber, episodeNumber});
            else onSearch({title});
        }
    }

    render() {
        return (
            <div className="input-group stylish-input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    name="title"
                    disabled={this.props.disabled}
                    value={this.state.title}
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
    disabled: PropTypes.bool,
    containerId: PropTypes.string,
    searchFormUpdateTextSearch: PropTypes.func,
    onSearch: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(FreeTextSearch);
