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
        title = title.trim();
        let seasonNumber = title.match(/[S]\d{1,2}/i)?.[0].match(/\d{1,2}/)?.[0]; // match s/S ,(1-2) digits
        let episodeNumber = title.match(/[E]\d{1,2}/i)?.[0].match(/\d{1,2}/)?.[0]; // match e/E ,(1-2) digits

        let splitTitle = title.split(' ');

        if (splitTitle.length > 1) {
            if (seasonNumber && episodeNumber) {
                // remove only last word for cases S01E03
                if(splitTitle[splitTitle.length-1].match(/[S]\d{1,2}/i) && splitTitle[splitTitle.length-1].match(/[E]\d{1,2}/i))
                    splitTitle.pop();
                else // remove last two words in case S02 E05
                    splitTitle.splice(splitTitle.length - 2, 2);
            } else if (seasonNumber || episodeNumber) {
                // remove last word if only season or episode is provided
                splitTitle.pop();
            }
            title = splitTitle.join(' ');
        }
        else {
            if (seasonNumber || episodeNumber) {
                title = ''
            }
            else {
                seasonNumber = '';
                episodeNumber = '';
            }
        }

        const {searchFormUpdateTextSearch, onSearch} = this.props;

        if (seasonNumber || episodeNumber) {
            searchFormUpdateTextSearch({title: '', seriesName: title, seasonNumber, episodeNumber});
        }
        else searchFormUpdateTextSearch({title, seriesName: '', seasonNumber, episodeNumber});

        // If title was wrapped with double-quotes then do an exact search,
        // otherwise proceed with standard search
        if (title.startsWith('"') && title.endsWith('"')) {
            const strippedTitle = title.slice(1, title.length - 1); // Strip double-quotes
            if (seasonNumber || episodeNumber)
                onSearch({title: '', seriesName: strippedTitle, seasonNumber, episodeNumber, exactMatch: true});
            else onSearch({title: strippedTitle, seriesName: '', exactMatch: true, seasonNumber, episodeNumber});
        } else {
            if (seasonNumber || episodeNumber) {
                onSearch({title: '', seriesName: title, seasonNumber, episodeNumber});
            }
            else onSearch({title, seriesName: '', seasonNumber, episodeNumber});
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
